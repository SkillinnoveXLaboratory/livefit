const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const {
  bucket,
  isR2Configured,
  listR2Objects,
  uploadR2Object,
} = require('../lib/r2Storage');

const imagesDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');

const contentTypeByExtension = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

async function getFiles(directory) {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? getFiles(fullPath) : [fullPath];
  }));
  return files.flat();
}

async function runPool(items, worker, concurrency = 8) {
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      await worker(current);
    }
  });
  await Promise.all(runners);
}

async function migrateImages() {
  if (!isR2Configured) {
    throw new Error('Cloudflare R2 environment variables are incomplete');
  }

  if (!fs.existsSync(imagesDir)) {
    const bucketObjects = await listR2Objects('images/');
    console.log(JSON.stringify({
      bucket,
      localDirectory: 'removed',
      bucketImageObjects: bucketObjects.length,
    }, null, 2));
    return;
  }

  const files = await getFiles(imagesDir);
  const existingObjects = await listR2Objects('images/');
  const existingKeys = new Set(existingObjects.map((object) => object.Key));
  let uploaded = 0;
  let skipped = 0;

  await runPool(files, async (filePath) => {
    const relativePath = path.relative(imagesDir, filePath).split(path.sep).join('/');
    const key = `images/${relativePath}`;
    if (existingKeys.has(key)) {
      skipped += 1;
      return;
    }

    const body = await fs.promises.readFile(filePath);
    const contentType = contentTypeByExtension[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    await uploadR2Object(key, body, contentType);
    uploaded += 1;
    console.log(`Uploaded: ${key}`);
  });

  const bucketObjects = await listR2Objects('images/');
  const bucketKeys = new Set(bucketObjects.map((object) => object.Key));
  const missing = files
    .map((filePath) => `images/${path.relative(imagesDir, filePath).split(path.sep).join('/')}`)
    .filter((key) => !bucketKeys.has(key));

  console.log(JSON.stringify({
    bucket,
    localFiles: files.length,
    uploaded,
    skipped,
    bucketImageObjects: bucketObjects.length,
    missing,
  }, null, 2));

  if (missing.length > 0) {
    process.exitCode = 1;
  }
}

migrateImages().catch((error) => {
  console.error('R2 public image migration failed:', error);
  process.exitCode = 1;
});

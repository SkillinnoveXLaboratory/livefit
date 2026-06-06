const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const {
  bucket,
  isR2Configured,
  listR2Objects,
  r2ObjectExists,
  uploadR2Object,
} = require('../lib/r2Storage');

const uploadsDir = path.join(__dirname, '..', 'uploads');

const contentTypeByExtension = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

async function migrateUploads() {
  if (!isR2Configured) {
    throw new Error('Cloudflare R2 environment variables are incomplete');
  }

  const files = (await fs.promises.readdir(uploadsDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  let uploaded = 0;
  let skipped = 0;

  for (const fileName of files) {
    const key = `uploads/${fileName}`;
    if (await r2ObjectExists(key)) {
      skipped += 1;
      console.log(`Skipped existing: ${key}`);
      continue;
    }

    const body = await fs.promises.readFile(path.join(uploadsDir, fileName));
    const contentType = contentTypeByExtension[path.extname(fileName).toLowerCase()] || 'application/octet-stream';
    await uploadR2Object(key, body, contentType);
    uploaded += 1;
    console.log(`Uploaded: ${key}`);
  }

  const bucketObjects = await listR2Objects('uploads/');
  const missing = [];
  for (const fileName of files) {
    if (!bucketObjects.some((object) => object.Key === `uploads/${fileName}`)) {
      missing.push(fileName);
    }
  }

  console.log(JSON.stringify({
    bucket,
    localFiles: files.length,
    uploaded,
    skipped,
    bucketUploadObjects: bucketObjects.length,
    missing,
  }, null, 2));

  if (missing.length > 0) {
    process.exitCode = 1;
  }
}

migrateUploads().catch((error) => {
  console.error('R2 migration failed:', error);
  process.exitCode = 1;
});

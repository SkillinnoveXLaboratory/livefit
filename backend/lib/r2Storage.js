const {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} = require('@aws-sdk/client-s3');

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
const bucket = process.env.CLOUDFLARE_R2_BUCKET || '';
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT || (accountId
  ? `https://${accountId}.r2.cloudflarestorage.com`
  : '');

const isR2Configured = Boolean(bucket && endpoint && accessKeyId && secretAccessKey);

const r2Client = isR2Configured
  ? new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

function normalizeObjectKey(value = '') {
  return String(value).replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+/, '');
}

function requireR2() {
  if (!r2Client || !isR2Configured) {
    throw new Error('Cloudflare R2 is not configured');
  }

  return r2Client;
}

async function uploadR2Object(key, body, contentType = 'application/octet-stream') {
  const client = requireR2();
  const objectKey = normalizeObjectKey(key);

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  return objectKey;
}

async function getR2Object(key) {
  return requireR2().send(new GetObjectCommand({
    Bucket: bucket,
    Key: normalizeObjectKey(key),
  }));
}

async function deleteR2Object(key) {
  return requireR2().send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: normalizeObjectKey(key),
  }));
}

async function r2ObjectExists(key) {
  try {
    await requireR2().send(new HeadObjectCommand({
      Bucket: bucket,
      Key: normalizeObjectKey(key),
    }));
    return true;
  } catch (error) {
    if (error?.$metadata?.httpStatusCode === 404 || error?.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

async function listR2Objects(prefix = '') {
  const objects = [];
  let continuationToken;

  do {
    const response = await requireR2().send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: normalizeObjectKey(prefix),
      ContinuationToken: continuationToken,
    }));

    objects.push(...(response.Contents || []));
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return objects;
}

module.exports = {
  bucket,
  deleteR2Object,
  getR2Object,
  isR2Configured,
  listR2Objects,
  normalizeObjectKey,
  r2ObjectExists,
  uploadR2Object,
};

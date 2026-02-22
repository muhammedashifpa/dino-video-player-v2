import { v2 as cloudinary } from 'cloudinary';

const OLD = { cloud_name: 'dlirsqqey', api_key: '418524193662482', api_secret: 'VTekpY5xS8LU8QFbLX2cvV3Ivs0' };
const NEW = { cloud_name: 'dcrhbqjbo', api_key: '349963321236998', api_secret: 'hx7zJs-nNFoJpgWEFhqIkTBhZXw' };

// Step 1: Fetch all videos from old account
cloudinary.config(OLD);
console.log('Fetching videos from OLD account...');
const { resources } = await cloudinary.api.resources({ resource_type: 'video', max_results: 500 });
console.log(`Found ${resources.length} videos. Starting migration...`);

// Step 2: Switch to new account and upload each video
cloudinary.config(NEW);
for (const video of resources) {
  const oldUrl = `https://res.cloudinary.com/${OLD.cloud_name}/video/upload/${video.public_id}`;
  try {
    await cloudinary.uploader.upload(oldUrl, {
      public_id: video.public_id,
      resource_type: 'video',
    });
    console.log(`Migrated: ${video.public_id}`);
  } catch (err) {
    console.error(`Failed: ${video.public_id} — ${err.message}`);
  }
}

console.log('Migration complete!');

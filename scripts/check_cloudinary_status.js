import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dcrhbqjbo',
  api_key: '349963321236998',
  api_secret: 'hx7zJs-nNFoJpgWEFhqIkTBhZXw'
});

const { resources } = await cloudinary.api.resources({ resource_type: 'video', max_results: 500 });
let done = 0, pending = 0, none = 0;

for (const video of resources) {
  const detail = await cloudinary.api.resource(video.public_id, { resource_type: 'video', derived: true });
  const derived = detail.derived || [];
  const hasMp4 = derived.some(d => d.url?.includes('f_mp4') || d.format === 'mp4');
  const hasWebm = derived.some(d => d.url?.includes('f_webm') || d.format === 'webm');

  if (hasMp4 && hasWebm) {
    done++;
  } else if (derived.length > 0) {
    pending++;
    console.log(`Partial: ${video.public_id} — mp4:${hasMp4} webm:${hasWebm}`);
  } else {
    none++;
    console.log(`Not ready: ${video.public_id}`);
  }
}

console.log(`\nSummary — Done: ${done}, Partial: ${pending}, Not ready: ${none} (of ${resources.length} total)`);

import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: 'dcrhbqjbo',
  api_key: '349963321236998',
  api_secret: 'hx7zJs-nNFoJpgWEFhqIkTBhZXw'
});

const pregenerateTransformations = async () => {
  console.log('Fetching videos from Cloudinary...');

  try {
    const { resources } = await cloudinary.api.resources({
      resource_type: 'video',
      max_results: 500
    });

    console.log(`Found ${resources.length} videos. Starting eager transformations...`);

    for (const video of resources) {
      console.log(`Processing: ${video.public_id}...`);
      await cloudinary.uploader.explicit(video.public_id, {
        resource_type: 'video',
        type: 'upload',
        eager: [
          { streaming_profile: 'auto', format: 'm3u8' },
        ],
        eager_async: true
      });
    }

    console.log('Pre-generation tasks submitted successfully!');
  } catch (error) {
    console.error('Error pre-generating transformations:', error);
  }
};

pregenerateTransformations();

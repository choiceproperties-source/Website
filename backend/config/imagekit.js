import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config();

let imagekit = null;

if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
  console.log("ImageKit connected successfully!");
} else {
  console.warn('Warning: ImageKit credentials not set. Image upload will fail.');
  imagekit = {
    upload: async () => {
      throw new Error('ImageKit not configured');
    }
  };
}

export default imagekit;

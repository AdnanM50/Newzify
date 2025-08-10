import dotenv from 'dotenv';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
// Load the standard `.env` file from root directory
const envPath: string = path.join(__dirname, '../../../', '.env');

// Inject the environment variables
dotenv.config({ path: envPath });

// Optional: For debugging
console.log('Loaded env from:', envPath);
console.log('PORT:', process.env.PORT);

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export default {
    db_string: process.env.DB_STRING,
    port: process.env.PORT || 3005,
    website_name: process.env.WEBSITE_NAME,
    node_env: process.env.NODE_ENV,

    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,



    google_map_api_key: process.env.GOOGLE_MAP_API_KEY,

    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
};
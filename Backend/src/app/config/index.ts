import dotenv from 'dotenv';
import path from 'node:path';

// Load the standard `.env` file from root directory
const envPath: string = path.join(__dirname, '../../../', '.env');

// Inject the environment variables
dotenv.config({ path: envPath });

// Optional: For debugging
console.log('Loaded env from:', envPath);
console.log('PORT:', process.env.PORT);

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

    aws_bucket_name: process.env.AWS_BUCKET_NAME,
    aws_access_key_id: process.env.AWS_ACCESS_ACCESS_KEY,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    aws_region: process.env.AWS_REGION,

    google_map_api_key: process.env.GOOGLE_MAP_API_KEY,
};
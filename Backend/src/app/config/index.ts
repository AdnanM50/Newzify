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

    // Firebase Configuration
    firebase_type: process.env.FIREBASE_TYPE,
    firebase_project_id: process.env.FIREBASE_PROJECT_ID,
    firebase_private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    firebase_private_key: process.env.FIREBASE_PRIVATE_KEY,
    firebase_client_email: process.env.FIREBASE_CLIENT_EMAIL,
    firebase_client_id: process.env.FIREBASE_CLIENT_ID,
    firebase_auth_uri: process.env.FIREBASE_AUTH_URI,
    firebase_token_uri: process.env.FIREBASE_TOKEN_URI,
    firebase_auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    firebase_client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    firebase_storage_bucket: process.env.FIREBASE_STORAGE_BUCKET,

    google_map_api_key: process.env.GOOGLE_MAP_API_KEY,
};
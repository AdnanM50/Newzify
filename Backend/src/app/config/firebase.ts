import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import config from './index';

// Check if Firebase credentials are available
const hasFirebaseCredentials = config.firebase_project_id && 
                              config.firebase_private_key && 
                              config.firebase_client_email;

let app: any = null;
let storage: any = null;
let bucket: any = null;

if (hasFirebaseCredentials) {
    // Initialize Firebase Admin SDK
    const firebaseConfig = {
        project_id: config.firebase_project_id,
        private_key_id: config.firebase_private_key_id,
        private_key: config.firebase_private_key?.replace(/\\n/g, '\n'),
        client_email: config.firebase_client_email,
        client_id: config.firebase_client_id,
        auth_uri: config.firebase_auth_uri || 'https://accounts.google.com/o/oauth2/auth',
        token_uri: config.firebase_token_uri || 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: config.firebase_auth_provider_x509_cert_url || 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: config.firebase_client_x509_cert_url,
    } as ServiceAccount;

    // Initialize the app
    app = initializeApp({
        credential: cert(firebaseConfig),
        storageBucket: config.firebase_storage_bucket,
    });

    // Get storage instance
    storage = getStorage(app);
    bucket = storage.bucket(config.firebase_storage_bucket);
} else {
    console.log('Firebase credentials not found. Firebase Storage will not be available.');
}

export { storage, bucket };
export default app; 
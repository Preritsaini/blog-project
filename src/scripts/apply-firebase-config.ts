import { initializeApp, cert } from 'firebase-admin/app';
import { getSecurityRules } from 'firebase-admin/security-rules';
import { getStorage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';

// Load service account
const serviceAccountPath = '/Users/preritsaini/Downloads/project-prateeksha-firebase-adminsdk-fbsvc-275c4a6f83.json';
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const BUCKET_NAME = 'project-prateeksha.firebasestorage.app';

// Initialize Admin SDK
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: BUCKET_NAME
});

async function applyConfig() {
  console.log('--- Applying Firebase Configurations ---');

  // Firestore Rules
  try {
    const firestoreRules = fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf8');
    await getSecurityRules().releaseFirestoreRulesetFromSource(firestoreRules);
    console.log('✅ Firestore rules applied successfully.');
  } catch (error: any) {
    console.error('❌ Error applying Firestore rules:', error.message || error);
  }

  // Storage Rules
  try {
    const storageRules = fs.readFileSync(path.join(process.cwd(), 'storage.rules'), 'utf8');
    await getSecurityRules().releaseStorageRulesetFromSource(storageRules, BUCKET_NAME);
    console.log('✅ Storage rules applied successfully.');
  } catch (error: any) {
    console.error('❌ Error applying Storage rules:', error.message || error);
  }

  // Storage CORS
  try {
    const corsConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'cors.json'), 'utf8'));
    const bucket = getStorage().bucket(BUCKET_NAME);
    await bucket.setCorsConfiguration(corsConfig);
    console.log('✅ Storage CORS applied successfully.');
  } catch (error: any) {
    console.error('❌ Error applying Storage CORS:', error.message || error);
  }

  console.log('\n✨ Automation process completed.');
}

applyConfig();

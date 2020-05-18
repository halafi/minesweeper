import * as admin from 'firebase-admin';

export const app = admin.initializeApp();
export const db = admin.firestore();

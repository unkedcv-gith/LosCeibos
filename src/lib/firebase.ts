import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from '../../firebase-applet-config.json';

const app = initializeApp(config);

export const auth = getAuth(app);
export const db = (config as any).firestoreDatabaseId ? getFirestore(app, (config as any).firestoreDatabaseId) : getFirestore(app);
export const storage = getStorage(app);

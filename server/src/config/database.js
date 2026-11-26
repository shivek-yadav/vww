import mongoose from 'mongoose';
import { initFallbackStore } from './fallbackStore.js';

let fallbackMode = false;

export function isFallbackActive() {
    return fallbackMode || mongoose.connection.readyState !== 1;
}

export async function connectDatabase() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.warn('MONGO_URI is missing. Initializing fallback database.');
        fallbackMode = true;
        await initFallbackStore();
        return mongoose.connection;
    }

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        fallbackMode = false;
        console.log('MongoDB connected successfully');
        return mongoose.connection;
    } catch (err) {
        console.warn(`[Notice] Cloud MongoDB not reachable (${err.message}). Using resilient local database.`);
        fallbackMode = true;
        await initFallbackStore();
        return mongoose.connection;
    }
}

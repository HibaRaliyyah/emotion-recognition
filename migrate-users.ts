import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emotion-compass';

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // Find users that have email but no username
        const users = await User.collection.find({ email: { $exists: true } }).toArray();
        console.log(`Found ${users.length} users with email field`);

        // Drop the old email unique index if it exists
        try {
            await User.collection.dropIndex('email_1');
            console.log('Dropped old email_1 index');
        } catch (e) {
            console.log('Index email_1 might not exist, ignoring error');
        }

        let count = 0;
        for (const user of users) {
            if (!user.username) {
                await User.collection.updateOne(
                    { _id: user._id },
                    { 
                        $set: { username: user.email },
                        $unset: { email: "" }
                    }
                );
                count++;
            }
        }
        
        console.log(`Successfully migrated ${count} users.`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

migrate();

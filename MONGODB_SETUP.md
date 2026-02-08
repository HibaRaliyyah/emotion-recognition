# MongoDB Setup Documentation

## Overview
This project uses MongoDB with Mongoose for data persistence. The database stores user accounts and emotion analysis records.

## Environment Setup

Make sure your `.env` file contains:
```env
VITE_MONGODB_URI=mongodb+srv://hibaraliyyah12_db_user:Hiba786@cluster0.ags60ak.mongodb.net/
```

## File Structure

```
src/
├── lib/
│   └── db.ts                 # MongoDB connection utility
├── models/
│   ├── User.ts              # User model schema
│   ├── EmotionRecord.ts     # Emotion record schema
│   └── index.ts             # Model exports
└── db-examples.ts           # Usage examples
```

## Database Connection

### Connecting to MongoDB
```typescript
import { connectDB } from './lib/db';

// Connect to database
await connectDB();
```

The connection utility includes:
- ✅ Connection caching (prevents multiple connections)
- ✅ Automatic reconnection
- ✅ Error handling and logging
- ✅ Graceful shutdown support

## Models

### User Model
Stores user account information:
```typescript
{
  email: string;        // Unique, validated email
  password: string;     // Hashed password (hash before storing!)
  name: string;         // User's display name
  createdAt: Date;      // Auto-generated
  updatedAt: Date;      // Auto-generated
}
```

### EmotionRecord Model
Stores emotion analysis results:
```typescript
{
  userId?: ObjectId;           // Optional - links to User
  emotions: {
    happy?: number;            // 0-100
    sad?: number;              // 0-100
    angry?: number;            // 0-100
    surprised?: number;        // 0-100
    fearful?: number;          // 0-100
    disgusted?: number;        // 0-100
    neutral?: number;          // 0-100
  };
  dominantEmotion: string;     // Primary emotion detected
  confidence: number;          // 0-100
  imageUrl?: string;           // Optional image reference
  aiSuggestion?: string;       // AI-generated insights
  createdAt: Date;             // Auto-generated
  updatedAt: Date;             // Auto-generated
}
```

## Usage Examples

### Creating a User
```typescript
import { User } from './models';
import { connectDB } from './lib/db';

await connectDB();

const user = await User.create({
  email: 'user@example.com',
  password: 'hashedPassword123', // Remember to hash!
  name: 'John Doe',
});
```

### Saving an Emotion Record
```typescript
import { EmotionRecord } from './models';
import { connectDB } from './lib/db';

await connectDB();

const record = await EmotionRecord.create({
  userId: user._id, // Optional
  emotions: {
    happy: 85,
    neutral: 10,
    sad: 5,
  },
  dominantEmotion: 'happy',
  confidence: 92,
  aiSuggestion: 'You seem joyful! Great time to tackle creative tasks.',
});
```

### Querying Records
```typescript
// Get all records for a user
const userRecords = await EmotionRecord.find({ userId })
  .sort({ createdAt: -1 })
  .limit(10);

// Find user by email
const user = await User.findOne({ email: 'user@example.com' });

// Get recent records
const recentRecords = await EmotionRecord.find()
  .sort({ createdAt: -1 })
  .limit(20);
```

## Integration with React App

For a React application, you'll typically want to:

1. **Create API endpoints** (using Express, Next.js API routes, or similar)
2. **Call these endpoints from React** using fetch or axios
3. **Never expose MongoDB credentials in client-side code**

⚠️ **Important**: The current setup uses `VITE_` prefix which exposes the variable to the client. For production, you should:
- Move database operations to a backend server
- Use API endpoints to interact with the database
- Keep MongoDB credentials server-side only

## Next Steps

1. **Add password hashing** (use bcrypt or argon2)
2. **Create API routes** for CRUD operations
3. **Implement authentication** (JWT tokens, sessions)
4. **Add data validation** on the backend
5. **Set up proper error handling**

## Testing the Connection

To test if the database connection works:

```typescript
import { connectDB } from './lib/db';

try {
  await connectDB();
  console.log('✅ Database connected successfully!');
} catch (error) {
  console.error('❌ Database connection failed:', error);
}
```

## Common Issues

### Connection Timeout
- Check if your IP is whitelisted in MongoDB Atlas
- Verify network connectivity
- Check if credentials are correct

### Model Already Error
- This is handled automatically with the code pattern:
  ```typescript
  mongoose.models.ModelName || mongoose.model(...)
  ```

### Multiple Connections
- Connection caching prevents this automatically
- Global cache is used to maintain single connection

## Security Best Practices

1. ✅ Never commit `.env` file to version control
2. ✅ Hash passwords before storing (use bcrypt)
3. ✅ Validate all user inputs
4. ✅ Use environment variables for credentials
5. ✅ Implement rate limiting on API endpoints
6. ✅ Keep models on server-side only in production

---

For more examples, see `src/db-examples.ts`

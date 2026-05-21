const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const deleteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // We don't have the User model loaded, let's just use the raw collection
    const db = mongoose.connection.db;
    const users = db.collection('users');
    
    const result = await users.deleteOne({ email: 'student@gmail.com' });
    console.log('Deleted user count:', result.deletedCount);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

deleteUser();

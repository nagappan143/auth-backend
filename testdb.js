// test-db.js
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/testdb');
    console.log('Connected to MongoDB!');
    
    // List all databases
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('Available databases:', dbs.databases);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

testConnection();
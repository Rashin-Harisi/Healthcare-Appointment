const { Client, Account, Databases } = require('appwrite');
require('dotenv').config();

// Initialize Appwrite Client
const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT) // Replace with your Appwrite endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID); // Replace with your Project ID

// Export the Appwrite modules for use in other files
const account = new Account(client);
const databases = new Databases(client);

console.log('Appwrite client initialized successfully.');

module.exports = { client, account, databases };

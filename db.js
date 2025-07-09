const { databases } = require('./appwrite');
require('dotenv').config();


// Create a document
const createDocument = async (databaseId=process.env.APPWRITE_DATABASE_ID, collectionId = process.env.APPWRITE_COLLECTION_ID, data) => {
    try {
        const result = await databases.createDocument(databaseId, collectionId, 'unique()', data);
        console.log('Document created:', result);
        return result;
    } catch (error) {
        console.error('Error creating document:', error.message);
        throw error;
    }
};

// Fetch all documents from a collection
const getDocuments = async (databaseId=process.env.APPWRITE_DATABASE_ID, collectionId=process.env.APPWRITE_COLLECTION_ID) => {
    try {
        const result = await databases.listDocuments(databaseId, collectionId);
        console.log('Documents:', result.documents);
        return result.documents;
    } catch (error) {
        console.error('Error fetching documents:', error.message);
        throw error;
    }
};

// Export functions
module.exports = { createDocument, getDocuments };


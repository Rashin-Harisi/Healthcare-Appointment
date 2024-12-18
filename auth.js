const { account } = require('./appwrite');



// Register a new user
const registerUser = async (email, password, name) => {
    try {
        const result = await account.create('unique()', email, password, name);
        console.log('User registered:', result);
        return result;
    } catch (error) {
        console.error('Error registering user:', error.message);
        throw error;
    }
};

// Login a user
const loginUser = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        console.log('User logged in:', session);
        return session;
    } catch (error) {
        console.error('Error logging in:', error.message);
        throw error;
    }
};

// Export functions
module.exports = { registerUser, loginUser };

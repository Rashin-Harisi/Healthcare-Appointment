const { account } = require('./appwrite');



// Register a new user
const registerUser = async (email, password, name) => {
    try {
        const result = await account.create('unique()', email, password, name);
        console.log('User registered');
        return {success:true, message:"User registered successfully"};
    } catch (error) {
        console.error('Error registering user:', error.message);
        return {success:false, message:"User does not registered!"};
    }
};

// Login a user
const loginUser = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        console.log('User logged in');
        return {success:true, message:"User logged in successfully", data: session}
    } catch (error) {
        console.error('Error logging in:', error.message);
        return {success:false, message:"Email or password might be wrong. Please try again!"}
    }
}; 



// Export functions
module.exports = { registerUser, loginUser };
 
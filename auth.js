const { account,databases } = require("./appwrite");
require('dotenv').config();


// Register a new user
const registerUser = async (email, password, name) => {
  try {
    const result = await account.create("unique()", email, password, name);
    console.log("User registered");

    const userProfiles = await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_ID,
        'unique()',
        {
            userId: result.$id,
            name: name,
            email: email,
            password: password
        }
    );
    //console.log(userProfiles);


    return {
      success: true,
      message: "User registered successfully",
      data: userProfiles.name,
    };
  } catch (error) {
    console.error("Error registering user:", error.message);
    return { success: false, message: "User does not registered!" };
  }
};

// Login a user 
const loginUser = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const userProfiles = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_ID,
        []
    ); 
    const userInfo = userProfiles.documents.find(user => user.userId === session.userId)
    //console.log(userInfo);
    console.log("User logged in");
    return {
      success: true,
      message: "User logged in successfully",
      data: userInfo.name
    };  
  } catch (error) {
    console.error("Error logging in:", error.message);
    return {
      success: false,
      message: "Email or password might be wrong. Please try again!",
    };
  }
};

// Export functions
module.exports = { registerUser, loginUser };
 
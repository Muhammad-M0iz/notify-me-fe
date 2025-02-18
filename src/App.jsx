import { generateToken } from './firebase'
import { Account, Client, ID } from 'appwrite';
import config from './config/config';
import RandomCredentials from './RandomCredentials';

const client = new Client();
client.setProject(config.appwriteProjectId);
client.setEndpoint(config.appwriteUrl);

const account = new Account(client);
const { email, password } = RandomCredentials();

function App() {
  const createTargetWithRetry = async (token, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await account.createPushTarget(ID.unique(), token);
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const signInAndCreateTarget = async () => {
    try {
      // Check for and clear existing session
      try {
        const existingSession = await account.getSession('current');
        if (existingSession) {
          await account.deleteSessions();
        }
      } catch (e) {
        console.log("No existing session");
      }

      // Create guest user with email & password
      const user = await account.create(ID.unique(), email, password);
      console.log("User created:", user);
  
      // Log in the user
      await account.createEmailPasswordSession(email, password);
      console.log("User logged in");
  
      // Get FCM token
      const token = await generateToken();
      console.log("FCM token:", token);
  
      // List and delete existing targets
      try {
        const targets = await account.listTargets();
        await Promise.all(
          targets.targets.map(target => 
            account.deleteTarget(target.$id)
          )
        );
        console.log("Existing targets deleted");
      } catch (e) {
        console.log("No existing targets to delete");
      }

      // Wait for deletions to process
      await new Promise(resolve => setTimeout(resolve, 500));
  
      // Register push target with retry logic
      const result = await createTargetWithRetry(token);
      if(result) {
        console.log("Push target registered", result);
      }
  
    } catch (error) {
      console.error("Error:", error);
      // Handle specific error types
      if (error.code === 409) {
        console.error("Conflict: Target already exists");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSessions();
      console.log("Successfully logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <h1>Appwrite Notify</h1>
      <button onClick={signInAndCreateTarget}>Notify</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default App
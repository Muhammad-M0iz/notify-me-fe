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

  const signInAndCreateTarget = async () => {
    try {
      // Check if user is already logged in
      let user;
      try {
        user = await account.get();
        console.log("User already logged in:", user);
      } catch (error) {
        console.log("No existing session, creating a new user...");
        user = await account.create(ID.unique(), email, password);
        console.log("User created:", user);
        await account.createEmailPasswordSession(email, password);
        console.log("User logged in");
      }

      // List existing push targets
      const existingTargets = await account.listPushTargets();
      console.log("Existing Push Targets:", existingTargets);

      // Delete all existing push targets before creating a new one
      if (existingTargets.total > 0) {
        for (const target of existingTargets.targets) {
          await account.deletePushTarget(target.$id);
          console.log("Deleted push target:", target.$id);
        }
        // Small delay to ensure deletion is processed
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Get new FCM token
      const token = await generateToken();
      console.log("FCM token:", token);

      // Register new push target
      const result = await account.createPushTarget(ID.unique(), token);
      if (result) console.log("Push target registered", result);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1>Appwrite Notify</h1>
      <button onClick={signInAndCreateTarget}>Notify</button>
      <button onClick={() => account.deleteSessions()}>Logout</button>
    </>
  );
}

export default App;

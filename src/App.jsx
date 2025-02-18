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
      // Create guest user with email & password
      const user = await account.create(ID.unique(), email, password);
      console.log("User created:", user);
  
      // Log in the user
      await account.createEmailPasswordSession(email, password);
      console.log("User logged in");
  
      // Get FCM token
      const token = await generateToken();
  
      // Register push target
      const result=await account.createPushTarget(
        ID.unique(), 
        token,
      );
      if(result)console.log("Push target registered", result); 
  
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <>
      <h1>Appwrite Notify</h1>
      <button onClick={signInAndCreateTarget}>Notify</button>
      <button onClick={()=>account.deleteSessions()}>Logout</button>
    </>
  )
}

export default App

import { generateToken } from './firebase'
import { Account, Client, ID } from 'appwrite';
import config from './config/config';
import RandomCredentials from './RandomCredentials';
import { useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import './button.css';
import Carousel from './Carousel';

const client = new Client();
client.setProject(config.appwriteProjectId);
client.setEndpoint(config.appwriteUrl);

const account = new Account(client);
const { email, password } = RandomCredentials();
function App() {
  const slides={
      https://i.ibb.co/ncrXc2V/1.png
      https://i.ibb.co/B3s7v4h/2.png
      https://i.ibb.co/XXR8kzF/3.png
      https://i.ibb.co/yg7BSdM/4.png
  }

  const [register,setRegister]=useState(false);
  const [clicked,setClicked]=useState(false);

  const signInAndCreateTarget = async () => {
    try {
      // Create guest user with email & password
      setClicked(true);
      const user = await account.create(ID.unique(), email, password);
      console.log("User created:", user);
  
      // Log in the user
      await account.createEmailPasswordSession(email, password);
      console.log("User logged in");
  
      // Get FCM token
      const token = await generateToken();
      console.log("FCM token:", token);
  
      // Register push target
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

      await new Promise(resolve => setTimeout(resolve, 500));


      const result=await account.createPushTarget(
        ID.unique(), 
        token,
      );
      if(result){
        setRegister(true);
        toast.success("Mauziz sarif ap apky LMS pr Hamzari nazr hogi 👀");
      }
  
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1>Appwrite Notify</h1>
      <div className='max-w-lg'>
        <Carousel>
          {
            slides.map((slide, index) => (
              <img src={slide} />
          ))}
        </Carousel>
      </div>
      <button
      disabled={clicked}
       onClick={signInAndCreateTarget}
      className={clicked ? "btn" : null}
       >Notify</button>
      <button onClick={()=>account.deleteSessions()}>Logout</button>
      {register && <h2>Registered for notifications</h2>}
    </>
  )
}

export default App

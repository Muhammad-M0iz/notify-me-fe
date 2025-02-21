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
  const slides=[
      "https://i.imgur.com/DCGsnDk.jpeg",
      "https://i.imgur.com/eXhIrQT.jpeg",
      "https://i.imgur.com/gEegykk.jpeg",
  ]

  const [register,setRegister]=useState(false);
  const [clicked,setClicked]=useState(false);
  const [curr,setCurr]=useState(0);

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
    <div className="min-h-screen bg-gray-900 text-white">
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
        theme="dark"
      />
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-lg mx-auto flex flex-col items-center gap-6'>
          <div className='w-full rounded-lg overflow-hidden shadow-2xl'>
            <Carousel slidenum={(curr)=>setCurr(curr)}>
              {slides.map((slide, index) => (
                <img 
                  key={index} 
                  src={slide} 
                  alt={`Slide ${index + 1}`}
                  className="w-full h-auto"
                />
              ))}
            </Carousel>
          </div>

          <div className='flex flex-col items-center gap-4'>
            {curr === 2 && (
              <button
                disabled={clicked}
                onClick={signInAndCreateTarget}
                className={`${clicked ? 'btn' : 'notify-btn'} fade-in`}
              >
                {clicked ? 'Processing...' : 'Notify'}
              </button>
            )}
            
            <button 
              onClick={() => account.deleteSessions()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
            
            {register && (
              <h2 className="text-green-400 font-semibold fade-in">
                Registered for notifications
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
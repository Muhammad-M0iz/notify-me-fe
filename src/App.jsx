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
      account.deleteSessions();
      setClicked(true);
      const user = await account.create(ID.unique(), email, password);
      console.log("User created:", user);
  
      await account.createEmailPasswordSession(email, password);
      console.log("User logged in");
  
      const token = await generateToken();
      console.log("FCM token:", token);
  
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

      const result = await account.createPushTarget(
        crypto.randomUUID(), 
        token,
        config.appwriteProviderId
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
    <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300">
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
      <div className="w-full flex justify-center mt-8">
        <h1 className="text-4xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold tracking-wide heading-animate">
          Notify Me
        </h1>
      </div>
      <div className="flex justify-center items-center mx-auto flex-col gap-3">
        <div className="max-w-lg flex justify-center items-center mx-auto mt-10">
          <Carousel slidenum={(curr)=>setCurr(curr)}>
            {slides.map((slide, index) => (
              <img 
                key={index} 
                src={slide} 
                className="rounded-lg shadow-xl"
                alt={`Slide ${index + 1}`}
              />
            ))}
          </Carousel>
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
          {curr === 2 && (
            <>
              <button
                disabled={clicked}
                onClick={signInAndCreateTarget}
                className={`button-animate ${clicked ? 'btn clicked-animate' : ''}`}
              >
                <span className="relative z-10">Notify</span>
              </button>
            </>
          )}
        </div>
        
        <div className={`transform transition-all duration-300 ease-in-out ${
          register ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {register && (
            <h2 className="text-lg font-semibold text-green-400">
              Registered for notifications
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
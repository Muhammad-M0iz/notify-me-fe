import { generateToken } from './firebase';
import { Account, Client, ID } from 'appwrite';
import config from './config/config';
import RandomCredentials from './RandomCredentials';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './button.css';
import Carousel from './Carousel';

const client = new Client();
client.setProject(config.appwriteProjectId);
client.setEndpoint(config.appwriteUrl);

const account = new Account(client);
const { email, password } = RandomCredentials();

function App() {
  const slides = [
    "https://i.imgur.com/DCGsnDk.jpeg",
    "https://i.imgur.com/eXhIrQT.jpeg",
    "https://i.imgur.com/gEegykk.jpeg",
  ];

  const [register, setRegister] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [curr, setCurr] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (curr === 2) {
      const timer = setTimeout(() => setShowButton(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowButton(false);
    }
  }, [curr]);

  const signInAndCreateTarget = async () => {
    try {
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

      await new Promise(resolve => setTimeout(resolve, 500));

      const result = await account.createPushTarget(ID.unique(), token);
      if (result) {
        setRegister(true);
        toast.success("Mauziz sarif ap apky LMS pr Hamzari nazr hogi 👀");
      }
    } catch (error) {
      console.error("Error:", error);
      setClicked(false); // Reset clicked state on error
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100">
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

      {/* Header */}
      <header className="text-center py-8 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
        <h1 className="text-4xl font-bold tracking-wide">
          Notify Me Bahria
        </h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mx-auto mt-12 gap-8 px-4 max-w-4xl">
        
        {/* Carousel Container */}
        <div className="w-full max-w-lg rounded-xl overflow-hidden bg-gray-800 p-2 border border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <Carousel slidenum={(curr) => setCurr(curr)}>
            {slides.map((slide, index) => (
              <img 
                key={index} 
                src={slide} 
                className="rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                alt={`Slide ${index + 1}`}
              />
            ))}
          </Carousel>
        </div>

        {/* Button Container */}
        <div className="h-20 flex items-center justify-center">
          {curr === 2 && (
            <button
            disabled={clicked}
            onClick={signInAndCreateTarget}
            className={`
              transform transition-all duration-500 ease-out
              ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              px-8 py-4 text-lg rounded-full font-bold
              ${clicked 
                ? 'btn bg-gray-700' 
                : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95'
              }
            `}
          >
            {clicked ? 'Processing...' : 'Notify Me'}
          </button>
          )}
        </div>

        {/* Status and Controls */}
        <div className="flex flex-col items-center gap-4">
          {register && (
            <div className="text-emerald-400 font-semibold bg-gray-800 px-6 py-3 rounded-full border border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.2)] animate-fade-in">
              Successfully registered for notifications! 🎉
            </div>
          )}

          <button
            onClick={() => account.deleteSessions()}
            className="px-6 py-3 bg-red-900 text-white rounded-full font-semibold 
                     hover:bg-red-800 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]
                     active:scale-95 border border-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { Account, Client, ID } from 'appwrite';
import { ToastContainer, toast } from 'react-toastify';
import { generateToken } from './firebase';
import config from './config/config';
import RandomCredentials from './RandomCredentials';
import Carousel from './Carousel';

const client = new Client()
  .setProject(config.appwriteProjectId)
  .setEndpoint(config.appwriteUrl);

const account = new Account(client);

export default function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "https://i.ibb.co/ncrXc2V/1.png",
    "https://i.ibb.co/B3s7v4h/2.png",
    "https://i.ibb.co/XXR8kzF/3.png",
  ];

  const isLastSlide = currentSlide === slides.length - 1;

  const { email, password } = RandomCredentials();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await account.deleteSessions();
      toast.success("Logged out successfully");
      setIsRegistered(false);
    } catch (error) {
      toast.error("Failed to logout: " + error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const signInAndCreateTarget = async () => {
    try {
      setIsRegistering(true);

      // Create and login user
      const user = await account.create(ID.unique(), email, password);
      await account.createEmailPasswordSession(email, password);
      
      // Get FCM token
      const token = await generateToken();
      
      // Clear existing targets
      try {
        const { targets } = await account.listTargets();
        await Promise.all(
          targets.map(target => account.deleteTarget(target.$id))
        );
      } catch (error) {
        console.log("No existing targets to delete");
      }

      // Small delay to ensure previous operations are complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new push target
      const result = await account.createPushTarget(ID.unique(), token);
      
      if (result) {
        setIsRegistered(true);
        toast.success("Successfully registered for LMS notifications 👀");
      }
    } catch (error) {
      toast.error("Registration failed: " + error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Appwrite Notify</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="max-w-lg mx-auto mb-8">
            <Carousel onSlideChange={handleSlideChange}>
              {slides.map((slide, index) => (
                <img 
                  key={index} 
                  src={slide} 
                  alt={`Slide ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </Carousel>
          </div>

          <div className="flex flex-col items-center gap-4">
            {isLastSlide && (
              <button
                onClick={signInAndCreateTarget}
                disabled={isRegistering || isRegistered}
                className={`px-6 py-2 rounded-lg text-white font-medium
                  ${isRegistering || isRegistered 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  }`}
              >
                {isRegistering ? 'Registering...' : 'Notify Me'}
              </button>
            )}

            {isRegistered && (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`px-6 py-2 rounded-lg font-medium
                  ${isLoggingOut
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300'
                  }`}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            )}

            {isRegistered && (
              <p className="text-green-600 font-medium mt-4">
                ✓ Successfully registered for notifications
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
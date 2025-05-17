import React from "react";
import CTA from "./components/CTA"; // Corrected path
import Hero from "./components/Hero"; // Corrected path
import About from "./components/About"; // Corrected path
import Gradient from "./components/Gradient"; // Corrected path
import Notification from "./components/Notification"; // Corrected path
import Footer from "./components/Footer"; // Corrected path
import DarkModeToggle from "./components/DarkModeToggle"; // Import the toggle
import "./index.css";

// Import Appwrite and other necessary modules from the original App.jsx
import { Account, Client, ID, Messaging } from 'appwrite';
import config from './config/config';
import RandomCredentials from './RandomCredentials';
import { toast, ToastContainer } from 'react-toastify'; // Keep ToastContainer here
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { generateToken } from './firebase';


// Initialize Appwrite client and services (from original App.jsx)
const client = new Client();
client.setProject(config.appwriteProjectId);
client.setEndpoint(config.appwriteUrl);

const account = new Account(client);
const messaging = new Messaging(client);

const { email, password } = RandomCredentials();


function App() {
  // Notification logic (moved from original App.jsx, to be passed to CTA)
  const handleNotificationRegistration = async (setLoading, setRegistered) => {
    try {
      setLoading(true); // Indicate loading started in CTA
      account.deleteSessions(); // It's good practice to ensure no prior sessions interfere
      
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
        console.log("No existing targets to delete or error during deletion:", e);
      }

      const targetId = crypto.randomUUID();

      const result = await account.createPushTarget(
        targetId,
        token,
        config.appwriteProviderId,
      );

      if(result) {
        console.log("Target created:", result);
        await messaging.createSubscriber(
          '67b9840b000888be3754',  // Topic ID
          result.$id,             // Subscriber ID (target ID from Appwrite)
          targetId,               // Target ID (custom generated)
        );
        toast.success("Mauziz Sarif ab apky LMS pr hamari nazr hogi👀");
        if(setRegistered) setRegistered(true); // Update registration status in CTA if callback is provided
      } else {
        toast.error("Failed to create push target.");
      }
     
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error("Error:", error);
    } finally {
      if(setLoading) setLoading(false); // Indicate loading finished in CTA
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
        theme="dark"
      />
      <DarkModeToggle /> {/* Add the toggle to the layout */}
      <Hero />
      <Gradient position="left">
        <About />
      </Gradient>
        <Notification />
      {/* Pass the notification handler to CTA */}
      <CTA onNotifyClick={handleNotificationRegistration} /> 
      <Footer />
    </>
  );
}

export default App;
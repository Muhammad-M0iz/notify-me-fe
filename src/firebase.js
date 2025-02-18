import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
var firebaseConfig = {
    apiKey: "AIzaSyDLhYWCoJqMl1STd5wxH-GLrlLDknF3Bbk",
  authDomain: "nofify-lms.firebaseapp.com",
  projectId: "nofify-lms",
  storageBucket: "nofify-lms.firebasestorage.app",
  messagingSenderId: "771809860808",
  appId: "1:771809860808:web:29778a53249921dfc219fd"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

 export const generateToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        console.log(permission);
        if(permission=="granted"){
            const tokken=await getToken(messaging,{
                vapidKey:"BPrRNkamNDzN7hWRIpSelm6qGaDmqBmmeJsWK6-NOcfS0ty5K6kCK5x8z8PDOYmKIIztHEalY2s7178PpuWFkV4"
            })
            return tokken;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}
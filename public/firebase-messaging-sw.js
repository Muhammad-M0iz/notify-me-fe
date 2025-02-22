importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

var firebaseConfig = {
  apiKey: "AIzaSyDLhYWCoJqMl1STd5wxH-GLrlLDknF3Bbk",
  authDomain: "nofify-lms.firebaseapp.com",
  projectId: "nofify-lms",
  storageBucket: "nofify-lms.firebasestorage.app",
  messagingSenderId: "771809860808",
  appId: "1:771809860808:web:29778a53249921dfc219fd",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Listen for background messages but do NOT show a notification
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);
});

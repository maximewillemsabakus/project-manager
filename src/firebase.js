import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'

const firebaseApp = initializeApp({
  apiKey: "AIzaSyC98JXLDPt2QrvSluEIpWpiYk_N4EmhYX4",
  authDomain: "project-manager-7d0a7.firebaseapp.com",
  projectId: "project-manager-7d0a7",
  storageBucket: "project-manager-7d0a7.appspot.com",
  messagingSenderId: "63251210913",
  appId: "1:63251210913:web:d4de7ccebf053fed1e46e0",
  measurementId: "G-Y2ZH2LQR8E"
})

const auth = getAuth(firebaseApp);

export { auth }

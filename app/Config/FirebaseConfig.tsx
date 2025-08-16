// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//@ts-ignore
import {initializeAuth,getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQENKk-cJcUwVlk3GSOf26NxgtpCq5iPY",
  authDomain: "cravv-e5aec.firebaseapp.com",
  projectId: "cravv-e5aec",
  storageBucket: "cravv-e5aec.firebasestorage.app",
  messagingSenderId: "1096234158858",
  appId: "1:1096234158858:web:3be1a1b994d634c8ab48f3",
  measurementId: "G-3JRTBJCYN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(AsyncStorage)
})
export const firestore = getFirestore(app)
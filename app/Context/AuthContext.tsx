import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../Config/FirebaseConfig";
import { router } from "expo-router";
import { Alert } from "react-native";


import { addDoc, doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

const LogIn = async()=>{
const unsubscribe = onAuthStateChanged(auth, async (users) => {
      if (users) {
        console.log(users?.email);
        await updateUser(users?.uid);
        router.replace("/(tabs)/Home");
      } else {
        setUser(null);
        router.replace("/(auth)/SignUp");
      }
    });
    return () => unsubscribe();
}
    
  

  const SignUp = async (
    email: string,
    password: string,
    name: string,
    image: string
  ) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response?.user?.email);
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        uid: response?.user?.uid,
        name,
        email,
        image,
      });
      if (response) {
        router.replace("/(tabs)/Home");
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("Firebase: Error (auth/email-already-in-use)."))
        msg = "Email already Registered";
      if (
        msg.includes(
          "Firebase: Password should be at least 6 characters (auth/weak-password)."
        )
      )
        msg = "Password should be at least 6 characters";
      if (msg.includes("Firebase: Error (auth/invalid-email)."))
        msg = "Invalid Email";
      console.log(msg);
      Alert.alert("Sign Up", msg);
    }
  };
  const SignIn = async (email: string, password: string) => {
    try {
      let response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        router.replace("/(tabs)/Home");
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("Firebase: Error (auth/invalid-credential)."))
        msg = "Invalid Credentials";
      if (msg.includes("Firebase: Error (auth/invalid-email)."))
        msg = "Invalid Email";
      Alert.alert("Sign In", msg);
      console.log(msg);
    }
  };
  const updateUser = async (uid: string) => {
    let userRef = doc(firestore, "users", uid);
    let userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      let data = userSnap.data();
      const userData = {
        uid,
        name: data?.name || null,
        email: data?.email || null,
        image: data?.image || null,
      };
      setUser(userData);
    }
  };

  const value = {
    SignUp,
    SignIn,
    user,
    LogIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    Alert.alert("useAuth must be Wrapped Inside Auth Provider");
  }
  return context;
};

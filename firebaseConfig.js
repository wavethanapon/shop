// src/firebaseConfig.js
import 'react-native-get-random-values'; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAgLqsu0QAkh_7s_H0ObypbD_AhthXh3o",
  authDomain: "my-awesome-project00.firebaseapp.com",
  projectId: "my-awesome-project00",
  storageBucket: "my-awesome-project00.appspot.com", 
  messagingSenderId: "1098361008401",
  appId: "1:1098361008401:web:cbce8eda62d5e6dc48dcb0",
  measurementId: "G-CMP49CXE5X"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

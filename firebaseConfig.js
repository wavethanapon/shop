// src/firebaseConfig.js
import 'react-native-get-random-values'; // <= ต้องอยู่บนสุด เพื่อ polyfill crypto
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHTb6SalyD4RKp9pxMgWBqqRjMFLVFOpg",
  authDomain: "shop-bf350.firebaseapp.com",
  projectId: "shop-bf350",
  storageBucket: "shop-bf350.appspot.com", // << แก้เป็น .appspot.com
  messagingSenderId: "709011913985",
  appId: "1:709011913985:web:e9f1abae02bf2dfdae6f00",
  measurementId: "G-NPYTE0CVD5"
};

const app = initializeApp(firebaseConfig);

// สำคัญมากสำหรับ Expo Go: ตั้ง persistence เป็น AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

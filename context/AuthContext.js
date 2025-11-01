// context/AuthContext.js (เวอร์ชันแก้ไขถูกต้อง)
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // === ฟังก์ชันเข้าสู่ระบบ ===
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("🔥 Login error:", error.code, error.message);
      throw error;
    }
  };

  // === ฟังก์ชันสมัครสมาชิก ===
  const register = async (email, password, name) => {
    try {
      // 1. สร้างผู้ใช้ใน Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. บันทึกข้อมูลลง Firestore โดยใช้ uid เป็น document id
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        role: "customer",
        createdAt: new Date()
      });

      console.log("📤 Firestore saved user:", name, email);
      console.log("✅ Register success:", user.uid);
      return userCredential;

    } catch (error) {
      console.error("🔥 Register error:", error.code, error.message);
      throw error;
    }
  };

  // === ฟังก์ชันออกจากระบบ ===
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("🚪 User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // === ตรวจสอบสถานะผู้ใช้แบบเรียลไทม์ ===
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("👤 onAuthStateChanged:", user ? user.email : "no user");
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // === ตัวแปรสถานะเพิ่มเติมสำหรับ App.js ===
  const isAuthenticated = !!user; // แปลงเป็น true/false
  const isLoading = loading;
  const userRole = "customer"; // ตั้งค่าเริ่มต้นไว้ก่อน (หรือดึงจาก Firestore ทีหลัง)

  // === ค่าที่ส่งให้ทุกหน้าผ่าน Context ===
  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
    userRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

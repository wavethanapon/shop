import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { auth } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // กำหนดสถานะเริ่มต้นเป็น null หรือ loading
    const [user, setUser] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. ติดตามสถานะ Firebase Auth
    useEffect(() => {
        // onAuthStateChanged จะทำงานเมื่อสถานะล็อกอินมีการเปลี่ยนแปลง
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // ถ้ามีผู้ใช้ล็อกอินอยู่
                setUser(firebaseUser);
                setIsAuthenticated(true);
                
                // *** จำลองการกำหนดบทบาทตามอีเมล (ในแอปจริงควรดึงจาก Firestore/Database) ***
                if (firebaseUser.email === 'owner@test.com') {
                    setUserRole('owner');
                } else {
                    setUserRole('customer');
                }
            } else {
                // ถ้าไม่มีผู้ใช้ล็อกอิน
                setUser(null);
                setIsAuthenticated(false);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe; // Cleanup function
    }, []);

    // 2. ฟังก์ชันล็อกอิน (Sign In)
    const login = async (email, password) => {
        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // สถานะจะถูกจัดการโดย onAuthStateChanged ด้านบน
            Alert.alert("สำเร็จ", "ล็อกอินเรียบร้อย!");
        } catch (error) {
            let errorMessage = "การล็อกอินล้มเหลว";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
            } else {
                errorMessage = error.message;
            }
            Alert.alert("ข้อผิดพลาด", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 3. ฟังก์ชันสมัครสมาชิก (Sign Up)
    const signUp = async (email, password) => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // สถานะจะถูกจัดการโดย onAuthStateChanged ด้านบน
            Alert.alert("สำเร็จ", `บัญชี ${email} ถูกสร้างเรียบร้อยแล้ว!`);
            return true;
        } catch (error) {
            let errorMessage = "การสมัครสมาชิกล้มเหลว";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "อีเมลนี้มีผู้ใช้งานแล้ว";
            } else {
                errorMessage = error.message;
            }
            Alert.alert("ข้อผิดพลาด", errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 4. ฟังก์ชันล็อกเอาท์ (Sign Out)
    const logout = async () => {
        try {
            await signOut(auth);
            // สถานะจะถูกจัดการโดย onAuthStateChanged ด้านบน
            Alert.alert("ล็อกเอาท์", "ออกจากระบบเรียบร้อย");
        } catch (error) {
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถออกจากระบบได้");
        }
    };

    const value = {
        user,
        isAuthenticated,
        userRole,
        loading,
        login,
        logout,
        signUp, // *** เพิ่ม signUp เข้าใน Context ***
    };

    if (loading) {
        // คุณอาจแสดง Loading Screen ที่นี่
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>กำลังโหลด...</Text></View>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

// **อย่าลืมเพิ่ม 'View' และ 'Text' เข้าใน import จาก 'react-native' ที่นี่ถ้าคุณใช้ Loading Component**
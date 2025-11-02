import { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { auth } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                setIsAuthenticated(true);
                
                if (firebaseUser.email === 'owner@test.com') {
                    setUserRole('owner');
                } else {
                    setUserRole('customer');
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe; 
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
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

    const signUp = async (email, password) => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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

    const logout = async () => {
        try {
            await signOut(auth);
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
        signUp, 
    };

    if (loading) {
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

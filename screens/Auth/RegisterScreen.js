// screens/Auth/RegisterScreen.js

// 1. นำเข้า useAuth และ useState (สำหรับ loading)
import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';
// ... (import อื่นๆ)

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 2. เพิ่ม Loading State และดึง register
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  // 3. แก้ไขฟังก์ชัน handleRegister ทั้งหมด
  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
        Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
    }
    if (password !== confirmPassword) {
        Alert.alert("รหัสผ่านไม่ตรงกัน", "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
        return;
    }
    if (password.length < 6) {
        Alert.alert("รหัสผ่านสั้นไป", "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
        return;
    }

    setLoading(true);
    try {
        // 4. เรียกใช้ฟังก์ชัน register จาก Context (ที่ถูกต้อง)
        await register(email, password, name);
        Alert.alert("สมัครสมาชิกสำเร็จ", "คุณได้เข้าสู่ระบบแล้ว");
        // ไม่ต้อง navigate เพราะ onAuthStateChanged จะเปลี่ยนหน้าจอให้เอง

    } catch (error) {
        console.error(error);
        let errorMessage = "เกิดข้อผิดพลาดในการสมัครสมาชิก";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "อีเมลนี้ถูกใช้งานแล้ว";
        }
        Alert.alert("สมัครไม่สำเร็จ", errorMessage);
    } finally {
        setLoading(false);
    }
  };

  // ... (ส่วน return (JSX) ...
  // อย่าลืมเพิ่ม <ActivityIndicator> ตอน loading ถ้าต้องการ
};

// ...
export default RegisterScreen;
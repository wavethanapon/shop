// screens/Auth/LoginScreen.js (ปรับปรุง)
import React, { useState } from 'react';
// ... (imports เหมือนเดิม)
import { useAuth } from '../../context/AuthContext'; 

const LoginScreen = ({ navigation }) => {
  // --- (แนะนำ) เปลี่ยน 'gmail' เป็น 'email' เพื่อความชัดเจน ---
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('123456');
  const { login } = useAuth(); 
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { // <--- แก้ไข
        Alert.alert("ข้อผิดพลาด", "กรุณากรอกอีเมลและรหัสผ่าน");
        return;
    }
    
    setLoading(true);
    try {
        await login(email, password); // <--- แก้ไข
    } catch (error) {
        console.error("Login Failed:", error.code);
        let errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        
        // --- แก้ไข Error Code ---
        if (error.code === 'auth/invalid-email') { 
            errorMessage = "รูปแบบอีเมลไม่ถูกต้อง";
        }
        // ---
        
        Alert.alert("เข้าสู่ระบบไม่สำเร็จ", errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>
      
      <TextInput
        style={styles.input}
        placeholder="อีเมล (owner@shop.com หรือ customer@user.com)"
        value={email} // <--- แก้ไข
        onChangeText={setEmail} // <--- แก้ไข
        // --- แก้ไข Keyboard Type ---
        keyboardType="email-address" 
        autoCapitalize="none"
      />
      {/* ... (ส่วนที่เหลือเหมือนเดิม) ... */}
    </View>
  );
};
// ... (styles เหมือนเดิม)
export default LoginScreen;
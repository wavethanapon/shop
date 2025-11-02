import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext'; 
import { MaterialIcons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
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
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>                
                <MaterialIcons name="fastfood" size={60} color="#673AB7" />
                <Text style={styles.appName}>Meatball Shop</Text>
                <Text style={styles.subtitle}>เข้าสู่ระบบจัดการและสั่งซื้อ</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>ล็อกอิน</Text>
                
                {/* Input: Email */}
                <View style={styles.inputGroup}>
                    <MaterialIcons name="account-circle" size={24} color="#673AB7" />
                    <TextInput
                        style={styles.input}
                        placeholder="อีเมล (owner@test.com / customer@test.com)"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Input: Password */}
                <View style={styles.inputGroup}>
                    <MaterialIcons name="lock" size={20} color="#673AB7" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="รหัสผ่าน (123456)"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {/* ปุ่ม Login */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
                </TouchableOpacity>

                {/* ปุ่ม Register */}
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>ยังไม่มีบัญชี? สมัครสมาชิกที่นี่</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#E8EAF6', // สีพื้นหลังโทนม่วงอ่อน
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3F51B5', // สีน้ำเงินเข้ม
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#673AB7', // สีม่วง
        marginTop: 5,
    },
    card: {
        width: '95%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#BDBDBD',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#FAFAFA',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#673AB7', // สีม่วงหลัก
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerText: {
        textAlign: 'center',
        color: '#3F51B5',
        fontSize: 14,
        marginTop: 10,
    }
});

export default LoginScreen;
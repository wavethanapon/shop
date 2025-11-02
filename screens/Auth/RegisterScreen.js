import { useState } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext'; 

const RegisterScreen = () => {
    const navigation = useNavigation();
    const { signUp } = useAuth(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("รหัสผ่านไม่ตรง", "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }

        if (password.length < 6) {
            Alert.alert("รหัสผ่านสั้นเกินไป", "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            return;
        }

        const success = await signUp(email, password);
        
        if (success) {
            Alert.alert("สำเร็จ", "คุณสามารถล็อกอินเข้าสู่ระบบได้แล้ว");
            navigation.navigate('Login'); 
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <MaterialIcons name="person-add" size={80} color="#1E88E5" style={styles.icon} />
            <Text style={styles.title}>สร้างบัญชีผู้ใช้ใหม่</Text>

            <TextInput
                style={styles.input}
                placeholder="อีเมล"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="ยืนยันรหัสผ่าน"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>สมัครสมาชิก</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkText}>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    registerButton: {
        backgroundColor: '#1E88E5',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
    },
    loginLinkText: {
        color: '#007AFF',
        fontSize: 15,
    }
});

export default RegisterScreen;
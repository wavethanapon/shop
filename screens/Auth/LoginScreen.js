import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext'; 

const LoginScreen = () => {
    const navigation = useNavigation();
    const { login } = useAuth(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (email.trim() === '' || password.trim() === '') {
            Alert.alert('ข้อผิดพลาด', 'กรุณากรอกอีเมลและรหัสผ่าน');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            console.error('Login Error:', error);
            let errorMessage = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
            }
            Alert.alert('เข้าสู่ระบบไม่สำเร็จ', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>เข้าสู่ระบบร้านค้า</Text>
            
            <TextInput
                style={styles.input}
                placeholder="อีเมล (เช่น owner@test.com)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="รหัสผ่าน"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity 
                style={[styles.button, styles.loginButton]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.registerText}>ยังไม่มีบัญชี? <Text style={{ fontWeight: 'bold' }}>สมัครสมาชิก</Text></Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerLink: {
        marginTop: 20,
    },
    registerText: {
        fontSize: 15,
        color: '#555',
    }
});

export default LoginScreen;
// screens/ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; // ต้องปรับ path ให้ถูกต้องตามโครงสร้างจริง
import { db } from './firebaseConfig'; // <-- นำเข้า 'db' เพื่อใช้งาน Firestore
// ... เขียนโค้ดเรียกใช้ db เช่น collection(db, 'products')
// ข้อมูลจำลองโปรไฟล์ผู้ใช้ (ในแอปจริงจะดึงมาจาก API)
const MOCK_PROFILE_DATA = {db};

const ProfileScreen = () => {
    const { userRole, userEmail } = useAuth(); // ดึงบทบาทและอีเมลจาก Auth Context
    
    // ดึงข้อมูลเริ่มต้นตามบทบาท
    const initialData = MOCK_PROFILE_DATA[userRole] || MOCK_PROFILE_DATA.customer; 
    
    const [name, setName] = useState(initialData.name);
    const [phone, setPhone] = useState(initialData.phone);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
    const [confirmPassword, setConfirmPassword] = useState('');

    const isOwner = userRole === 'owner';

    // ฟังก์ชันจัดการการบันทึกข้อมูลส่วนตัว (3.1, 6.1)
    const handleSaveProfile = () => {
        if (!name || !phone) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกชื่อและเบอร์โทรศัพท์ให้ครบถ้วน");
            return;
        }

        // *** ในแอปจริง: เรียก API เพื่ออัปเดตชื่อและเบอร์โทรศัพท์ ***
        Alert.alert(
            "บันทึกสำเร็จ", 
            `ข้อมูลโปรไฟล์ (${userRole}) ถูกอัปเดตแล้ว: \nชื่อ: ${name}\nโทรศัพท์: ${phone}`
        );
        // ในแอปจริงควรอัปเดต Context/Local State ด้วย
    };

    // ฟังก์ชันจัดการการเปลี่ยนรหัสผ่าน (3.2, 6.1)
    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกรหัสผ่านให้ครบถ้วน");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("ข้อผิดพลาด", "รหัสผ่านใหม่ไม่ตรงกัน");
            return;
        }
        
        if (newPassword.length < 6) {
            Alert.alert("ข้อผิดพลาด", "รหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร");
            return;
        }

        // *** ในแอปจริง: เรียก API เพื่อเปลี่ยนรหัสผ่าน โดยส่ง currentPassword ไปยืนยันด้วย ***
        Alert.alert(
            "เปลี่ยนรหัสผ่านสำเร็จ", 
            "รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว"
        );
        
        // ล้างฟอร์ม
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>
                {isOwner ? 'จัดการโปรไฟล์เจ้าของร้าน (6.1)' : 'จัดการโปรไฟล์ลูกค้า (3.1, 3.2)'}
            </Text>

            {/* ส่วนข้อมูลหลัก */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}><MaterialIcons name="person" size={20} color="#333" /> ข้อมูลส่วนตัว</Text>
                
                <Text style={styles.label}>อีเมล (ไม่สามารถแก้ไขได้):</Text>
                <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={initialData.email}
                    editable={false}
                />
                
                <Text style={styles.label}>ชื่อ-นามสกุล:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="ชื่อ-นามสกุล"
                />

                <Text style={styles.label}>เบอร์โทรศัพท์:</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="เบอร์โทรศัพท์"
                    keyboardType="phone-pad"
                />

                <View style={{ marginTop: 20 }}>
                    <Button 
                        title="บันทึกข้อมูลโปรไฟล์"
                        onPress={handleSaveProfile}
                        color="#4CAF50"
                    />
                </View>
            </View>

            {/* ส่วนเปลี่ยนรหัสผ่าน */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}><MaterialIcons name="lock" size={20} color="#333" /> เปลี่ยนรหัสผ่าน</Text>
                
                <Text style={styles.label}>รหัสผ่านเดิม:</Text>
                <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    placeholder="รหัสผ่านเดิม"
                />
                
                <Text style={styles.label}>รหัสผ่านใหม่:</Text>
                <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)"
                />
                
                <Text style={styles.label}>ยืนยันรหัสผ่านใหม่:</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="ยืนยันรหัสผ่านใหม่"
                />

                <View style={{ marginTop: 20, marginBottom: 10 }}>
                    <Button 
                        title="เปลี่ยนรหัสผ่าน"
                        onPress={handleChangePassword}
                        color="#2196F3"
                    />
                </View>
            </View>
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 10,
        color: '#333',
    },
    section: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: '#555',
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
        fontSize: 15,
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#999',
    }
});

export default ProfileScreen;
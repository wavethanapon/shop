import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Button, 
    ScrollView, 
    Alert, 
    Image, 
    TouchableOpacity, 
    TextInput 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    
    // สถานะสำหรับเก็บ URI ของรูปภาพหลักฐานการโอนเงินและข้อมูลฟอร์ม
    const [imageUri, setImageUri] = useState(null);
    const [senderName, setSenderName] = useState('');
    const [amount, setAmount] = useState('210.00'); // ยอดรวมจำลอง

    // ฟังก์ชันสำหรับเลือกรูปภาพจากแกลเลอรี่ (4.4)
    const pickImage = async () => {
        // ขออนุญาตการเข้าถึงคลังรูปภาพ
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Need media library permissions to upload proof of transfer.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // ฟังก์ชันสำหรับส่งหลักฐานการโอนเงิน
    const handleSubmitProof = () => {
        if (!imageUri || !senderName || !amount) {
            Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อผู้โอน ยอดเงิน และอัปโหลดหลักฐาน");
            return;
        }

        // *** ในแอปจริง: อัปโหลดรูปภาพไปยัง Server และส่งข้อมูลยืนยันการชำระเงิน ***
        
        Alert.alert(
            "ส่งหลักฐานสำเร็จ", 
            "ระบบได้รับหลักฐานการโอนเงินของคุณแล้ว และจะตรวจสอบภายใน 10 นาที"
        );
        
        // นำทางไปยังหน้าประวัติคำสั่งซื้อ
        navigation.navigate('OrderHistory'); 
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>ขั้นตอนที่ 2: ชำระเงิน</Text>
            
            {/* กล่องข้อมูลบัญชีธนาคาร */}
            <View style={styles.bankInfoBox}>
                <MaterialIcons name="account-balance" size={24} color="#333" />
                <Text style={styles.bankText}>ธนาคาร: กรุงไทย (KTB)</Text>
                <Text style={styles.bankText}>เลขที่บัญชี: 123-4-56789-0</Text>
                <Text style={styles.bankText}>ชื่อบัญชี: My Shop (ยอดรวม: **฿{parseFloat(amount).toFixed(2)}**)</Text>
            </View>

            {/* ฟอร์มกรอกข้อมูล */}
            <Text style={styles.label}>ชื่อผู้โอน:</Text>
            <TextInput
                style={styles.input}
                value={senderName}
                onChangeText={setSenderName}
                placeholder="กรอกชื่อบัญชีที่โอนเงินมา"
            />
            
            <Text style={styles.label}>ยอดเงินที่โอน:</Text>
            <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="ระบุยอดเงินที่โอนจริง"
            />

            {/* ปุ่มเลือกรูปภาพ */}
            <Text style={styles.label}>อัปโหลดหลักฐานการโอนเงิน (4.4):</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                 <MaterialIcons name="add-a-photo" size={24} color="#007bff" />
                <Text style={styles.imagePickerText}>เลือกรูปภาพหลักฐาน</Text>
            </TouchableOpacity>

            {/* แสดงตัวอย่างรูปภาพที่เลือก */}
            {imageUri && (
                <>
                    <Text style={styles.previewLabel}>รูปภาพหลักฐาน:</Text>
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                </>
            )}

            {/* ปุ่มยืนยันการโอนเงิน */}
            <View style={{ marginTop: 30, marginBottom: 50 }}>
                <Button 
                    title="ยืนยันการโอนเงิน"
                    onPress={handleSubmitProof}
                    disabled={!imageUri}
                    color="#4CAF50"
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // ... สไตล์ทั้งหมด ...
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    bankInfoBox: { backgroundColor: '#e0f7fa', padding: 15, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#00bcd4', marginBottom: 20 },
    bankText: { fontSize: 16, marginVertical: 3, color: '#333' },
    label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5, color: '#555' },
    input: { height: 45, borderColor: '#ddd', borderWidth: 1, paddingHorizontal: 10, borderRadius: 6 },
    imagePickerButton: { flexDirection: 'row', backgroundColor: '#eaf4ff', padding: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#007bff', marginTop: 5 },
    imagePickerText: { marginLeft: 10, color: '#007bff', fontWeight: 'bold', fontSize: 15 },
    previewLabel: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 10 },
    previewImage: { width: '100%', height: 300, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' }
});

export default PaymentScreen;
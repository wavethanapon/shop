import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import { useCart } from '../../context/CartContext'; 
import { db, auth } from '../../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

const PaymentScreen = () => {
    const navigation = useNavigation();
    const { cartTotal, cartItems, clearCart } = useCart();

    const [paymentProofUri, setPaymentProofUri] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const bankDetails = {
        bank: 'ธนาคารกรุงเทพ',
        accountName: 'บริษัท นอนน้อย จำกัด',
        accountNumber: '123-4-56789-0',
    };

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert(
                'สิทธิ์ไม่เพียงพอ', 
                'โปรดอนุญาตให้แอปเข้าถึงคลังรูปภาพเพื่ออัปโหลดหลักฐานการโอนเงิน'
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPaymentProofUri(result.assets[0].uri);
        }
    };

    const handleConfirmOrder = async () => { 
        if (cartItems.length === 0) {
            Alert.alert("ตะกร้าว่าง", "กรุณาสั่งสินค้าก่อน");
            navigation.navigate('CustomerDashboard');
            return;
        }
        
        if (!paymentProofUri) {
            Alert.alert("หลักฐานการโอนเงิน", "กรุณาอัปโหลดหลักฐานการโอนเงินก่อนยืนยันคำสั่งซื้อ");
            return;
        }
        
        if (!auth.currentUser) {
            Alert.alert("ข้อผิดพลาด", "กรุณาล็อกอินเพื่อยืนยันคำสั่งซื้อ");
            return;
        }

        setIsUploading(true);

        try {
            const orderData = {
                userId: auth.currentUser.uid,
                customerEmail: auth.currentUser.email,
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                totalAmount: cartTotal,
                status: 'PAYMENT_PENDING',
                paymentProofUrl: paymentProofUri, 
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, "orders"), orderData); 

            Alert.alert(
                "สั่งซื้อสำเร็จ!", 
                `คำสั่งซื้อ #${docRef.id} ถูกบันทึกแล้ว รอการตรวจสอบหลักฐานการโอนเงิน`,
                [
                    { 
                        text: "ตกลง", 
                        onPress: () => {
                            clearCart();
                            navigation.navigate('OrderHistory');
                        }
                    }
                ]
            );

        } catch (error) {
            console.error("Error adding order: ", error);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกคำสั่งซื้อได้: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. สรุปยอดรวม</Text>
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryLabel}>รวมสินค้าทั้งหมด:</Text>
                    <Text style={styles.summaryTotal}>฿{cartTotal.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. รายละเอียดการโอนเงิน</Text>
                <View style={styles.bankDetailBox}>
                    <Text style={styles.bankName}>{bankDetails.bank}</Text>
                    <Text style={styles.detailText}>ชื่อบัญชี: {bankDetails.accountName}</Text>
                    <Text style={styles.accountNumber}>เลขที่บัญชี: {bankDetails.accountNumber}</Text>
                </View>
                <Text style={styles.instruction}>*กรุณาโอนเงินตามยอดรวมสุทธิ แล้วอัปโหลดหลักฐานด้านล่าง</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>3. อัปโหลดหลักฐานการโอนเงิน</Text>
                
                {paymentProofUri && (
                    <Image source={{ uri: paymentProofUri }} style={styles.proofImage} />
                )}

                <TouchableOpacity 
                    style={styles.uploadButton}
                    onPress={handleImagePick}
                    disabled={isUploading}
                >
                    <MaterialIcons name="cloud-upload" size={24} color="#fff" />
                    <Text style={styles.uploadButtonText}>
                        {paymentProofUri ? 'เปลี่ยนหลักฐานการโอน' : 'เลือกรูปหลักฐานการโอนเงิน'}
                    </Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.confirmBox}>
                <TouchableOpacity 
                    style={[styles.confirmButton, isUploading && styles.disabledButton]}
                    onPress={handleConfirmOrder}
                    disabled={isUploading || cartItems.length === 0}
                >
                    {isUploading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.confirmButtonText}>ยืนยันคำสั่งซื้อ</Text>
                    )}
                </TouchableOpacity>
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
    section: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    summaryBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#e3f2fd',
        borderRadius: 5,
        borderLeftWidth: 5,
        borderLeftColor: '#2196F3',
    },
    summaryLabel: {
        fontSize: 16,
        color: '#555',
    },
    summaryTotal: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    bankDetailBox: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eee',
    },
    bankName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 5,
    },
    accountNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    detailText: {
        fontSize: 15,
        color: '#555',
    },
    instruction: {
        fontSize: 13,
        color: '#F44336',
        marginTop: 10,
    },
    proofImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    uploadButton: {
        flexDirection: 'row',
        backgroundColor: '#FF9800',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    confirmBox: {
        padding: 10,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    }
});

export default PaymentScreen;
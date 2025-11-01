// screens/Owner/OrderDetailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Button, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

// ข้อมูลคำสั่งซื้อจำลอง
const MOCK_ORDER_DATA = {
    'o005': { 
        id: 'o005', 
        customer: 'สมศรี', 
        phone: '098-123-4567',
        date: '25 ต.ค. 2568 (10:30)', 
        total: 180.00, 
        status: 'PAYMENT_PENDING', 
        paymentProofUrl: 'https://via.placeholder.com/200/00bcd4/ffffff?text=Payment_Slip_O005', 
        items: [
            { name: 'กาแฟเย็น', price: 60, quantity: 2, total: 120 }, 
            { name: 'ชาเขียวปั่น', price: 75, quantity: 1, total: 60 }
        ],
        notes: "ขอหวานน้อย 2 แก้วเลยนะคะ"
    },
    'o006': { 
        id: 'o006', 
        customer: 'มานะ', 
        phone: '081-987-6543',
        date: '25 ต.ค. 2568 (09:15)', 
        total: 95.00, 
        status: 'RECEIVED', 
        paymentProofUrl: null,
        items: [
            { name: 'เค้กช็อกโกแลต', price: 90, quantity: 1, total: 90 }, 
            { name: 'ส่วนลด', price: -5, quantity: 1, total: -5 }
        ],
        notes: ""
    },
};

const ORDER_STATUS_MAP = {
    PAYMENT_PENDING: { text: 'รอตรวจสอบหลักฐาน', color: '#FFC107' },
    RECEIVED: { text: 'รับคำสั่งซื้อแล้ว', color: '#1E88E5' },
    IN_PROGRESS: { text: 'กำลังทำ', color: '#2196F3' },
    COMPLETED: { text: 'เสร็จสิ้น', color: '#4CAF50' },
    CANCELLED: { text: 'ยกเลิก', color: '#F44336' },
};

const OrderDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    
    // ดึง Order ID ที่ส่งมา
    const { orderId } = route.params; 
    
    // ดึงข้อมูลคำสั่งซื้อ (สมมติ orderId ถูกส่งมาและอยู่ใน MOCK_ORDER_DATA)
    const order = MOCK_ORDER_DATA[orderId] || MOCK_ORDER_DATA['o005'];
    const statusDetail = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.RECEIVED;
    const [currentStatus, setCurrentStatus] = useState(order.status);
    
    // ตั้งค่า Header Title
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: `คำสั่งซื้อ #${order.id}`,
        });
    }, [navigation, order.id]);

    // ฟังก์ชันจำลองการอัปเดตสถานะ
    const handleStatusUpdate = (newStatus) => {
        Alert.alert(
            "อัปเดตสถานะ",
            `ต้องการเปลี่ยนสถานะ Order #${order.id} เป็น "${ORDER_STATUS_MAP[newStatus].text}" ใช่หรือไม่?`,
            [
                { text: "ยกเลิก", style: "cancel" },
                { 
                    text: "ยืนยัน", 
                    style: "default",
                    onPress: () => {
                        // *** ในแอปจริง: เรียก API เพื่ออัปเดตสถานะ ***
                        setCurrentStatus(newStatus);
                        Alert.alert("สำเร็จ", `สถานะเปลี่ยนเป็น ${ORDER_STATUS_MAP[newStatus].text}`);
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.statusBox, { backgroundColor: statusDetail.color + '15', borderColor: statusDetail.color }]}>
                <Text style={[styles.statusTitle, { color: statusDetail.color }]}>สถานะปัจจุบัน:</Text>
                <Text style={[styles.statusText, { color: statusDetail.color }]}>{statusDetail.text}</Text>
            </View>

            {/* ข้อมูลลูกค้า */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ข้อมูลลูกค้า</Text>
                <Text style={styles.detailText}>**ชื่อลูกค้า:** {order.customer}</Text>
                <Text style={styles.detailText}>**เบอร์โทร:** {order.phone}</Text>
                <Text style={styles.detailText}>**วันที่/เวลา:** {order.date}</Text>
            </View>

            {/* รายการสินค้า */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>รายการสินค้า ({order.items.length} รายการ)</Text>
                {order.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemTotal}>฿{item.total.toFixed(2)}</Text>
                    </View>
                ))}
            </View>
            
            {/* ยอดรวม */}
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>ยอดรวมสุทธิ:</Text>
                <Text style={styles.totalValue}>฿{order.total.toFixed(2)}</Text>
            </View>

            {/* หลักฐานการโอนเงิน (ถ้ามี) */}
            {order.paymentProofUrl && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>หลักฐานการโอนเงิน</Text>
                    <Image 
                        source={{ uri: order.paymentProofUrl }} 
                        style={styles.proofImage} 
                        resizeMode="contain"
                    />
                    <Text style={styles.detailText}>**หมายเหตุ:** ตรวจสอบยอดเงินโอนและวันที่ให้ตรงกับคำสั่งซื้อ</Text>
                </View>
            )}

            {/* ส่วนควบคุมสถานะ */}
            <View style={styles.controlSection}>
                <Text style={styles.sectionTitle}>อัปเดตสถานะ</Text>
                
                {currentStatus === 'PAYMENT_PENDING' && (
                    <Button 
                        title="✅ ยืนยันการชำระเงิน"
                        onPress={() => handleStatusUpdate('RECEIVED')}
                        color="#4CAF50"
                    />
                )}
                
                {currentStatus === 'RECEIVED' && (
                    <Button 
                        title="▶️ เริ่มทำคำสั่งซื้อ"
                        onPress={() => handleStatusUpdate('IN_PROGRESS')}
                        color="#2196F3"
                    />
                )}
                
                {currentStatus === 'IN_PROGRESS' && (
                    <Button 
                        title="🏁 ทำเสร็จสิ้น"
                        onPress={() => handleStatusUpdate('COMPLETED')}
                        color="#FF9800"
                    />
                )}
                
                {currentStatus !== 'CANCELLED' && currentStatus !== 'COMPLETED' && (
                    <TouchableOpacity onPress={() => handleStatusUpdate('CANCELLED')} style={styles.cancelButton}>
                        <Text style={styles.cancelText}>ยกเลิกคำสั่งซื้อ</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    statusBox: {
        padding: 15,
        margin: 10,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    statusTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    itemQuantity: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#777',
        minWidth: 30,
    },
    itemName: {
        flex: 1,
        fontSize: 15,
        marginLeft: 10,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        margin: 10,
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00bcd4',
    },
    proofImage: {
        width: '100%',
        height: 250,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
    },
    controlSection: {
        padding: 15,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 10,
    },
    cancelButton: {
        marginTop: 15,
        padding: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default OrderDetailScreen;
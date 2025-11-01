// screens/Owner/ViewOrdersScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// สถานะคำสั่งซื้อทั้งหมด
const ORDER_STATUS = {
    WAITING_PAYMENT: { text: 'รอชำระเงิน', color: '#FF9800', icon: 'payment' },
    PAYMENT_PENDING: { text: 'รอตรวจสอบหลักฐาน', color: '#FFC107', icon: 'hourglass-full' },
    RECEIVED: { text: 'รับคำสั่งซื้อแล้ว', color: '#1E88E5', icon: 'schedule' },
    IN_PROGRESS: { text: 'กำลังทำ', color: '#2196F3', icon: 'hourglass-empty' },
    COMPLETED: { text: 'เสร็จสิ้น', color: '#4CAF50', icon: 'check-circle' },
    CANCELLED: { text: 'ยกเลิก', color: '#F44336', icon: 'cancel' },
};

// ข้อมูลคำสั่งซื้อจำลอง (Order ID ต้องตรงกับ MOCK_ORDER_DATA ใน OrderDetailScreen)
const MOCK_OWNER_ORDERS = [
    { 
        id: 'o005', 
        customer: 'สมศรี', 
        date: 'วันนี้ 10:30', 
        total: 180.00, 
        status: 'PAYMENT_PENDING', // ต้องตรวจสอบหลักฐาน (5.6)
        paymentProofUrl: 'https://via.placeholder.com/150/00bcd4/ffffff?text=Proof_O005', 
        items: ['กาแฟเย็น x 2', 'ชาเขียวปั่น x 1'] 
    },
    { 
        id: 'o006', 
        customer: 'มานะ', 
        date: 'วันนี้ 09:15', 
        total: 95.00, 
        status: 'RECEIVED', 
        paymentProofUrl: 'https://via.placeholder.com/150/4CAF50/ffffff?text=Proof_O006',
        items: ['เค้กช็อกโกแลต x 1', 'กาแฟเย็น x 0.5'] 
    },
    { 
        id: 'o007', 
        customer: 'สมหมาย', 
        date: 'เมื่อวาน 15:45', 
        total: 300.00, 
        status: 'COMPLETED',
        paymentProofUrl: null,
        items: ['แซนวิชแฮมชีส x 5'] 
    },
];

const ViewOrdersScreen = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = useState(MOCK_OWNER_ORDERS);

    // ฟังก์ชันจำลองการอัปเดตสถานะคำสั่งซื้อ (ใช้ในปุ่ม "เริ่มทำ" "เสร็จสิ้น" "ยกเลิก")
    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        Alert.alert("อัปเดตสำเร็จ", `Order #${orderId} เปลี่ยนสถานะเป็น ${ORDER_STATUS[newStatus].text}`);
    };

    const renderOrderItem = ({ item }) => {
        const statusDetail = ORDER_STATUS[item.status] || ORDER_STATUS.RECEIVED;

        return (
            <TouchableOpacity 
                style={[styles.orderItem, { borderLeftColor: statusDetail.color }]}
                // คลิกที่รายการเพื่อไปดูรายละเอียด (Order Detail)
                onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })} 
            >
                <View style={styles.rowHeader}>
                    <Text style={styles.orderId}>#{item.id} ({item.customer})</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusDetail.color + '15' }]}>
                        <MaterialIcons name={statusDetail.icon} size={16} color={statusDetail.color} />
                        <Text style={[styles.statusText, { color: statusDetail.color }]}>
                            {statusDetail.text}
                        </Text>
                    </View>
                </View>

                <Text style={styles.orderDate}>วันที่: {item.date}</Text>
                <Text style={styles.orderTotal}>ยอดรวม: **฿{item.total.toFixed(2)}**</Text>

                <View style={styles.actionContainer}>
                    {/* ปุ่มตรวจสอบหลักฐานการโอนเงิน (5.6) - นำไปหน้า OrderDetail */}
                    {item.status === 'PAYMENT_PENDING' && item.paymentProofUrl && (
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: ORDER_STATUS.PAYMENT_PENDING.color }]}
                            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
                        >
                            <MaterialIcons name="receipt-long" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>ตรวจสอบหลักฐาน</Text>
                        </TouchableOpacity>
                    )}

                    {/* ปุ่มสำหรับเปลี่ยนสถานะ (ตัวอย่าง: เริ่มทำ) */}
                    {item.status === 'RECEIVED' && (
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: ORDER_STATUS.IN_PROGRESS.color }]}
                            onPress={() => updateOrderStatus(item.id, 'IN_PROGRESS')}
                        >
                            <MaterialIcons name="play-arrow" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>เริ่มทำ</Text>
                        </TouchableOpacity>
                    )}
                     {/* ปุ่มสำหรับเปลี่ยนสถานะ (ตัวอย่าง: เสร็จสิ้น) */}
                    {item.status === 'IN_PROGRESS' && (
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: ORDER_STATUS.COMPLETED.color }]}
                            onPress={() => updateOrderStatus(item.id, 'COMPLETED')}
                        >
                            <MaterialIcons name="done-all" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>เสร็จสิ้น</Text>
                        </TouchableOpacity>
                    )}
                    {/* ปุ่มยกเลิก */}
                    {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: ORDER_STATUS.CANCELLED.color, marginLeft: 10 }]}
                            onPress={() => updateOrderStatus(item.id, 'CANCELLED')}
                        >
                            <MaterialIcons name="close" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>ยกเลิก</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>คำสั่งซื้อทั้งหมด (5.5)</Text>
            
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 10,
        color: '#333',
    },
    orderItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 6,
        marginHorizontal: 5,
        borderRadius: 10,
        borderLeftWidth: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    orderDate: {
        fontSize: 13,
        color: '#777',
        marginBottom: 5,
    },
    orderTotal: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 5,
    },
    actionContainer: {
        flexDirection: 'row',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionButton: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 5,
    }
});

export default ViewOrdersScreen;
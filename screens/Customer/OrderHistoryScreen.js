// screens/Customer/OrderHistoryScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native'; // นำเข้าหากต้องการใช้

// ข้อมูลสถานะคำสั่งซื้อ (ใช้สำหรับกำหนดข้อความ สี และไอคอน)
const ORDER_STATUS = {
    RECEIVED: { text: 'รับคำสั่งซื้อแล้ว', color: '#FFC107', icon: 'schedule' },
    IN_PROGRESS: { text: 'กำลังทำ', color: '#2196F3', icon: 'hourglass-empty' },
    COMPLETED: { text: 'เสร็จสิ้น', color: '#4CAF50', icon: 'check-circle' },
    CANCELLED: { text: 'ยกเลิก', color: '#F44336', icon: 'cancel' },
};

// ข้อมูลคำสั่งซื้อจำลอง (MOCK DATA)
const MOCK_ORDERS = [
    { id: 'o001', date: '25 ต.ค. 2568', total: 210.00, status: 'IN_PROGRESS', items: ['กาแฟเย็น x 2', 'เค้กช็อกโกแลต x 1'] },
    { id: 'o002', date: '20 ต.ค. 2568', total: 135.00, status: 'COMPLETED', items: ['ชาเขียวปั่น x 1', 'แซนวิชแฮมชีส x 2'] },
    // ... รายการอื่นๆ
];

const OrderHistoryScreen = () => {
    // ฟังก์ชันสำหรับ Render แต่ละรายการใน FlatList
    const renderOrderItem = ({ item }) => {
        const statusDetail = ORDER_STATUS[item.status]; 
        return (
            <TouchableOpacity style={styles.orderItem}>
                <View style={styles.headerRow}>
                    <Text style={styles.orderId}>คำสั่งซื้อ #**{item.id}**</Text>
                    {/* Badge แสดงสถานะ (4.5) */}
                    <View style={[styles.statusBadge, { backgroundColor: statusDetail.color + '15' }]}>
                        <MaterialIcons name={statusDetail.icon} size={16} color={statusDetail.color} />
                        <Text style={[styles.statusText, { color: statusDetail.color }]}>
                            {statusDetail.text}
                        </Text>
                    </View>
                </View>
                
                <Text style={styles.orderDate}>วันที่: {item.date}</Text>
                <Text style={styles.orderTotal}>รวม: **฿{item.total.toFixed(2)}**</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ประวัติคำสั่งซื้อ (4.5)</Text>
            
            <FlatList
                data={MOCK_ORDERS}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

// ... (Stylesheets ตามโค้ดต้นฉบับ)

export default OrderHistoryScreen;
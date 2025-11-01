// screens/Owner/OwnerDashboard.js
import React, { useState } from 'react'; // ต้องมี useState เพื่อจัดการสถานะการแจ้งเตือน
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useAuth } from '../../context/AuthContext'; // ต้องนำเข้า useAuth เพื่อใช้ฟังก์ชัน logout

// ----------------------------------------------------
// ข้อมูลเมนูสำหรับเจ้าของร้าน
// ----------------------------------------------------
const ownerMenuItems = [
    { 
        id: 'manage_products', 
        title: 'จัดการสินค้า', 
        icon: 'inventory', 
        color: '#4CAF50', 
        target: 'ProductList' 
    }, // 5.3, 5.4
    { 
        id: 'view_orders', 
        title: 'คำสั่งซื้อทั้งหมด', 
        icon: 'list-alt', 
        color: '#2196F3', 
        target: 'ViewOrders' 
    }, // 5.5, 5.6
    { 
        id: 'sales_report', 
        title: 'สรุปยอดขาย', 
        icon: 'bar-chart', 
        color: '#FF9800', 
        target: 'SalesReport' 
    }, // 5.9
    { 
        id: 'pos_sale', 
        title: 'ขายหน้าร้าน (POS)', 
        icon: 'point-of-sale', 
        color: '#9C27B0', 
        target: 'PosSale' 
    }, // 5.10
    { 
        id: 'user_profile', 
        title: 'จัดการโปรไฟล์', 
        icon: 'settings', 
        color: '#607D8B', 
        target: 'Profile' 
    }, // 6.1
];

// ----------------------------------------------------
// ข้อมูลการแจ้งเตือนจำลอง (5.7, 5.8)
// ----------------------------------------------------
const MOCK_NOTIFICATIONS = {
    newOrders: 3, // 5.7: จำนวนคำสั่งซื้อใหม่ที่ต้องดำเนินการ
    lowStockItems: [ // 5.8: สินค้าที่ใกล้หมดหรือหมดแล้ว
        { name: 'ชาเขียวปั่น', stock: 0, status: 'หมดแล้ว' },
        { name: 'เค้กช็อกโกแลต', stock: 2, status: 'ใกล้หมด' },
    ],
};


const OwnerDashboard = () => {
    const navigation = useNavigation();
    const { logout } = useAuth(); // ดึงฟังก์ชัน logout
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS); // สถานะการแจ้งเตือน

    // ฟังก์ชันสำหรับ Render เมนู Grid
    const renderMenuItem = (item) => (
        <TouchableOpacity 
            key={item.id} 
            style={[styles.menuItem, { backgroundColor: item.color + '10' }]}
            onPress={() => navigation.navigate(item.target)}
        >
            <MaterialIcons name={item.icon} size={30} color={item.color} />
            <Text style={styles.menuTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    // ฟังก์ชันสำหรับ Render แถบแจ้งเตือน (5.7, 5.8)
    const renderNotifications = () => {
        const { newOrders, lowStockItems } = notifications;
        let elements = [];

        // 1. การแจ้งเตือนคำสั่งซื้อใหม่ (5.7)
        if (newOrders > 0) {
            elements.push(
                <TouchableOpacity 
                    key="new_orders" 
                    style={[styles.notificationBox, { borderLeftColor: '#D32F2F' }]}
                    onPress={() => navigation.navigate('ViewOrders')} 
                >
                    <MaterialIcons name="notifications-active" size={18} color="#D32F2F" />
                    <Text style={styles.notificationText}>
                        มี **{newOrders}** คำสั่งซื้อใหม่ที่ต้องดำเนินการ! (คลิกเพื่อดู)
                    </Text>
                </TouchableOpacity>
            );
        }

        // 2. การแจ้งเตือนสินค้าใกล้หมด/หมดแล้ว (5.8)
        lowStockItems.forEach((item, index) => {
            const color = item.stock === 0 ? '#C62828' : '#FBC02D';
            const icon = item.stock === 0 ? 'cancel' : 'warning';
            
            elements.push(
                <TouchableOpacity 
                    key={`stock_${index}`} 
                    style={[styles.notificationBox, { borderLeftColor: color }]}
                    onPress={() => navigation.navigate('ProductList')} 
                >
                    <MaterialIcons name={icon} size={18} color={color} />
                    <Text style={styles.notificationText}>
                        สินค้า **"{item.name}"** {item.status} ({item.stock} ชิ้น)
                    </Text>
                </TouchableOpacity>
            );
        });

        return elements;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>ยินดีต้อนรับ, เจ้าของร้าน 👋</Text>
                    <Text style={styles.subtitle}>ระบบจัดการงานเบื้องหลัง</Text>
                </View>
                {/* ปุ่ม Logout */}
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <MaterialIcons name="exit-to-app" size={24} color="#D32F2F" />
                </TouchableOpacity>
            </View>
            
            {/* ส่วนแสดงแถบแจ้งเตือน */}
            <View style={styles.notificationsContainer}>
                {renderNotifications()}
                {notifications.newOrders === 0 && notifications.lowStockItems.length === 0 && (
                    <Text style={styles.noNotificationText}>ไม่มีการแจ้งเตือนใหม่ ✨</Text>
                )}
            </View>

            {/* ส่วน Menu Grid */}
            <View style={styles.menuGrid}>
                {ownerMenuItems.map(renderMenuItem)}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
    logoutButton: {
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#fee',
    },
    notificationsContainer: {
        marginBottom: 20,
    },
    notificationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.0,
        elevation: 2,
    },
    notificationText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    noNotificationText: {
        textAlign: 'center',
        color: '#999',
        paddingVertical: 10,
        fontStyle: 'italic',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    menuItem: {
        width: '48%', 
        height: 120,
        borderRadius: 10,
        marginBottom: 15,
        padding: 15,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    }
});

export default OwnerDashboard;
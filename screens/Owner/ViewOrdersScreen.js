import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    ActivityIndicator, 
    TouchableOpacity,
    Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { db } from '../../firebaseConfig'; 
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'; 

const ViewOrdersScreen = () => {
    const navigation = useNavigation();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ordersQuery = query(
            collection(db, "orders"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString('th-TH') : 'N/A'
                };
            });
            setOrders(fetchedOrders);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching all orders: ", error);
            setLoading(false);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลคำสั่งซื้อทั้งหมดได้");
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (orderId, currentStatus) => {
        const nextStatus = 
            currentStatus === 'PAYMENT_PENDING' ? 'PROCESSING' :
            currentStatus === 'PROCESSING' ? 'COMPLETED' : 
            'PAYMENT_PENDING'; 
        const actionText = 
            currentStatus === 'PAYMENT_PENDING' ? 'ตรวจสอบชำระเงินและเริ่มจัดทำ' :
            currentStatus === 'PROCESSING' ? 'เสร็จสมบูรณ์' : 
            'เปลี่ยนสถานะ';

        Alert.alert(
            "ยืนยันการเปลี่ยนสถานะ",
            `ต้องการเปลี่ยนสถานะคำสั่งซื้อ #${orderId.substring(0, 6).toUpperCase()} เป็น "${actionText}" หรือไม่?`,
            [
                { text: "ยกเลิก", style: "cancel" },
                { text: "ยืนยัน", onPress: async () => {
                    try {
                        const orderRef = doc(db, "orders", orderId);
                        await updateDoc(orderRef, {
                            status: nextStatus
                        });
                        Alert.alert("สำเร็จ", `สถานะถูกเปลี่ยนเป็น ${nextStatus} เรียบร้อยแล้ว`);
                    } catch (error) {
                        console.error("Error updating status: ", error);
                        Alert.alert("ข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้");
                    }
                }}
            ]
        );
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PAYMENT_PENDING':
                return { text: 'รอตรวจสอบชำระเงิน', color: '#FF9800' };
            case 'PROCESSING':
                return { text: 'กำลังจัดทำ/จัดส่ง', color: '#2196F3' };
            case 'COMPLETED':
                return { text: 'เสร็จสมบูรณ์', color: '#4CAF50' };
            default:
                return { text: status, color: '#9E9E9E' };
        }
    };

    const renderOrderItem = ({ item }) => {
        const status = getStatusStyle(item.status);

        return (
            <View style={styles.orderCard}>
                <View style={styles.headerRow}>
                    <Text style={styles.orderIdText}>#ODR-{item.id.substring(0, 6).toUpperCase()}</Text>
                    <Text style={[styles.statusBadge, { backgroundColor: status.color }]}>{status.text}</Text>
                </View>

                <Text style={styles.customerEmail}>{item.customerEmail}</Text>
                
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>รายการสินค้า:</Text>
                    <Text style={styles.detailValue}>{item.items.length} ชิ้น</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ยอดรวมสุทธิ:</Text>
                    <Text style={styles.totalAmount}>฿{item.totalAmount.toFixed(2)}</Text>
                </View>
                
                <Text style={styles.dateText}>วันที่สั่ง: {item.createdAt}</Text>

                <TouchableOpacity 
                    style={styles.detailButton} 
                    onPress={() => {
                        // ** ในแอปจริง ควรนำทางไปหน้า OrderDetailScreen **
                        Alert.alert("รายละเอียด", "แสดงรายละเอียดสินค้าและหลักฐานการโอนเงิน");
                    }}
                >
                    <Text style={styles.detailButtonText}>ดูรายละเอียด/หลักฐาน</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.updateStatusButton, { backgroundColor: status.color }]}
                    onPress={() => handleUpdateStatus(item.id, item.status)}
                >
                    <Text style={styles.updateStatusButtonText}>
                        {item.status === 'COMPLETED' ? 'เสร็จสิ้น' : 'เปลี่ยนสถานะเป็นถัดไป'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF9800" />
                <Text style={{ marginTop: 10 }}>กำลังดึงคำสั่งซื้อทั้งหมด...</Text>
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons name="local-shipping" size={60} color="#ccc" />
                <Text style={styles.emptyText}>ยังไม่มีคำสั่งซื้อเข้ามาในระบบ</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.listContent}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginTop: 10,
    },
    listContent: {
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    orderCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#FF9800',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    orderIdText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    statusBadge: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        overflow: 'hidden',
    },
    customerEmail: {
        fontSize: 14,
        color: '#2196F3',
        marginBottom: 5,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    detailLabel: {
        fontSize: 14,
        color: '#777',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E91E63',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
        textAlign: 'right',
    },
    // ปุ่ม
    detailButton: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        alignItems: 'center',
    },
    detailButtonText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    updateStatusButton: {
        marginTop: 8,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    updateStatusButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ViewOrdersScreen;
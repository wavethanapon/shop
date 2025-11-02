import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig'; 
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'; 

const OrderHistoryScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Current User UID in OrderHistory:", user ? user.uid : 'UID is null');
        
        if (!user || !user.uid) {
            setLoading(false);
            return;
        }

        const ordersQuery = query(
            collection(db, "orders"),
            where("userId", "==", user.uid),
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
            console.error("Error fetching orders: ", error);
            setLoading(false);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถดึงประวัติคำสั่งซื้อได้: " + error.message);
        });

        return () => unsubscribe();
    }, [user]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PAYMENT_PENDING':
                return { text: 'รอตรวจสอบชำระเงิน', color: '#FFC107' };
            case 'PROCESSING':
                return { text: 'กำลังจัดทำ/จัดส่ง', color: '#2196F3' };
            case 'COMPLETED':
                return { text: 'สำเร็จ', color: '#4CAF50' };
            default:
                return { text: status, color: '#9E9E9E' };
        }
    };

    const renderOrderItem = ({ item }) => {
        const status = getStatusStyle(item.status);

        return (
            <TouchableOpacity style={styles.orderCard} onPress={() => {}}>
                <View style={styles.headerRow}>
                    <Text style={styles.orderIdText}>#ODR-{item.id.substring(0, 6).toUpperCase()}</Text>
                    <Text style={[styles.statusBadge, { backgroundColor: status.color }]}>{status.text}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>รายการ:</Text>
                    <Text style={styles.detailValue}>{item.items.length} ชิ้น</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ยอดรวม:</Text>
                    <Text style={styles.totalAmount}>฿{item.totalAmount.toFixed(2)}</Text>
                </View>
                
                <Text style={styles.dateText}>วันที่สั่ง: {item.createdAt}</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={{ marginTop: 10 }}>กำลังดึงประวัติคำสั่งซื้อ...</Text>
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons name="local-mall" size={60} color="#ccc" />
                <Text style={styles.emptyText}>คุณยังไม่มีประวัติการสั่งซื้อ</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CustomerDashboard')} style={styles.shoppingButton}>
                    <Text style={styles.shoppingButtonText}>เริ่มสั่งซื้อสินค้า</Text>
                </TouchableOpacity>
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
    shoppingButton: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    shoppingButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
        borderLeftColor: '#ccc',
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
        marginBottom: 8,
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
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 3,
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
});

export default OrderHistoryScreen;
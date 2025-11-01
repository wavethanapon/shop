// screens/Owner/ProductListScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// ข้อมูลสินค้าจำลอง (Mock Data)
const MOCK_PRODUCTS = [
    { id: 'p1', name: 'กาแฟเย็น', price: 60, stock: 15, imageUrl: 'https://via.placeholder.com/150/00bcd4/ffffff?text=Coffee' },
    { id: 'p2', name: 'ชาเขียวปั่น', price: 75, stock: 0, imageUrl: 'https://via.placeholder.com/150/4CAF50/ffffff?text=Matcha' },
    { id: 'p3', name: 'เค้กช็อกโกแลต', price: 90, stock: 8, imageUrl: 'https://via.placeholder.com/150/FF9800/ffffff?text=Cake' },
    { id: 'p4', name: 'แซนวิชแฮมชีส', price: 45, stock: 20, imageUrl: 'https://via.placeholder.com/150/9C27B0/ffffff?text=Sandwich' },
];

const ProductListScreen = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState(MOCK_PRODUCTS); // ใช้ State เพื่อจำลองการลบ/อัปเดต

    // 5.3: ฟังก์ชันจำลองการลบสินค้า
    const handleDeleteProduct = (productId) => {
        Alert.alert(
            "ยืนยันการลบสินค้า",
            "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าชิ้นนี้อย่างถาวร?",
            [
                { text: "ยกเลิก", style: "cancel" },
                { 
                    text: "ลบ", 
                    style: "destructive",
                    onPress: () => {
                        // *** ในแอปจริง: เรียก API เพื่อลบสินค้า ***
                        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
                        Alert.alert("สำเร็จ", "สินค้าถูกลบเรียบร้อยแล้ว");
                    }
                }
            ]
        );
    };

    const renderProductItem = ({ item }) => {
        const isOutOfStock = item.stock <= 0;
        const stockStyle = isOutOfStock ? styles.outOfStockText : (item.stock < 5 ? styles.lowStockText : styles.inStockText);

        return (
            <View style={styles.productItem}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>฿{item.price.toFixed(2)}</Text>
                    <Text style={styles.productStock}>
                        สต็อก: <Text style={stockStyle}>{item.stock} ชิ้น</Text>
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    {/* 5.4: ปุ่มแก้ไขสินค้า (นำทางไป ManageProductScreen) */}
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => navigation.navigate('ManageProduct', { product: item })}
                    >
                        <MaterialIcons name="edit" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* 5.3: ปุ่มลบสินค้า */}
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteProduct(item.id)}
                    >
                        <MaterialIcons name="delete" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>จัดการรายการสินค้า (5.3)</Text>
            
            {/* ปุ่มเพิ่มสินค้าใหม่ */}
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('ManageProduct', { product: null })} // ส่ง null สำหรับการเพิ่มใหม่
            >
                <MaterialIcons name="add" size={24} color="#fff" />
                <Text style={styles.addButtonText}>เพิ่มสินค้าใหม่ (5.4)</Text>
            </TouchableOpacity>

            <FlatList
                data={products}
                renderItem={renderProductItem}
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
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#1E88E5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        marginBottom: 15,
        elevation: 3,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    detailsContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    productPrice: {
        fontSize: 16,
        color: '#4CAF50',
        marginVertical: 3,
    },
    productStock: {
        fontSize: 14,
        color: '#777',
    },
    inStockText: {
        color: 'green',
        fontWeight: 'bold',
    },
    lowStockText: {
        color: 'orange',
        fontWeight: 'bold',
    },
    outOfStockText: {
        color: 'red',
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    actionButton: {
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    editButton: {
        backgroundColor: '#FFC107',
    },
    deleteButton: {
        backgroundColor: '#F44336',
    }
});

export default ProductListScreen;
// screens/Customer/CustomerDashboard.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext'; // ดึง Context ตะกร้าสินค้า

// NOTE: ในแอปจริง ข้อมูลเหล่านี้จะถูกดึงมาจาก API/Server
const MOCK_PRODUCTS = [
    { 
        id: 'p1', 
        name: 'กาแฟลาเต้เย็น', 
        price: 75.00, 
        stock: 15, 
        imageUrl: 'https://via.placeholder.com/150/00bcd4/ffffff?text=Latte' 
    },
    { 
        id: 'p2', 
        name: 'ชาเขียวปั่นวิปครีม', 
        price: 90.00, 
        stock: 8, 
        imageUrl: 'https://via.placeholder.com/150/4CAF50/ffffff?text=Matcha' 
    },
    { 
        id: 'p3', 
        name: 'เค้กช็อกโกแลตหน้านิ่ม', 
        price: 90.00, 
        stock: 2, 
        imageUrl: 'https://via.placeholder.com/150/FF9800/ffffff?text=Cake' 
    },
    { 
        id: 'p4', 
        name: 'เอสเพรสโซ่ร้อน', 
        price: 60.00, 
        stock: 0, 
        imageUrl: 'https://via.placeholder.com/150/607D8B/ffffff?text=Espresso' 
    },
    { 
        id: 'p5', 
        name: 'น้ำส้มคั้นสด', 
        price: 55.00, 
        stock: 20, 
        imageUrl: 'https://via.placeholder.com/150/FFC107/ffffff?text=Orange' 
    },
];

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth / 2) - 15; // 2 คอลัมน์ ลบ padding

const CustomerDashboard = () => {
    const navigation = useNavigation();
    const { cartItemCount } = useCart(); // ดึงจำนวนสินค้าในตะกร้าจาก Context

    const renderProductItem = ({ item }) => {
        const isOutOfStock = item.stock <= 0;
        
        return (
            <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                disabled={isOutOfStock}
            >
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                {isOutOfStock && (
                    <View style={styles.outOfStockOverlay}>
                        <Text style={styles.outOfStockText}>สินค้าหมด</Text>
                    </View>
                )}
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.productPrice}>฿{item.price.toFixed(2)}</Text>
                        <MaterialIcons name="add-shopping-cart" size={20} color={isOutOfStock ? '#999' : '#FF9800'} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>เมนูยอดนิยม</Text>
                <View style={styles.headerIcons}>
                    {/* ปุ่ม Cart (4.2) */}
                    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartButton}>
                        <MaterialIcons name="shopping-cart" size={28} color="#4CAF50" />
                        {cartItemCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    
                    {/* ปุ่ม Profile (3.1) */}
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <MaterialIcons name="account-circle" size={28} color="#2196F3" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={MOCK_PRODUCTS}
                renderItem={renderProductItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.row}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartButton: {
        marginRight: 15,
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#F44336',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 5,
    },
    row: {
        justifyContent: 'space-around',
    },
    productCard: {
        width: itemWidth,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 5,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: 120,
    },
    outOfStockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outOfStockText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        transform: [{ rotate: '-15deg' }],
    },
    productInfo: {
        padding: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});

export default CustomerDashboard;
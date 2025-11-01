// screens/Customer/CartScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext'; // *** นำเข้า useCart จาก Context ***

const CartScreen = () => {
    const navigation = useNavigation();
    
    // *** ดึง State และฟังก์ชันที่ต้องการจาก Context ***
    const { 
        cartItems, // รายการสินค้าในตะกร้า
        cartTotal, // ยอดรวม
        updateQuantity, // อัปเดตจำนวน (เพิ่ม/ลด)
        removeItem, // ลบสินค้าออก
        clearCart // ล้างตะกร้าทั้งหมด
    } = useCart(); 

    // ฟังก์ชันสำหรับ Render รายการสินค้าแต่ละชิ้น
    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/150/f0f0f0?text=Product' }} style={styles.cartImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>฿{item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityControl}>
                {/* ปุ่มลดจำนวน / ลบ */}
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                    <MaterialIcons name="remove-circle" size={26} color="#FF9800" />
                </TouchableOpacity>

                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                
                {/* ปุ่มเพิ่มจำนวน */}
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                    <MaterialIcons name="add-circle" size={26} color="#4CAF50" />
                </TouchableOpacity>

                {/* ปุ่มลบสินค้าออกจากตะกร้า */}
                <TouchableOpacity onPress={() => removeItem(item.id)} style={{ marginLeft: 15 }}>
                     <MaterialIcons name="delete" size={24} color="#F44336" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems} // ใช้ข้อมูลจริงจาก Context
                renderItem={renderCartItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 10 }}
                ListEmptyComponent={<Text style={styles.emptyText}>ไม่มีสินค้าในตะกร้า</Text>}
            />
            
            {/* แสดงปุ่มล้างตะกร้าหากมีสินค้า */}
            {cartItems.length > 0 && (
                <Button 
                    title="ล้างตะกร้าทั้งหมด" 
                    onPress={clearCart} 
                    color="#F44336"
                />
            )}

            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>รวมสุทธิ:</Text>
                    <Text style={styles.summaryValue}>฿{cartTotal.toFixed(2)}</Text> {/* แสดงยอดรวมจาก Context */}
                </View>
                
                <Button 
                    title="ดำเนินการชำระเงิน"
                    onPress={() => navigation.navigate('Payment')} 
                    disabled={cartItems.length === 0}
                    color="#4CAF50"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 16,
        color: '#999',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cartImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        fontSize: 14,
        color: '#777',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 130,
        justifyContent: 'flex-end',
    },
    itemQuantity: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        minWidth: 20,
        textAlign: 'center',
    },
    summaryContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5722',
    },
});

export default CartScreen;
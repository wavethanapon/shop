// screens/Owner/POSScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// ข้อมูลสินค้าจำลอง
const MOCK_PRODUCTS = [
    { id: 'p1', name: 'กาแฟเย็น', price: 60, stock: 15 },
    { id: 'p2', name: 'ชาเขียวปั่น', price: 75, stock: 0 }, 
    { id: 'p3', name: 'เค้กช็อกโกแลต', price: 90, stock: 8 },
    { id: 'p4', name: 'แซนวิชแฮมชีส', price: 45, stock: 20 },
];

const POSScreen = () => {
    const [posCart, setPosCart] = useState([]);
    const navigation = useNavigation();

    // 1. ฟังก์ชันเพิ่มสินค้า/เพิ่มจำนวนในตะกร้า
    const handleAddProduct = (product) => {
        const itemInStock = MOCK_PRODUCTS.find(p => p.id === product.id && p.stock > 0);
        if (!itemInStock) {
            Alert.alert("สินค้าหมด", `${product.name} หมดสต็อกแล้ว`);
            return;
        }

        setPosCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity + 1 > itemInStock.stock) {
                     Alert.alert("เกินสต็อก", `เพิ่มสินค้าไม่ได้แล้ว: เหลือในสต็อกแค่ ${itemInStock.stock} ชิ้น`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    // 2. ฟังก์ชันลดจำนวนสินค้า
    const handleRemoveProduct = (productId) => {
        setPosCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);

            if (existingItem.quantity === 1) {
                return prevCart.filter(item => item.id !== productId);
            } else {
                return prevCart.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
        });
    };

    // 3. ฟังก์ชันจบรายการขาย (Checkout)
    const handleCheckout = () => {
        if (posCart.length === 0) {
            Alert.alert("ตะกร้าว่าง", "กรุณาเพิ่มสินค้าก่อนทำการขาย");
            return;
        }

        const totalAmount = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        Alert.alert(
            "ยืนยันการขาย",
            `ยอดรวม: ฿${totalAmount.toFixed(2)}\nยืนยันการทำรายการนี้ใช่หรือไม่?`,
            [
                { text: "ยกเลิก", style: "cancel" },
                { 
                    text: "ยืนยันขาย", 
                    onPress: () => {
                        // ** ฟังก์ชันนี้คือการจำลองการลดสต็อกสินค้าทันที (5.10) **
                        Alert.alert("ขายสำเร็จ!", `รายการขายถูกบันทึกและตัดสต็อกเรียบร้อยแล้ว`);
                        setPosCart([]); // ล้างตะกร้า
                    }
                }
            ]
        );
    };

    const totalAmount = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <View style={styles.container}>
            {/* -------------------- ส่วนที่ 1: รายการสินค้าทั้งหมด -------------------- */}
            <View style={styles.productListContainer}>
                <Text style={styles.sectionTitle}>เลือกสินค้า</Text>
                <FlatList
                    data={MOCK_PRODUCTS.filter(p => p.stock > 0)}
                    keyExtractor={item => item.id}
                    numColumns={3}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.productButton}
                            onPress={() => handleAddProduct(item)}
                        >
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productPrice}>฿{item.price}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ alignItems: 'flex-start' }}
                    columnWrapperStyle={styles.row}
                />
            </View>

            {/* -------------------- ส่วนที่ 2: ตะกร้าสินค้า POS -------------------- */}
            <View style={styles.cartContainer}>
                <Text style={styles.sectionTitle}>ตะกร้าสินค้า</Text>
                <ScrollView style={styles.cartList}>
                    {posCart.length === 0 ? (
                        <Text style={styles.emptyCartText}>ไม่มีสินค้าในตะกร้า</Text>
                    ) : (
                        posCart.map(item => (
                            <View key={item.id} style={styles.cartItem}>
                                <Text style={styles.cartItemText}>{item.name}</Text>
                                <View style={styles.quantityControl}>
                                    <TouchableOpacity onPress={() => handleRemoveProduct(item.id)}>
                                        <MaterialIcons name="remove-circle-outline" size={24} color="#D32F2F" />
                                    </TouchableOpacity>
                                    <Text style={styles.cartQuantity}>{item.quantity}</Text>
                                    <TouchableOpacity onPress={() => handleAddProduct(item)}>
                                        <MaterialIcons name="add-circle-outline" size={24} color="#4CAF50" />
                                    </TouchableOpacity>
                                    <Text style={styles.cartItemPrice}>
                                        ฿{(item.price * item.quantity).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* สรุปยอดรวมและปุ่มชำระเงิน */}
                <View style={styles.checkoutBox}>
                    <Text style={styles.totalLabel}>ยอดรวมสุทธิ:</Text>
                    <Text style={styles.totalAmount}>฿{totalAmount.toFixed(2)}</Text>
                    
                    <TouchableOpacity 
                        style={[styles.checkoutButton, posCart.length === 0 && styles.disabledButton]}
                        onPress={handleCheckout}
                        disabled={posCart.length === 0}
                    >
                        <MaterialIcons name="paid" size={24} color="#fff" />
                        <Text style={styles.checkoutButtonText}>ชำระเงิน</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// ... Stylesheets ... 
// (ละเว้นส่วน styles เพื่อความกระชับในการสรุป)

export default POSScreen;
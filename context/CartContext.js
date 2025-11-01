// context/CartContext.js
import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';

// 1. สร้าง Context Object
const CartContext = createContext();

// 2. สร้าง Provider Component
export const CartProvider = ({ children }) => {
    // สถานะหลัก: เก็บรายการสินค้าในตะกร้า
    const [cartItems, setCartItems] = useState([]);

    // ฟังก์ชันเพิ่มสินค้าลงในตะกร้า (หรือเพิ่มจำนวน)
    const addToCart = (product, quantityToAdd = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            const newQuantity = existingItem ? existingItem.quantity + quantityToAdd : quantityToAdd;

            if (newQuantity > product.stock) {
                // ตรวจสอบสต็อก
                Alert.alert("ขออภัย", `ไม่สามารถเพิ่ม ${product.name} ได้ สต็อกคงเหลือ: ${product.stock} ชิ้น`);
                return prevItems;
            }

            if (existingItem) {
                // สินค้ามีอยู่แล้ว: อัปเดตจำนวน
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                );
            } else {
                // สินค้าใหม่: เพิ่มเข้าตะกร้า
                return [...prevItems, { ...product, quantity: quantityToAdd }];
            }
        });
        
        Alert.alert("เพิ่มลงตะกร้า", `${quantityToAdd} ชิ้นของ ${product.name} ถูกเพิ่มแล้ว`);
    };

    // ฟังก์ชันอัปเดตจำนวนสินค้า
    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            const itemToUpdate = prevItems.find(item => item.id === productId);

            if (!itemToUpdate) return prevItems;
            
            if (newQuantity <= 0) {
                return prevItems.filter(item => item.id !== productId); // ลบออกจากตะกร้า
            }

            if (newQuantity > itemToUpdate.stock) {
                Alert.alert("เกินสต็อก", `สต็อกสูงสุดสำหรับ ${itemToUpdate.name} คือ ${itemToUpdate.stock} ชิ้น`);
                return prevItems;
            }

            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        });
    };

    // ฟังก์ชันลบสินค้าออกจากตะกร้า
    const removeItem = (productId) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้ออกจากตะกร้า?",
            [
                { text: "ยกเลิก", style: "cancel" },
                { 
                    text: "ลบ", 
                    style: "destructive",
                    onPress: () => setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
                }
            ]
        );
    };

    // ฟังก์ชันล้างตะกร้าทั้งหมด
    const clearCart = () => {
        setCartItems([]);
    };
    
    // คำนวณยอดรวมและจำนวนสินค้าทั้งหมด
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // ค่าที่เราต้องการแชร์ผ่าน Context
    const value = {
        cartItems,
        cartTotal,
        cartItemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Custom Hook เพื่อให้เรียกใช้งาน Context ได้ง่าย
export const useCart = () => {
    return useContext(CartContext);
};
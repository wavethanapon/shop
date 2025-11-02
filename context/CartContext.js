import { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantityToAdd = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            const newQuantity = existingItem ? existingItem.quantity + quantityToAdd : quantityToAdd;

            if (newQuantity > product.stock) {
                Alert.alert("ขออภัย", `ไม่สามารถเพิ่ม ${product.name} ได้ สต็อกคงเหลือ: ${product.stock} ชิ้น`);
                return prevItems;
            }

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                );
            } else {
                return [...prevItems, { ...product, quantity: quantityToAdd }];
            }
        });
        
        Alert.alert("เพิ่มลงตะกร้า", `${quantityToAdd} ชิ้นของ ${product.name} ถูกเพิ่มแล้ว`);
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            const itemToUpdate = prevItems.find(item => item.id === productId);

            if (!itemToUpdate) return prevItems;
            
            if (newQuantity <= 0) {
                return prevItems.filter(item => item.id !== productId); 
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

    const clearCart = () => {
        setCartItems([]);
    };
    
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

export const useCart = () => {
    return useContext(CartContext);
};
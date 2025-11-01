// screens/Customer/ProductDetailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Button, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext'; // <--- เชื่อมต่อกับตะกร้าสินค้า

const ProductDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    
    // ดึงฟังก์ชัน addToCart จาก Context
    const { addToCart } = useCart(); 

    // ดึงข้อมูลสินค้าที่ส่งมาจาก route.params
    const { product } = route.params; 

    // สถานะสำหรับเลือกจำนวนสินค้า
    const [quantity, setQuantity] = useState(1);
    const maxStock = product.stock; 

    // ตั้งค่า Header Title
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: product.name,
        });
    }, [navigation, product]);

    const handleQuantityChange = (type) => {
        if (type === 'increase' && quantity < maxStock) {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        // เรียกใช้ฟังก์ชัน addToCart จาก Context เพื่อเพิ่มสินค้า
        addToCart(product, quantity);
        
        // นำทางไปยังหน้าตะกร้าสินค้า
        navigation.navigate('Cart'); 
    };
    
    const isOutOfStock = maxStock <= 0;
    const finalPrice = product.price * quantity;

    return (
        <ScrollView style={styles.container}>
            <Image 
                source={{ uri: product.imageUrl }} 
                style={styles.productImage} 
                resizeMode="cover"
            />
            
            <View style={styles.detailContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>ราคาต่อชิ้น:</Text>
                    <Text style={styles.currentPrice}>฿{product.price.toFixed(2)}</Text>
                </View>

                <Text style={styles.descriptionText}>
                    {product.description || "เครื่องดื่ม/สินค้าชิ้นนี้เป็นเมนูยอดนิยมประจำร้านของเรา..."}
                </Text>
                
                <View style={styles.stockRow}>
                    <Text style={styles.stockLabel}>สินค้าคงเหลือ:</Text>
                    <Text style={[styles.stockValue, { color: isOutOfStock ? 'red' : maxStock < 5 ? 'orange' : 'green' }]}>
                        {isOutOfStock ? 'หมดแล้ว' : `${maxStock} ชิ้น`}
                    </Text>
                </View>

                {/* ส่วนเลือกจำนวนสินค้า */}
                {!isOutOfStock && (
                    <View style={styles.quantityControl}>
                        <Text style={styles.quantityLabel}>จำนวน:</Text>
                        <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange('decrease')}
                            disabled={quantity === 1}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange('increase')}
                            disabled={quantity >= maxStock}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* แถบด้านล่างสำหรับราคารวมและปุ่มสั่งซื้อ */}
            <View style={styles.bottomBar}>
                <View style={styles.totalPrice}>
                    <Text style={styles.totalLabel}>ราคารวม:</Text>
                    <Text style={styles.totalValue}>฿{finalPrice.toFixed(2)}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.addToCartButton, isOutOfStock && styles.disabledButton]}
                    onPress={handleAddToCart} 
                    disabled={isOutOfStock}
                >
                    <MaterialIcons name="add-shopping-cart" size={24} color="#fff" />
                    <Text style={styles.addToCartText}>
                        {isOutOfStock ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// ... Stylesheets ...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    productImage: { width: '100%', height: 300 },
    detailContainer: { padding: 20, marginBottom: 80 },
    productName: { fontSize: 28, fontWeight: 'bold' },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    currentPrice: { fontSize: 22, fontWeight: 'bold', color: '#FF5722' },
    descriptionText: { fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 20 },
    stockRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    // ... สไตล์อื่นๆ ...
    quantityControl: { /* ... style ... */ },
    bottomBar: { 
        position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', 
        justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 20,
        backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee',
    },
    totalValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
    addToCartButton: { /* ... style ... */ },
    disabledButton: { backgroundColor: '#ccc' }
});

export default ProductDetailScreen;
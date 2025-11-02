import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext'; 

const MOCK_PRODUCTS = [
    { 
        id: 'p1', 
        name: 'ลูกชิ้นหมู', 
        price: 10.00, 
        stock: 25, 
        imageUrl: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQfdvL-8qjOL1fLS4N34TfTgxzvvZaFrTojvlneQoHyS2f3c9MmXUYLW0Uc5BdfQNRR6G58qZKLp8cdITszxnMESi4nEwiQdDXWIFsjihld57U4KNc' 
    },
    { 
        id: 'p2', 
        name: 'ไส้กรอกแดง', 
        price: 5.00, 
        stock: 0, 
        imageUrl: 'https://s.isanook.com/wo/0/ud/50/252701/252701-thumbnail.jpg' 
    },
    { 
        id: 'p3', 
        name: 'กุ้งระเบิด', 
        price: 10.00, 
        stock: 8, 
        imageUrl: 'https://img.wongnai.com/p/400x0/2020/02/07/8ea870f6c9564eb691db85b694fe7694.jpg' 
    },
    { 
        id: 'p4', 
        name: 'ไส้กรอกชีส', 
        price: 10.00, 
        stock: 20, 
        imageUrl: 'https://www.jandoprocessing.com/wp-content/uploads/2020/06/cheese-sausage-02.jpg' 
    },    
];

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth / 2) - 15; 

const CustomerDashboard = () => {
    const navigation = useNavigation();
    const { cartItemCount } = useCart(); 

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
                    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartButton}>
                        <MaterialIcons name="shopping-cart" size={28} color="#4CAF50" />
                        {cartItemCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    
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
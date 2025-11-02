import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons'; 

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 

import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';

import CustomerDashboard from './screens/Customer/CustomerDashboard';
import ProductDetailScreen from './screens/Customer/ProductDetailScreen';
import CartScreen from './screens/Customer/CartScreen';
import PaymentScreen from './screens/Customer/PaymentScreen';
import OrderHistoryScreen from './screens/Customer/OrderHistoryScreen';

import OwnerDashboard from './screens/Owner/OwnerDashboard';
import ProductListScreen from './screens/Owner/ProductListScreen';
import ManageProductScreen from './screens/Owner/ManageProductScreen';
import ViewOrdersScreen from './screens/Owner/ViewOrdersScreen';
import OrderDetailScreen from './screens/Owner/OrderDetailScreen';
import SalesReportScreen from './screens/Owner/SalesReportScreen';
import POSScreen from './screens/Owner/POSScreen';

import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'เข้าสู่ระบบ' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'สมัครสมาชิก' }} />
    </Stack.Navigator>
);

const AppStack = () => {
    const { userRole, logout } = useAuth();

    const LogoutButton = () => (
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <MaterialIcons name="logout" size={24} color="#D32F2F" />
            <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>
    );

    return (
        <Stack.Navigator screenOptions={{ 
            headerRight: () => <LogoutButton />,
            headerStyle: { backgroundColor: '#f5f5f5' },
            headerTitleStyle: { fontWeight: 'bold' }
        }}>
            <Stack.Screen 
                name={userRole === 'owner' ? "OwnerHome" : "CustomerHome"}
                component={userRole === 'owner' ? OwnerDashboard : CustomerDashboard}
                options={{ 
                    title: userRole === 'owner' ? 'แดชบอร์ดเจ้าของร้าน' : 'หน้าหลัก',
                    headerRight: () => <LogoutButton />, 
                }}
            />
            
            {userRole === 'owner' && (
                <>
                    <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'จัดการสินค้า' }} />
                    <Stack.Screen name="ManageProduct" component={ManageProductScreen} options={{ title: 'สินค้า' }} />
                    <Stack.Screen name="ViewOrders" component={ViewOrdersScreen} options={{ title: 'คำสั่งซื้อทั้งหมด' }} />
                    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'รายละเอียดคำสั่งซื้อ' }} />
                    <Stack.Screen name="SalesReport" component={SalesReportScreen} options={{ title: 'สรุปยอดขาย' }} />
                    {/*<Stack.Screen name="PosSale" component={POSScreen} options={{ title: 'ขายหน้าร้าน (POS)' }} />*/}
                    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'จัดการโปรไฟล์' }} />
                </>
            )}

            {userRole === 'customer' && (
                <>
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'รายละเอียดสินค้า' }} />
                    <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'ตะกร้าสินค้า' }} />
                    <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'ชำระเงิน' }} />
                    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'ประวัติคำสั่งซื้อ' }} />
                    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'จัดการโปรไฟล์' }} />
                </>
            )}
        </Stack.Navigator>
    );
};

const RootNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>กำลังโหลด...</Text>
            </View>
        );
    }

    return isAuthenticated ? <AppStack /> : <AuthStack />;
};


export default function App() {
  return (
    <AuthProvider>
        <CartProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4CAF50',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        padding: 5,
        borderRadius: 5,
    },
    logoutText: {
        marginLeft: 5,
        color: '#D32F2F',
        fontWeight: 'bold',
    },
});
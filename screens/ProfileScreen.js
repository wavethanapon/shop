import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Button } from 'react-native';
import { useAuth } from '../context/AuthContext'; 
import { db } from '../firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
    const { user, logout } = useAuth(); 
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    setUserData(null);
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
                Alert.alert('Error', 'Failed to fetch user data.');    
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF9800" />
                <Text style={{ marginTop: 10 }}>กำลังโหลดโปรไฟล์...</Text>
            </View>
        );
    }

    const displayName = userData?.name || 'ไม่ได้ระบุชื่อ';
    const displayRole = userData?.role || (user?.email === 'owner@test.com' ? 'เจ้าของร้าน' : 'ลูกค้า');
    const displayEmail = user?.email || 'N/A';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>ข้อมูลผู้ใช้งาน</Text>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>อีเมล:</Text>
                    <Text style={styles.value}>{displayEmail}</Text>
                </View>
                
                <View style={styles.detailRow}>
                    <Text style={styles.label}>บทบาท:</Text>
                    <Text style={[styles.value, styles.roleText]}>{displayRole}</Text>
                </View>
            </View>
            
            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={logout}
            >
                <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 16,
        color: '#777',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    roleText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#F44336',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
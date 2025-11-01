// screens/Owner/ManageProductScreen.js

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TextInput, 
    Button, 
    Alert, 
    Image, 
    TouchableOpacity 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 
import { useNavigation, useRoute } from '@react-navigation/native';

// NOTE: ต้องติดตั้ง Expo Image Picker ก่อน: expo install expo-image-picker

const ManageProductScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    
    // รับพารามิเตอร์ product หากเป็นการแก้ไข (Edit Mode)
    const existingProduct = route.params?.product;

    const [name, setName] = useState(existingProduct?.name || '');
    const [price, setPrice] = useState(existingProduct?.price.toString() || '');
    const [stock, setStock] = useState(existingProduct?.stock.toString() || '');
    const [description, setDescription] = useState(existingProduct?.description || '');
    const [imageUri, setImageUri] = useState(existingProduct?.imageUrl || null);
    
    // ตั้งค่า Header Title ตามโหมดการทำงาน
    useEffect(() => {
        navigation.setOptions({
            title: existingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่',
        });
    }, [navigation, existingProduct]);

    // ฟังก์ชันสำหรับเลือกรูปภาพจากแกลเลอรี่ (5.4)
    const pickImage = async () => {
        // ขออนุญาตการเข้าถึงคลังรูปภาพ
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Need media library permissions to upload product image.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // ฟังก์ชันสำหรับบันทึก/อัปเดตข้อมูลสินค้า (5.3)
    const handleSaveProduct = () => {
        if (!name || !price || !stock || !imageUri) {
            Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อ ราคา สต็อก และอัปโหลดรูปภาพ");
            return;
        }
        
        const productData = {
            id: existingProduct ? existingProduct.id : Date.now().toString(),
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            description,
            imageUrl: imageUri,
            // ในแอปจริง: ต้องเพิ่ม category, status, etc.
        };

        // *** ในแอปจริง:
        // 1. ถ้า imageUri เป็น URI ใหม่ (จากมือถือ): อัปโหลดรูปภาพไปยัง Server/Storage 
        // 2. ถ้า imageUri เป็น URL เดิม: ไม่ต้องอัปโหลดรูปภาพซ้ำ
        // 3. เรียก API เพื่อบันทึก/อัปเดต productData 
        
        const action = existingProduct ? 'แก้ไข' : 'เพิ่ม';
        Alert.alert(
            `${action}สินค้าสำเร็จ`, 
            `สินค้า ${name} ถูก${action}แล้ว!`
        );

        // นำทางกลับไปยังหน้า Product List
        navigation.goBack(); 
    };
    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>
                {existingProduct ? 'แก้ไขสินค้า (5.3)' : 'เพิ่มสินค้าใหม่ (5.3)'}
            </Text>
            
            {/* รูปภาพสินค้า */}
            <Text style={styles.label}>รูปภาพสินค้า (5.4):</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.productImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <MaterialIcons name="camera-alt" size={40} color="#007bff" />
                        <Text style={styles.imagePickerText}>เลือกรูปภาพสินค้า</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* ฟอร์มข้อมูลสินค้า */}
            <Text style={styles.label}>ชื่อสินค้า:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="เช่น กาแฟเย็น, เค้กช็อกโกแลต"
            />

            <Text style={styles.label}>ราคา (บาท):</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="99.00"
                keyboardType="numeric"
            />
            
            <Text style={styles.label}>สต็อกคงเหลือ:</Text>
            <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                placeholder="10"
                keyboardType="numeric"
            />

            <Text style={styles.label}>คำอธิบายสินค้า:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="ใส่รายละเอียดสินค้าสั้นๆ"
                multiline
                numberOfLines={4}
            />

            <View style={{ marginTop: 30, marginBottom: 50 }}>
                <Button 
                    title={existingProduct ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้าใหม่'}
                    onPress={handleSaveProduct}
                    color="#007bff"
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 5,
        color: '#555',
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    imagePicker: {
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imagePickerText: {
        marginTop: 8,
        color: '#007bff',
        fontSize: 16,
    }
});

export default ManageProductScreen;
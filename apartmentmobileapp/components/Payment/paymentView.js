import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import axios from 'axios';
import myStyle from "../../styles/myStyle";
import { Avatar, Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

export default PaymentView = ({ route }) => {
    // Lấy dữ liệu từ route params
    const { data } = route.params;
    const [proof, setProof] = useState("")

    // Khai báo state để lưu trữ dữ liệu QR và trạng thái thanh toán
    const [qrCodeData, setQrCodeData] = useState(null);

    const loadPaymentQRCode = async () => {
        try {
            const url = 'https://api.vietqr.io/v2/generate';
            console.log('Lấy dữ liệu từ route params', data);
            const headers = {
                'x-client-id': '1879e3c9-a4a8-460a-8401-f1a87443f3d6',
                'x-api-key': 'e0756ef5-900e-40fd-9140-06491884db98',
                'Content-Type': 'application/json',
            };

            const requestBody = {
                "accountNo": "0789721763",
                "accountName": "NGUYEN TAN TAI",
                "acqId": 970422,
                "amount": `${data.total_amount}`, // Dùng số tiền từ data
                "addInfo": `Thanh toán hóa đơn ID: ${data.id}`,
                "format": "text",
                "template": "print"
            };

            const response = await axios.post(url, requestBody, { headers });

            if (response.data.code === '00') {
                setQrCodeData(response.data);
                // console.log('QR Code Data:', response.data);
            } else {
                console.error('Failed to generate QR code:', response.data.desc);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // const checkPaymentStatus = async () => {
    //     try {
    //         const url = 'https://public.casso.vn/v2/transactions';
    //         const headers = {
    //             'Authorization': 'Bearer YOUR_CASSO_ACCESS_TOKEN',
    //             'Content-Type': 'application/json',
    //         };

    //         const response = await axios.get(url, { headers });

    //         if (response.data.transactions.length > 0) {
    //             const transaction = response.data.transactions.find(
    //                 tx => tx.description.includes(`Thanh toán hóa đơn ID: ${data.id}`)
    //             );
    //             if (transaction && transaction.status === 'completed') {
    //                 setPaymentStatus("Thanh toán thành công!");
    //             } else {
    //                 setPaymentStatus("Chưa nhận được thanh toán!");
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error checking payment status:', error);
    //     }
    // };





    useEffect(() => {
        loadPaymentQRCode();  // Gọi một lần khi component mount

        // const interval = setInterval(() => {
        //     checkPaymentStatus();
        // }, 15000);

        // return () => clearInterval(interval);

    }, []);  // Sử dụng empty dependency array để chỉ chạy một lần khi component mount

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permission Denied!");
        } else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                setProof(res.assets[0])
            }
        }
    }
    const updateAvatar = async () => {
        if (!proof) {
            Alert.alert("Chưa chọn ảnh", "Vui lòng chọn ảnh.");
            return;
        }


        // Tạo FormData để gửi ảnh
        const formData = new FormData();
        formData.append('avatar', {
            uri: proof.uri,
            name: "avatar.jpg",
            type: "image/jpeg"
        });
        console.log([...formData.entries()]);
        try {
            const response = await axios.patch(
                `http://192.168.1.8:8000/invoices/${data.id}/upload-avatar/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.info('response fetch:', response.data)
            console.info('response fetch:', response)

            Alert.alert("Thành công", "Upload thành công!");

        } catch (error) {
            console.error('Error uploading avatar:', error);
            Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
        }
    };
    return (
        <ScrollView>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <TouchableOpacity style={myStyle.flex} onPress={picker}>
                    <Avatar.Icon size={24} icon="folder" />
                    <Text>Upload ảnh chứng từ</Text>
                </TouchableOpacity>
                {proof ? <><Image style={{ height: 100, width: 100 }} source={{ uri: proof.uri }} /></> : ""}
                <TouchableOpacity style={myStyle.flex} onPress={updateAvatar}>
                    <Button mode="contained" icon="account-check" buttonColor="#d33333">Upload</Button>
                </TouchableOpacity>
                {qrCodeData && qrCodeData.data && (
                    <>
                    <Text style={{ fontSize: 18, marginTop: 20 }}>
                            Quét mã QR để thanh toán
                        </Text>
                        <Image
                            source={{ uri: qrCodeData.data.qrDataURL }}
                            style={{ width: 600, height: 776 }}
                        />
                        
                    </>
                )}
                
            </View>
        </ScrollView>
    );
};

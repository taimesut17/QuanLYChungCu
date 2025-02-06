import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import myStyle from "../../styles/myStyle";
import MyContext from "../../configs/MyContext";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI, endpoints } from "../../configs/API";
import style from "./style";
import { Button } from "react-native-paper";
import DateFilter from "./filter";
import axios from "axios";

export default Bill = ({ navigation }) => {
    const [user, dispatch] = useContext(MyContext);
    const [allBills, setAllBills] = useState([]); // Danh sách gốc
    const [filteredBills, setFilteredBills] = useState([]);
    const [servicesByBill, setServicesByBill] = useState({}); // Lưu dịch vụ theo từng hóa đơn
    const [visible, setVisible] = useState({})
    const [qrCodeData, setQrCodeData] = useState(null)
    const loadServices = async (serviceIds, billId) => {
        if (servicesByBill[billId]) {
            setVisible(prev => ({
                ...prev,
                [billId]: !prev[billId],
            }));
            return;
        }

        setVisible(prev => ({
            ...prev,
            [billId]: !prev[billId], 
        }));

        const token = await AsyncStorage.getItem("access-token");
        if (!token) {
            console.error("Token không hợp lệ");
            return;
        }
        try {
            const promises = serviceIds.map(id =>
                authAPI(token).get(`${endpoints['get-services'](id)}`)
            );
            // Chờ tất cả API trả về
            const responses = await Promise.all(promises);
            const services = responses.map(res => res.data);
            console.log("API Services Response: ", services);
            setServicesByBill(prev => ({
                ...prev,
                [billId]: services, // Cập nhật dịch vụ cho hóa đơn với billId tương ứng
            }));
        } catch (ex) {
            console.error("Lỗi khi tải thông tin dịch vụ:", ex.response ? ex.response.data : ex.message);
            setServicesByBill(prev => ({
                ...prev,
                [billId]: [] // Đảm bảo gán giá trị mặc định khi có lỗi
            }));
        }
    };

    const normalizeDate = (date) => {
        return new Date(date.setHours(0, 0, 0, 0)); 
    };

    const applyDateFilter = (startDate, endDate) => {
        const filtered = allBills.filter(bill => {
            const billDate = new Date(bill.created_date); 
            const normalizedBillDate = normalizeDate(billDate); 
            const normalizedStartDate = normalizeDate(new Date(startDate)); 
            const normalizedEndDate = normalizeDate(new Date(endDate));

            return normalizedBillDate >= normalizedStartDate && normalizedBillDate <= normalizedEndDate;
        });
        setFilteredBills(filtered);
    };


    const loadInvoices = async () => {
        if (!user) {
            console.error("User hoặc Authorization không tồn tại");
            return;
        }
        const token = await AsyncStorage.getItem("access-token");
        try {
            let res = await authAPI(token).get(endpoints['my-invoice']);
            console.log("API response:", res.data);
            if (res.data && res.data.length > 0) {
                setAllBills(res.data);
                setFilteredBills(res.data)
            } else {
                console.log("Không có dữ liệu invoices.");
                setAllBills([]);
            }
        } catch (ex) {
            console.error("Lỗi khi tải dữ liệu:", ex);
            setAllBills([]); // Đảm bảo gán giá trị mặc định khi lỗi
        }
    };

    useEffect(() => {
        loadInvoices();
    }, []);

    // const handleGenerateQRCode = async ({ navigation }) => {
    //     try {
            
    //         const url = 'https://api.vietqr.io/v2/generate';
    
    //         const headers = {
    //             'x-client-id': '1879e3c9-a4a8-460a-8401-f1a87443f3d6',
    //             'x-api-key': 'e0756ef5-900e-40fd-9140-06491884db98',
    //             'Content-Type': 'application/json',
    //         };
    
    //         const requestBody = {
    //             "accountNo": "0789721763",
    //             "accountName": "NGUYEN TAN TAI",
    //             "acqId": 970422,
    //             "amount": 5000,
    //             "addInfo": "Thanh toan hoa don",
    //             "format": "text",
    //             "template": "compact"
    //         }
    
    //         const response = await axios.post(url, requestBody, { headers });
    //         setQrCodeData(response.data)
    //         console.log('QR Code Data:', response.data);
    //         console.log("TESTTTTTTTTTTTTTTTT")
    //         // Handle the response data accordingly
    //         if (response.data.code === '200') {
    //             // Process the successful response
    //         } else {
    //             console.error('Failed to generate QR code:', response.data.desc);
    //             // showErrorAlert(`Đã có lỗi xảy ra khi tạo mã QR: ${response.data.desc}`);
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         // showErrorAlert();
    //     }
    // };

    return (
        <View style={myStyle.container}>
            <DateFilter onApplyFilter={(startDate, endDate) => applyDateFilter(startDate, endDate)} />
            {allBills === null ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : allBills.length === 0 ? (
                <Text>Không có hóa đơn nào để hiển thị.</Text>
            ) : (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {qrCodeData && qrCodeData.data && (
                        <View>
                            <Image source={{uri: qrCodeData.data.qrDataURL}} style={{width: 200, height: 200}}/>
                        </View>
                    )}
                    {filteredBills.map(item => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                backgroundColor: "#f9f9f9",
                                borderRadius: 8,
                                padding: 16,
                                marginBottom: 16,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: "100%",
                                    paddingTop: 10
                                }}
                            >
                                <View style={style.container}>
                                    <View style={style.textFlex}>
                                        <Text style={style.text}>Tổng tiền: {item.total_amount} </Text>
                                        {item.payment_status === "COMPLETED" ? <Text style={{color: "green", fontWeight:'bold'}}>{item.payment_status}</Text>:""}
                                        {item.payment_status === "PENDING" ? <Text style={{color: "black", fontWeight:'bold'}}>{item.payment_status}</Text>:""}
                                        {item.payment_status === "FAILED" ? <Text style={{color: "red", fontWeight:'bold'}}>{item.payment_status}</Text>:""}
                                        
                                    </View>
                                    <Text style={style.text}>Ngày xuất hoá đơn: {new Date(item.created_date).toLocaleDateString('vi-VN', {
                                                                                        day: '2-digit',
                                                                                        month: '2-digit',
                                                                                        year: 'numeric',
                                                                                    })}</Text>
                                    {/* <Text style={style.text}>Services: {item.services} </Text> */}
                                    <TouchableOpacity onPress={() => loadServices(item.services,item.id)} style={{ marginTop: 8, backgroundColor: "#007bff", padding: 8, borderRadius: 4 }}>
                                        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                                            {visible[item.id] ? "Ẩn dịch vụ" : "Xem dịch vụ"}
                                        </Text>
                                    </TouchableOpacity>
                                    {visible[item.id] && servicesByBill[item.id] && servicesByBill[item.id].length > 0 && (
                                        <View style={{ marginTop: 16, padding: 16, backgroundColor: "#f1f1f1", borderRadius: 8 }}>
                                            <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 8, textAlign:'center' }}>Danh sách dịch vụ</Text>
                                            {servicesByBill[item.id].map(service => (
                                                <View key={service.id} style={{ marginBottom: 8 }}>
                                                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>Tên dịch vụ: {service.name}</Text>
                                                    <Text>Giá: {service.amount} VND</Text>
                                                </View>
                                            ))}
                                            {/* {console.info("data item:",item)} */}
                                            {item.payment_status === "COMPLETED" ? <Image style={{ height: 100, width: 100 }} source={{ uri: item.payment_proof }} /> : <TouchableOpacity onPress={() => navigation.navigate('paymentView', {data: item})}><Button textColor="#ffffff" buttonColor="#ef4136">Thanh toán ngay</Button></TouchableOpacity>}
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Styles from "./styles";
import API, { authAPI, endpoints } from "../../configs/API";
import { useContext, useEffect, useState } from "react";
import MyContext from "../../configs/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default Looker = () => {
    const [user, dispatch] = useContext(MyContext);
    const [items, setItems] = useState(null);

    const loadLooker = async () => {
        if (!user) {
            console.error("User hoặc Authorization không tồn tại");
            return;
        }

        const token = await AsyncStorage.getItem("access-token");

        try {
            let res = await authAPI(token).get(endpoints['my-locker']);

            console.log("API response:", res.data);
            if (res.data && res.data.length > 0) {
                setItems(res.data[0].items);
            } else {
                console.log("Không có dữ liệu items.");
            }
        } catch (ex) {
            console.error("Lỗi khi tải dữ liệu:", ex);
        }
    };

    useEffect(() => {
        loadLooker();
    }, []);

    const received = async (itemId) => {
        try {
            const token = await AsyncStorage.getItem("access-token");

            let res = await authAPI(token).patch(endpoints['set-received'](itemId));
        
            console.info(res.data)
            if (res.status === 200) {
                loadLooker();
            }
        } catch (ex) {
            console.error("Error updating status:", ex.response?.data || ex.message);
        }
    };

    return (
        <View style={Styles.container}>
          
            {items === null ? (
                // <ActivityIndicator size="large" color="#0000ff" /> // cái vòng tròn xoay load dữ liệu
                <Text>Không có hàng của bạn !!!</Text>
            ) : (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {items.map(item => (
                    <View key={item.id} style={{ flexDirection: "row", width: "100%", backgroundColor: "#f9f9f9", borderRadius: 8, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                        <View style={{
                            flexDirection: "row",  // Đảm bảo các phần tử nằm ngang
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: 100, height: 100, borderRadius: 8, marginRight: 16
                                }}
                                onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
                            />
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Tên: {item.name}</Text>
                                <Text style={{ fontSize: 14, color: '#555', fontWeight: 'bold' }}>Trạng thái: {item.status === 'PENDING' ? <><Text style={{color: 'red'}}>Chưa nhận</Text></> : <><Text style={{color: 'green'}}>Đã nhận</Text></>}</Text>
                                {item.status === 'PENDING' ? <>
                                    <TouchableOpacity style={{padding: 10,backgroundColor: "#ef4136", color: "white",textAlign: "center",borderRadius:10}} onPress={() => received(item.id)}>
                                        <Text style={{textAlign: "center",color: "white",fontWeight: "bold"}}>Xác nhận</Text>
                                    </TouchableOpacity>
                                </> : 
                                <>
                                <Text style={{ fontSize: 14, color: '#555',fontWeight: 'bold' }}>Ngày nhận: {item.received_at}</Text>
                                </>}
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
            )}
        </View>
    );
};
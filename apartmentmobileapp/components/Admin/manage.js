import { useContext, useEffect, useState } from "react"
import { Alert, ScrollView, Text, View } from "react-native"
import MyContext from "../../configs/MyContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { authAPI, endpoints } from "../../configs/API"
import { Button, Chip, Modal, Portal, Provider } from "react-native-paper"
import style from "./style"

export default Manage = () => {
    const [rooms, setRooms] = useState([])
    const [filteredRooms, setFilteredRooms] = useState([])
    const [user, dispatch] = useContext(MyContext)
    const [listFloors, setListFloors] = useState([])
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [btnChange, setBtnChange] =useState(true)

    const loadRooms = async () => {
        try {
            const access_token = await AsyncStorage.getItem('access-token')
            if (!access_token) {
                throw new Error("Access token not found");
            }
            console.log("Access Token:", access_token);
        
            const res = await authAPI(access_token).get(endpoints['rooms']);
            console.log("Response Rooms Data:", res.data.results);

            if (res.data && Array.isArray(res.data.results)) {
                setRooms(res.data.results);
                const listFloor = [...new Set(res.data.results.map(room => room.floor))].sort((a, b) => a - b);
                console.log('List Floors: ', listFloor)
                setListFloors(listFloor)
            } else {
                console.error("Response does not contain a valid 'results' array.");
                setRooms([]);
            }
        } catch (ex) {
            console.error("Error fetching rooms:", ex);
            setRooms([]);
        }
    };

    useEffect(() => {
       loadRooms()
    }, []);

    const filterUsers = (floor, id) => {
        const filtered = rooms.filter(room => {
            return parseInt(room.floor) === parseInt(floor);
        });
        setFilteredRooms(filtered);
    };

    const showModal = (user) => {
        setSelectedUser(user);
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
        setSelectedUser(null);
    };

    const accountLock = async (itemId) => {
        try {
            const token = await AsyncStorage.getItem("access-token");

            let res = await authAPI(token).patch(endpoints['lock-users'](itemId));
        
            console.info(res.data)
            if (res.status === 200) {
                loadRooms();
                Alert.alert("Thành công", btnChange ? "Khoá tài khoản thành công!!" : "Mở khoá tài khoản thành công!!");
                setBtnChange(!btnChange); 
            } else {
                Alert.alert("Thất bại", "Khoá tài khoản thất bại!!");
            }
        } catch (ex) {
            console.error("Error updating status:", ex.response?.data || ex.message);
        }
    }

    

    return (
        <Provider>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
                <ScrollView style={style.scrollView} horizontal showsHorizontalScrollIndicator={false}>
                    {listFloors ? listFloors.map(floor => (
                        <Chip onPress={() => filterUsers(floor, floor)} style={style.chipStyle} elevated key={floor}>
                            Tầng {floor}
                        </Chip>
                    )) : ""}
                </ScrollView>
                <View style={style.gridContainer}>
                    {filteredRooms ? filteredRooms.map(item => (
                        <View key={item.id}>
                            <Button
                                mode="contained"
                                style={style.gridItem}
                                onPress={() => showModal(item)}
                            >
                                {item.resident.username}
                            </Button>
                        </View>
                    )) : null}
                </View>

                
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} animationType="slide" contentContainerStyle={{ padding: 20, backgroundColor: 'white' }}>
                        {selectedUser && (
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Thông Tin Người Dùng</Text>
                                <Text>Id: {selectedUser.resident.id}</Text>
                                <Text>Tên: {selectedUser.resident.username}</Text>
                                <Text>Tầng: {selectedUser.floor}</Text>
                                <Text>Số Phòng: {selectedUser.number}</Text>
                                <Text>Trang thái: {selectedUser.resident.is_active ? "Còn hoạt động" : "Bị khoá"}</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                                    <Button  onPress={() => accountLock(selectedUser.resident.id)}
                                        mode="contained"style={{
                                            backgroundColor: '#ef4136',color: 'white',fontWeight: 'bold',flex: 1,marginRight: 5, 
                                        }}> <Text>{btnChange ? "Khoá tài khoản" : "Mở khoá tài khoản"}</Text></Button>
                                    <Button
                                        mode="contained"
                                        onPress={hideModal}
                                        style={{
                                            flex: 1,marginLeft: 5,}}>Đóng
                                    </Button>
                                </View>
                            </View>
                        )}
                    </Modal>
                </Portal>
            </View>
        </Provider>
    );
}

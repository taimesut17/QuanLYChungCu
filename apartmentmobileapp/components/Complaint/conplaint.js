import { Image, ScrollView, TextInput, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"
import MyContext from "../../configs/MyContext";
import { useContext, useEffect, useState } from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI, endpoints } from "../../configs/API";
import style from "./style";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { Alert } from "react-native";

export default Complaint = ()=>{
    //resident
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [user, dispatch] = useContext(MyContext);
    const [admin, setAdmin] = useState([])
    const [text, setText] = useState("")
    const [header, setHeader] = useState("")
    const [enable, setEnable] = useState(true)


    const [complaint, setComplaint] = useState({
        "header": "",
        "content": "",
        "admin": "",
        "resident":"",
        "is_active":"true"
    });
    //admin
    const [complaints, setComplaints] = useState([])

    const loadListAdmin = async () =>{
        try {
            const access_token = await AsyncStorage.getItem('access-token');
            if (!access_token) {
                throw new Error("Access token not found");
            }
            console.log("Access Token:", access_token);
        
            const res = await authAPI(access_token).get(endpoints['get-users']);
            console.log("Response Data:", res.data);
        
            if (res.data && Array.isArray(res.data.results)) {
                const adminList = res.data.results
                    .filter((user) => user.role === "ADMIN")
                    .map((admin) => ({
                        label: admin.username, 
                        value: admin.id,      
                    }));
                setAdmin(adminList);
                console.log("Filtered Admin List:", adminList);
            } else {
                console.error("Response does not contain a valid 'results' array.");
                setAdmin([]);
            }
        } catch (ex) {
            console.error("Error fetching admin list:", ex);
            setAdmin([]);
        }
    }

    const loadComplaints = async () => {
        try {
            const access_token = await AsyncStorage.getItem('access-token');
            if (!access_token) {
                throw new Error("Access token not found");
            }
            console.log("Access Token:", access_token);
        
            const res = await authAPI(access_token).get(endpoints['complaint']);
            console.log("Response Data Complaints:", res.data.results);
        
            if (res.data && Array.isArray(res.data.results)) {
                const receivedComplaints = res.data.results
                .filter((complaint) => complaint.admin === user.id) 
                
                setComplaints(receivedComplaints);
                console.log("Admin Complaints:", receivedComplaints);
            } else {
                console.error("Response does not contain a valid 'results' array.");
                setComplaints([]);
            }
        } catch (ex) {
            console.error("Error fetching admin list:", ex);
            setComplaints([]);
        }
    }

    useEffect(() => {
        if (user.role ==='RESIDENT'){
            loadListAdmin();
        }
        else if(user.role ==='ADMIN'){
            loadComplaints();
        }
    }, []);    

    const sendInfo = async () => {
        try {

            if (!value || !text || text.trim() === "") {
                Alert.alert("Thông báo","Vui lòng chọn người nhận và nhập nội dung phản ánh.");
                return;
            }

            const access_token = await AsyncStorage.getItem('access-token');
            if (!access_token) {
                alert("Không tìm thấy token, vui lòng đăng nhập lại.");
                return;
            }
            const complaintData = {
                ...complaint,
                header: header.trim() || "Không có tiêu đề", 
                content: text.trim(),
                admin: value, 
                resident: user.id, 
            };
            console.log("Sending Complaint Data:", complaintData);
            const res = await authAPI(access_token).post(endpoints['complaint'], complaintData);
    
            if (res.status === 201) {
                Alert.alert("Phản hồi","Phản ánh đã được gửi thành công!");
                setEnable(false);
                setText(""); 
                setValue(null); 
            } else {
                Alert.alert("Thông báo","Có lỗi xảy ra, vui lòng thử lại sau.");
            }
        } catch (ex) {
            console.error("Error sending complaint:", ex);
            Alert.alert("Thông báo","Có lỗi xảy ra trong quá trình gửi phản ánh. Vui lòng thử lại sau.");
        }
    };
    

    return (
        <View style={style.container}>
            {user?.role==='RESIDENT'? 
            (<View style={style.container}>
                <View style={{display: 'flex', justifyContent: 'space-beetween', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                    <Text style={{fontSize: 20, padding: 6, marginTop: 5, fontWeight: 'bold', flex: 7}}>Viết Phản Ánh</Text>
                    <TouchableOpacity disabled={!enable} onPress={sendInfo} style={{flex: 3, display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center'}}><Icon style={{backgroundColor: '#e8e8e8', padding: 3, borderRadius: 10}} name='arrow-right-bold-box-outline' size={30}/><Text style={{fontSize: 16, fontWeight: 'bold'}}>Gửi đi</Text></TouchableOpacity>
                </View>
                <View style={style.viewFlex}>
                    <DropDownPicker style={style.borderBottom}
                        open={open} value={value} items={admin} setOpen={setOpen} setValue={setValue} setItems={setAdmin}
                        placeholder="Gửi đến"
                    />
                    <View style={style.borderBottom}>
                        <Text style={{padding: 7, fontSize: 15}}>Từ: {user ? user.username : "Đang tải..."}</Text>
                    </View>
                    <View style={style.borderBottom}>
                        <TextInput style={{padding: 6, fontSize: 15, borderWidth:0}} value={header} onChangeText={setHeader} placeholder="Tiêu đề"/>
                    </View>
                    <View style={{padding: 6}}>
                        <TextInput style={{fontSize: 15}} placeholder="Soạn tin" multiline={true} numberOfLines={4} value={text} onChangeText={setText}/>
                    </View>
                </View>
            </View>) :
            <View style={style.container}>  
                 <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 5 }}>
                    {complaints.map(item =>(
                        <View key={item.id} style={{ flexDirection: 'row', width: '100%',alignItems: 'center', backgroundColor: "#f9f9f9", borderRadius: 8, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3}}>
                            <View>
                                <Image source={{uri: item.resident.avatar}} style={{
                                    width: 40, height: 40, borderRadius: 50, marginRight: 16
                                }}/>
                            </View>
                            <View>
                                <View style={{flex: 1, flexDirection: 'row', marginStart: 200}}>
                                    <Text style={{fontSize: 15}}>{item.resident.last_name}</Text>
                                    <Text style={{display: 'flex'}}>
                                        {new Date(item.created_date).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </Text>
                                </View>
                                <Text>{item.header}</Text>
                                <Text>{item.content}</Text>
                            </View>
                        </View>
                    ))}
                 </ScrollView>
            </View>}
        </View>
    )
}
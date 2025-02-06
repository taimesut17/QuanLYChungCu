import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native"
import styles from "./styles"
import { useContext, useEffect, useState } from "react"
import API, { authAPI, endpoints } from "../../configs/API"
import MyContext from "../../configs/MyContext"
import { Avatar, Button, TextInput } from "react-native-paper"
import myStyle from "../../styles/myStyle";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage"

export default Home = () => {

    const [user, dispatch] = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("")
    const [passwordOld, setPasswordOld] = useState("")

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permission Denied!");
        } else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                changeAvatar(res.assets[0]);
                console.info('picker: ', res.assets[0])
                setLoading(true);
            }
        }
    }
    const changeAvatar = (image) => {
        dispatch({
            type: 'login',
            payload: {
                ...user,
                avatar: image
            }
        });
    };



    // const updateAvatar = async () => {
    //     // Check if there's a selected avatar
    //     if (!user.avatar) {
    //         Alert.alert("Lỗi", "Vui lòng chọn ảnh đại diện trước.");
    //         return;
    //     }

    //     // Create a FormData object to send image and other data
    //     const form = new FormData();

    //     // Append the avatar to the FormData
    //     form.append('avatar', {
    //         uri: user.avatar.uri,
    //         name: 'avatar.jpg',  // You can change the name here if necessary
    //         type: 'image/jpeg'   // Assuming the avatar is in JPEG format
    //     });

    //     // Log to debug the FormData content
    //     console.log('form: ',[...form.entries()]);

    //     // try {
    //     //     const url = `http://192.168.1.8:8000/users/${user.id}/upload-avatar`;
    //     //     // Make the PUT request to upload the avatar
    //     //     const res = await fetch(url, {
    //     //         method: 'PUT',
    //     //         headers: {
    //     //             'Content-Type': 'multipart/form-data',
    //     //         },
    //     //         body: form,
    //     //     });

    //     //     // Check if the response is successful
    //     //     if (res.ok) {
    //     //         const responseData = await res.json();
    //     //         console.info("Avatar upload successful:", responseData);

    //     //         // Assuming the API responds with the new avatar URL
    //     //         const newAvatarUrl = responseData.avatar;

    //     //         // Update user data with the new avatar URL
    //     //         dispatch({
    //     //             type: 'UPDATE_USER',
    //     //             payload: {
    //     //                 ...user,
    //     //                 avatar: { uri: newAvatarUrl }
    //     //             }
    //     //         });

    //     //         // Show success message
    //     //         Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!", [{ text: "OK" }]);
    //     //     } else {
    //     //         const errorData = await res.json();
    //     //         console.error("Error:", errorData);
    //     //         Alert.alert("Lỗi", "Cập nhật ảnh đại diện thất bại, vui lòng thử lại!");
    //     //     }
    //     // } catch (ex) {
    //     //     console.error("Error:", ex.message);
    //     //     Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
    //     // } finally {
    //     //     setLoading(false);  // Reset loading state
    //     // }
    //     try {
    //         // Tạo URL API sử dụng ID người dùng
    //         const url = `http://192.168.1.8:8000/users/${user.id}/upload-avatar`;

    //         // Tạo yêu cầu PUT để tải lên avatar
    //         const res = await fetch(url, {
    //             method: 'PUT',
    //             headers: {
    //                 // Không cần thiết phải đặt Content-Type thành multipart/form-data vì fetch sẽ tự động xử lý
    //             },
    //             body: form,  // Đưa dữ liệu form vào trong body của yêu cầu
    //         });

    //         // Kiểm tra kiểu dữ liệu trả về (Content-Type)
    //         const contentType = res.headers.get('Content-Type');

    //         // Nếu phản hồi có kiểu JSON
    //         if (contentType && contentType.includes('application/json')) {
    //             const responseData = await res.json();

    //             // Kiểm tra nếu phản hồi thành công
    //             if (res.ok) {
    //                 console.info("Avatar upload successful:", responseData);

    //                 // Giả sử API trả về URL ảnh đại diện mới
    //                 const newAvatarUrl = responseData.avatar;

    //                 // Cập nhật thông tin người dùng với avatar mới
    //                 dispatch({
    //                     type: 'UPDATE_USER',
    //                     payload: {
    //                         ...user,
    //                         avatar: { uri: newAvatarUrl }
    //                     }
    //                 });

    //                 // Hiển thị thông báo thành công
    //                 Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!", [{ text: "OK" }]);
    //             } else {
    //                 console.error("Error:", responseData);
    //                 Alert.alert("Lỗi", "Cập nhật ảnh đại diện thất bại, vui lòng thử lại!");
    //             }
    //         } else {
    //             // Nếu phản hồi không phải JSON, in nội dung phản hồi
    //             const errorText = await res.text();  // Đọc phản hồi dưới dạng văn bản
    //             console.error("Unexpected response format:", errorText);
    //             Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
    //         }
    //     } catch (ex) {
    //         console.error("Error:", ex.message);
    //         Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
    //     } finally {
    //         setLoading(false);  // Reset trạng thái loading
    //     }

    // };
    const updateAvatar = async () => {
        if (!user.avatar.uri) {
            Alert.alert("Chưa chọn ảnh", "Vui lòng chọn một ảnh đại diện.");
            return;
        }

        setLoading(true);

        // Tạo FormData để gửi ảnh
        const formData = new FormData();
        formData.append('avatar', {
            uri: user.avatar.uri,
            name: "avatar.jpg",
            type: "image/jpeg"
        });
        console.log([...formData.entries()]);
        try {
            const response = await axios.patch(
                `http://192.168.1.8:8000/users/${user.id}/upload-avatar/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.info('response fetch:', response.data)
            console.info('response fetch:', response)


            dispatch({
                type: 'login',
                payload: {
                    ...user,
                    avatar: { uri: response.data.avatar },
                },
            });

            Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công!");

        } catch (error) {
            console.error('Error uploading avatar:', error);
            Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async () => {
        const payload = {
            new_password: password,
        };
        try {
            const token = await AsyncStorage.getItem("access-token");

            let res = await authAPI(token).patch(endpoints['change-password'](user.id),payload);
            console.info(res.data)
            if (res.status === 200) {
                // Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (ex) {
            console.error("Error updating status:", ex.response?.data || ex.message);
        }
        console.info("user:",user)
    }
    
    return (
        <View style={myStyle.container}>
            <Text style={styles.subject}>
                {user === null ? <>Xin chào !!!</> : <>Xin chào {user.first_name} {user.last_name} !!!</>}
            </Text>
            {user && user.avatar === null &&
                <Text style={styles.subject}>
                    <>Vui lòng cập nhật avatar</>
                </Text>
            }
            {user && user.avatar && loading ? <><Image style={styles.avatar} source={{ uri: user.avatar.uri }} /></> : ""}

            {user &&
                <TouchableOpacity style={myStyle.flex} onPress={picker}>
                    <Avatar.Icon size={24} icon="folder" />
                    <Text>Chọn ảnh đại diện</Text>
                </TouchableOpacity>
            }
            {user &&
                <TouchableOpacity style={myStyle.flex} onPress={updateAvatar}>
                    <Button mode="contained" icon="account-check" buttonColor="#d33333">Cập nhật</Button>
                </TouchableOpacity>
            }

            {user ? <>
                {/* <TextInput value={passwordOld} onChangeText={t => setPasswordOld(t)} mode="outlined" label="Mật khẩu cũ" secureTextEntry style={{ height: 30, width: 200 }} /> */}
                <TextInput value={password} onChangeText={t => setPassword(t)} mode="outlined" label="Mật khẩu mới" secureTextEntry style={{ height: 30, width: 200 }} />
                <TouchableOpacity style={myStyle.flex} onPress={changePassword}>
                    <Button mode="contained" icon="account-check" buttonColor="#d33333">Đổi mật khẩu</Button>
                </TouchableOpacity></> : ""
            }


        </View>
    )
}
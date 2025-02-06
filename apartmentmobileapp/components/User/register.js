import { Image, Text, TouchableOpacity, View } from "react-native"
import styles from "./styles"
import { ActivityIndicator, Avatar, Button, HelperText, TextInput } from "react-native-paper"
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import myStyle from "../../styles/myStyle";
import API, { endpoints } from "../../configs/API";
import { Alert } from "react-native";


export default Register = () => {

    // const navigation = useNavigation();
    const [user, setUser] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "username": "",
        "password": "",
        "avatar": null, 
        "is_active": true
    });
    const [surnameError, setSurnameError] = useState("")
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [userNameError, setUserNameError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const [loading, setLoading] = useState(false);

    const register = async () => {
        setLoading(true);
        setSurnameError("")
        setNameError("")
        setUserNameError("")
        setEmailError("")
        setPasswordError("")

        const form = new FormData();
        Object.keys(user).forEach((key) => {
            if (key === "avatar") {
                if (user.avatar) { 
                    form.append(key, {
                        uri: user.avatar.uri,
                        name: "avatar.jpg",
                        type: "image/jpeg"
                    });
                }
            } else {
                form.append(key, user[key]); 
            }
        });
        console.log([...form.entries()]);
    
        try {
            if (!user.first_name) {
                setSurnameError("Họ lót không được để trống.");
                return;
            }
            if (!user.last_name) {
                setNameError("Tên không được để trống.");
                return;
            }
            if (!user.email) {
                setEmailError("Email không được để trống.");
                return;
            }
            if (!user.username) {
                setUserNameError("Tên đăng nhập không được để trống.");
                return;
            }
            if (!user.password) {
                setPasswordError("Mật khẩu không được để trống.");
                return;
            }
           
            let res = await API.post(endpoints['register'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        
            console.info(res.data);
      
            Alert.alert("Thành công", "Đăng ký tài khoản thành công!", [
                { text: "OK" }
            ]);
        
        } catch (ex) {
            console.error("Error:", ex.response?.data || ex.message);
            Alert.alert("Lỗi", "Đăng ký thất bại, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }

        
    };
    
    
    

    // const picker = async () => {
    //     let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    //     if (status !== 'granted') {
    //         alert("Permission Denied!");
    //     } else {
    //         let res = await ImagePicker.launchImageLibraryAsync();
    //         if (!res.canceled) {
    //             change("avatar", res.assets[0])
    //         }
    //     }
    // }

    const change = (field, value) => {
        setUser(current => {
            return { ...current, [field]: value }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.cardView}>
                <Text style={styles.textCardView}>Tạo Tài Khoản Người Dùng Tại Đây</Text>
            </View>
            <View style={styles.registerForm}>
                <TextInput value={user.first_name} onChangeText={t =>change("first_name",t)} mode="outlined" label="Họ người dùng" style={styles.input}  error={!!surnameError}/>
                <HelperText style={styles.errorLabel} type="error" visible={!!surnameError}>{surnameError}</HelperText>

                <TextInput value={user.last_name} onChangeText={t =>change("last_name",t)} mode="outlined" label="Tên người dùng" style={styles.input} error={!!nameError}/>
                <HelperText style={styles.errorLabel} type="error" visible={!!nameError}>{nameError}</HelperText>

                <TextInput value={user.email} onChangeText={t =>change("email",t)} mode="outlined" label="Email" style={styles.input} error={!!emailError}/>
                <HelperText style={styles.errorLabel} type="error" visible={!!emailError}>{emailError}</HelperText>

                <TextInput value={user.username} onChangeText={t =>change("username",t)} mode="outlined" label="Tên đăng nhập" style={styles.input} error={!!userNameError}/>
                <HelperText style={styles.errorLabel} type="error" visible={!!userNameError}>{userNameError}</HelperText>

                <TextInput value={user.password} onChangeText={t =>change("password",t)} mode="outlined" label="Mật khẩu" secureTextEntry right={<TextInput.Icon icon="eye" />} style={styles.input} error={!!passwordError}/>
                <HelperText style={styles.errorLabel} type="error" visible={!!passwordError}>{passwordError}</HelperText>
                {/* <TouchableOpacity style={myStyle.flex}  onPress={picker}>
                    <Avatar.Icon size={24} icon="folder" />
                    <Text>Chọn ảnh đại diện</Text>
                </TouchableOpacity>
                {user.avatar ? <Image style={styles.avatar} source={{ uri: user.avatar.uri }} /> : ""} */}

            {loading === true ? <ActivityIndicator /> : <>
                <TouchableOpacity onPress={register}>
                    <Button mode="contained" icon="account-check" buttonColor="#d33333">Đăng ký</Button>
                </TouchableOpacity>
            </>}
            </View>
        </View>
    )
}
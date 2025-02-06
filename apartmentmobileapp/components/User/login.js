import { Alert, Image, Text, TouchableOpacity, View } from "react-native"
import { TextInput, Button } from "react-native-paper";
import styles from "./styles"
import { useContext, useState } from "react"
import MyContext from '../../configs/MyContext'
import { useNavigation } from "@react-navigation/native"
import API, { authAPI, endpoints } from "../../configs/API"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { HelperText } from "react-native-paper";


export default Login = () => {
    const navigation = useNavigation();
    const [username,setUserName] = useState();
    const [password, setPassword] = useState();
    const [user, dispatch] = useContext(MyContext);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");


    const login = async () => {
        setUsernameError(""); 
        setPasswordError("");
    
        if (!username) {
            setUsernameError("Tên đăng nhập không được để trống.");
            return;
        }
        if (!password) {
            setPasswordError("Mật khẩu không được để trống.");
            return;
        }
    
        try {
            let res = await API.post(
                endpoints["login"],
                {
                    username: username,
                    password: password,
                    client_id: "6ko3eQRKVU2UMhsSKJcTEkosFaEoWQM4IKuNZItk",
                    client_secret: "y0olBmiGQ0Gm8yT4TAbvF6URCQyzQ2ZbE7ZJE9EWrgXS4BWRItF5SogFAAzuSKCkcSsFMTA22yLz4ffY7niSf97NFwjYcJWmJqmDKV8xXGLKZWIUiOprLjzL1hCPt7Ij",
                    grant_type: "password",
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
    
            console.info("Token:", res.data.access_token);
            AsyncStorage.setItem("access-token", res.data.access_token);
    
            let user = await authAPI(res.data.access_token).get(endpoints["current-user"]);
            dispatch({
                type: "login",
                payload: user.data,
            });
    
            navigation.navigate("Home");
        } catch (ex) {
            // console.error("Login error:", ex.response?.data || ex.message);
            setUsernameError("Tên đăng nhập chưa chính xác");
            setPasswordError("Mật khẩu chưa chính xác.");
        }
    };
    
    
    // const nav = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.topBackground}>
                <Image  source={require('../../assets/images/logo.png')}/>
            </View>
            <View style={styles.formLogin}>
                <TextInput style={{marginTop: 10}} mode="outlined" label="Tên đăng nhập" onChangeText={t =>setUserName(t)}  error={!!usernameError}/>
                <HelperText style={styles.errorLabel} type="error" visible={!!usernameError}>{usernameError}</HelperText>
                <TextInput mode="outlined" label="Mật khẩu"  onChangeText={t =>setPassword(t)} secureTextEntry right={<TextInput.Icon icon="eye" />}  error={!!passwordError}/>
                <HelperText style={styles.errorLabel} type="error" visible={!!passwordError}>{passwordError}</HelperText>
                {/* <TouchableOpacity>
                    <Text style={{color: 'blue'}}>Quên mật khẩu?</Text>
                </TouchableOpacity> */}
                <TouchableOpacity>
                    <Button onPress={login} mode="contained" icon="account-check" buttonColor="#d33333">Đăng nhập</Button>
                </TouchableOpacity>
                {/* <TouchableOpacity>
                <Text> <Button onPress={() => nav.navigate("Register")}>Chưa có tài khoản?<Text style={{color: 'blue', marginStart: 3}}>Đăng ký ngay</Text></Button> </Text>
                </TouchableOpacity> */}
            </View>
            <View style = {styles.bottomBackground}></View>
        </View>
    )
}
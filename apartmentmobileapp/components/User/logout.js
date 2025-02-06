import { useContext } from "react"
import { Button } from "react-native"
import MyContext from "../../configs/MyContext"
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
export default Logout = () => {
    const navigation = useNavigation();

    const [user,dispatch] = useContext(MyContext);
    const logout = () =>{
         dispatch({
            "type":"logout"
        })
    }
    if (user === null)
        return <Button color="#ef4136" title="Đăng nhập" onPress={()=> navigation.navigate("Login")
        }></Button>

    return  <Button color="#ef4136" title="Đăng xuất" onPress={logout}></Button>
    
}
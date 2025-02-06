import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native"
import myStyles from "../../styles/myStyle"
import styles from "./styles"
import { useContext, useEffect, useState } from "react"
import API, { authAPI, endpoints } from "../../configs/API"
import MyContext from "../../configs/MyContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button, HelperText } from "react-native-paper"

export default Family = () => {

    const [family, setFamily] = useState([])
    const [user, dispatch] = useContext(MyContext);
    const [relative, setRelative] = useState({
        "first_name": "",
        "last_name": "",
        "resident": "",
        "is_active": "true"
    });
    const [surnameError, setSurnameError] = useState("");
    const [nameError, setNameError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadFamily = async () => {
        try {
            let access_token = await AsyncStorage.getItem('access-token')
            let res = await authAPI(access_token).get(endpoints['family'])
            console.log("Family response:", res.data)

            if (res && res.data) {
                setFamily(res.data)
            } else {
                setFamily([])
            }

        } catch (ex) {
            console.error(ex)
            setFamily([])
        }
    }

    useEffect(() => {
        loadFamily();
    }, [])

    const change = (field, value) => {
        setRelative(current => {
            return { ...current, [field]: value }
        });
    }

    const registerFamily = async () => {
        setSurnameError("");
        setNameError("");

        if (!relative.first_name.trim()) {
            setSurnameError("Họ lót không được để trống.");
            return;
        }
        if (!relative.last_name.trim()) {
            setNameError("Tên không được để trống.");
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('access-token')
            const form = new FormData();
            for (let key in relative) {
                form.append(key, key === 'resident' ? user.id : relative[key]);
            }
            let res = await authAPI(token).post(endpoints['register-relative'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Relative info:", res.data)
            loadFamily();
            setRelative({
                "first_name": "",
                "last_name": "",
                "resident": "",
                "is_active": "true"
            });
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={myStyles.container}>
            <Text style={myStyles.subject}>Đăng ký người thân</Text>
            <View style={{ width: "100%" }}>
                <TextInput
                    value={relative.first_name}
                    onChangeText={t => change("first_name", t)}
                    mode="outlined"
                    placeholder="Họ người thân"
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        backgroundColor: "#f9f9f9",
                        padding: 16,
                        marginBottom: 16,
                    }}
                    error={surnameError !== ""}
                />
                <HelperText type="error" visible={surnameError !== ""}>
                    {surnameError}
                </HelperText>

                <TextInput
                    value={relative.last_name}
                    onChangeText={t => change("last_name", t)}
                    mode="outlined"
                    placeholder="Tên người thân"
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        backgroundColor: "#f9f9f9",
                        padding: 16,
                        marginBottom: 16,
                    }}
                    error={nameError !== ""}
                />
                <HelperText type="error" visible={nameError !== ""}>
                    {nameError}
                </HelperText>

                <TouchableOpacity>
                    <Button
                        mode="contained"
                        icon="account-check"
                        buttonColor="#d33333"
                        onPress={registerFamily}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đăng ký"}
                    </Button>
                </TouchableOpacity>
            </View>
            {family.length === 0 ? (
                <ActivityIndicator />
            ) : (
                family.map(f => (
                    <Text key={f.id} style={{
                        flexDirection: "row",
                        width: "100%",
                        backgroundColor: "#f9f9f9",
                        padding: 16,
                        marginTop: 16,
                    }}>
                        {f.first_name} {f.last_name}
                    </Text>
                ))
            )}
        </View>
    )
}

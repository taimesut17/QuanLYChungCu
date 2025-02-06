import { useNavigation } from "@react-navigation/native";
import React, { useState, useContext } from "react";
import { TouchableOpacity, View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import moment from "moment";
import { List } from "react-native-paper";
import API, { endpoints } from "../../configs/API";
import MyUserReducer from "../../reducers/MyUserReducer";
import MyContext from "../../configs/MyContext";

export default Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const [user, dispatch] = useContext(MyContext);

    const loadUsers = async () => {
        try {
            setLoading(true);
            let res = await API.get(endpoints['users'])
            setUsers(res.data.results);
            console.info(res.data.results)
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }
    React.useEffect(() => {
        loadUsers();
    }, []);
    return (
        <View>
            {/* <Text>DANH SACH USER</Text> */}
            <ScrollView>
                {loading && <ActivityIndicator />}
                {user.role === 'RESIDENT' && users.filter(c => c.role === 'ADMIN').map(c => (
                    <TouchableOpacity key={c.id} onPress={() => nav.navigate('Chat', { user: c })}>
                        <List.Item
                            title={c.username}
                            description={moment(c.created_date).fromNow()}
                            left={() => <Image style={{ height: 100, width: 100 }} source={{ uri: c.avatar }} />}
                        />
                    </TouchableOpacity>
                ))}
                {user.role === 'ADMIN' && users.filter(c => c.role === 'RESIDENT').map(c => (
                    <TouchableOpacity key={c.id} onPress={() => nav.navigate('Chat', { user: c })}>
                        <List.Item
                            title={c.username}
                            description={moment(c.created_date).fromNow()}
                            left={() => <Image style={{ height: 100, width: 100 }} source={{ uri: c.avatar }} />}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}
import { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import MyContext from "../../configs/MyContext";
import { useRoute } from "@react-navigation/native";
import app from "../../configs/firebase";
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import { GiftedChat } from "react-native-gifted-chat";

export default Chat = () => {
    const userId = useContext(MyContext);
    const [messagesList, setMessagesList] = useState([]);
    const route = useRoute();

    const db = getFirestore(app);

    useEffect(() => {
        const chatId = `${userId[0].id}${route.params.user.id}`;
    
        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")  // Thay đổi orderBy để lấy tin nhắn theo thứ tự tăng dần
        );
    
        // Lắng nghe thay đổi trong collection
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allMessages = snapshot.docs.map(doc => ({
                ...doc.data(),
                _id: doc.id,
                createdAt: doc.data().createdAt.toDate(),
              }));
    
            // Đảo ngược tin nhắn để hiển thị tin nhắn cũ dưới
            setMessagesList(allMessages.reverse());  // Đảo lại danh sách tin nhắn
        });
    
        // Trả về hàm hủy đăng ký khi component unmount
        return () => unsubscribe();
    }, [userId[0].id, route.params.user.id]);

    const onSend = useCallback(async (messages = []) => {
        const msg = messages[0];
    
        const newMessage = {
            ...msg,
            sendBy: userId[0].id,
            sendTo: route.params.user.id,
            createdAt: new Date(),  // Thời gian mới cho tin nhắn
        };
    
        try {
            const chatId1 = `${userId[0].id}${route.params.user.id}`;
            const chatId2 = `${route.params.user.id}${userId[0].id}`;
    
            // Lưu tin nhắn vào Firestore
            await addDoc(collection(db, "chats", chatId1, "messages"), newMessage);
            await addDoc(collection(db, "chats", chatId2, "messages"), newMessage);
    
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [userId[0].id, route.params.user.id]);

    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messagesList}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userId[0].id, // Đảm bảo userId.id có giá trị
                }}
            />
        </View>
    );
};

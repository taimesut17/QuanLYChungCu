import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, Button, Image } from "react-native";
import { authAPI, endpoints } from "../../configs/API";
import { Modal, PaperProvider, Portal } from "react-native-paper";

export default SurVeyStatistics = () => {
    const [surveys, setSurveys] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState(null);

    const showModal = (item) => {
        setSelectedSurvey(item);
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
        setSelectedSurvey(null);
    };

    const containerStyle = { backgroundColor: 'white', padding: 20, borderRadius: 10 };

    const loadSurvey = async () => {
        try {
            const access_token = await AsyncStorage.getItem('access-token');
            let allSurveys = [];
            let nextPage = endpoints['surveys'];

            while (nextPage) {
                const res = await authAPI(access_token).get(nextPage);
                console.log("Surveys Stats responses:", res.data.results);

                if (res && res.data && res.data.results) {
                    allSurveys = [...allSurveys, ...res.data.results];
                }
                nextPage = res.data.next;
            }
            setSurveys(allSurveys);

        } catch (ex) {
            console.error(ex);
            setSurveys([]);
        }
    };

    useEffect(() => {
        loadSurvey();
    }, []);

    return (
        <PaperProvider>
            <ScrollView style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Thống kê khảo sát</Text>
                
                {surveys.length > 0 ? (
                    surveys.map(item => (
                        <View key={item.id} style={{ marginTop: 10 }}>
                            <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                <Text style={{ flex: 8, fontWeight: 'bold' }}>{item.header} ?</Text>
                                <Text style={{ flex: 2 }}>
                                    {new Date(item.created_date).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </View>

                            <Button
                                title="Xem chi tiết khảo sát"
                                color="#6200ea"
                                onPress={() => showModal(item)}
                            />
                        </View>
                    ))
                ) : (
                    <Text>Chưa có khảo sát nào</Text>
                )}

                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                        <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Chi tiết thống kê khảo sát</Text>
                            {selectedSurvey && (
                                <>
                                    <Text>Vấn đề: {selectedSurvey.header}</Text>
                                    <Text>Ngày tạo: {new Date(selectedSurvey.created_date).toLocaleDateString('vi-VN')}</Text>

                                    <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                                    {selectedSurvey.questions && selectedSurvey.questions.length > 0 ? (
                                        selectedSurvey.questions.map((question, index) => (
                                            <View key={index} style={{ marginBottom: 10 }}>
                                                <Text style={{ marginBottom: 5 }}>
                                                    {index + 1}. {question.question} ?
                                                </Text>
                                                <ScrollView key={`question-${question.id}`} style={{ marginLeft: 10 }}>
                                                    {question.answers && question.answers.length > 0 ? (
                                                        question.answers.map(answer => (
                                                            <View key={`answer-${answer.id}`} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                                                <Image
                                                                    source={{ uri: answer.resident.avatar }}
                                                                    style={{ width: 40, height: 40, borderRadius: 50, marginRight: 16, borderWidth: 2, borderColor: 'green' }}
                                                                />
                                                                <View>
                                                                    <View style={{display: 'flex', flexDirection: 'row', gap: 180}}>
                                                                        <Text>{answer.resident.username}</Text>
                                                                        <Text>
                                                                            {new Date(answer.created_date).toLocaleDateString('vi-VN', {
                                                                                day: '2-digit',
                                                                                month: '2-digit',
                                                                                year: 'numeric',
                                                                            })}
                                                                        </Text>
                                                                    </View>
                                                                    <Text style={{fontWeight: 'bold'}}>{answer.answer}</Text>
                                                                </View>
                                                            </View>
                                                        ))
                                                    ) : (
                                                        <Text key={`no-answer-${question.id}`}>Chưa có câu trả lời nào</Text>
                                                    )}
                                                </ScrollView>
                                            </View>
                                        ))
                                    ) : (
                                        <Text key="no-questions">Chưa có câu hỏi nào</Text>
                                    )}
                                    </ScrollView>
                                </>
                            )}
                            <Button title="Đóng" color="red" onPress={hideModal} />
                        </View>
                    </Modal>
                </Portal>
            </ScrollView>
        </PaperProvider>
    );
};

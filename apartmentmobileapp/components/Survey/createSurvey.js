import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@rneui/themed';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyContext from '../../configs/MyContext';
import { authAPI, endpoints } from '../../configs/API';

export default function CreateSurvey() {
    const [questions, setQuestions] = useState([]);
    const [header, setHeader] = useState('');
    const [isEditingHeader, setIsEditingHeader] = useState(true);
    const [newQuestion, setNewQuestion] = useState('');
    const [user] = useContext(MyContext);
    const [surveyId, setSurveyId] = useState(null);

    const handleHeaderChange = (text) => {
        setHeader(text);
    };
    useEffect(() => {
        setHeader('');
        setQuestions([]);
        setNewQuestion('');
    }, []);

    const validateSurveyData = () => {
        if (!header.trim()) {
            Alert.alert('Lỗi', 'Tiêu đề khảo sát không được để trống.');
            return false;
        }
        return true;
    };

    const validateQuestionData = (question) => {
        if (!question.trim()) {
            Alert.alert('Thông báo', 'Câu hỏi không được để trống.');
            return false;
        }
        return true;
    };

    const submitSurvey = async () => {
        if (!validateSurveyData()) return;

        try {
            const access_token = await AsyncStorage.getItem('access-token');
            if (!access_token) {
                Alert.alert('Thông báo', 'Không tìm thấy token, vui lòng đăng nhập lại.');
                return;
            }

            const surveyData = {
                active: true,
                header: header.trim(),
                admin: user.id
            };

            const res = await authAPI(access_token).post(endpoints['surveys'], surveyData);

            if (res.status === 201 || res.status === 200) {
                setSurveyId(res.data.id);
                Alert.alert('Thành công', 'Khảo sát đã được tạo thành công!');
            } else {
                Alert.alert('Thất bại', 'Tạo khảo sát thất bại, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi khi gửi khảo sát:', error.response?.data || error.message);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo khảo sát.');
        }
    };

    const submitQuestion = async (question) => {
        if (!validateQuestionData(question)) return;

        if (!surveyId) {
            Alert.alert('Thông báo', 'Vui lòng tạo khảo sát trước khi thêm câu hỏi.');
            return;
        }

        try {
            const access_token = await AsyncStorage.getItem('access-token');
            if (!access_token) {
                Alert.alert('Thông báo', 'Không tìm thấy token, vui lòng đăng nhập lại.');
                return;
            }

            const questionData = {
                active: true,
                question: question.trim(),
                survey_form: surveyId
            };

            const res = await authAPI(access_token).post(endpoints['questions'], questionData);

            if (res.status === 201 || res.status === 200) {
                console.log('Gửi câu hỏi thành công:', questionData);
            } else {
                Alert.alert('Thất bại', 'Gửi câu hỏi thất bại, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi khi gửi câu hỏi:', error.response?.data || error.message);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi câu hỏi.');
        }
    };

    const handleHeaderSubmit = () => {
        setIsEditingHeader(false);
        submitSurvey();
    };

    const addQuestion = () => {
        if (!validateQuestionData(newQuestion)) return;

        setQuestions(prevQuestions => [...prevQuestions, newQuestion.trim()]);
        submitQuestion(newQuestion);
        setNewQuestion('');
    };

    return (
        <ScrollView style={{ flex: 1, padding: 10 }}>
            <View style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Chủ đề khảo sát: </Text>
                {isEditingHeader ? (
                    <TextInput
                        placeholder="Nhập tiêu đề..."
                        value={header}
                        onChangeText={handleHeaderChange}
                        onSubmitEditing={handleHeaderSubmit} 
                        style={{ borderBottomWidth: 1, width: '70%' }}
                    />
                ) : (
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 3 }}>{header}?</Text>
                )}
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Danh sách câu hỏi:</Text>
                {questions.map((q, index) => (
                    <Text key={index} style={{ fontSize: 16, marginBottom: 5 }}>
                        {`Câu ${index + 1}: ${q}?`}
                    </Text>
                ))}
                <TextInput
                    placeholder="Nhập câu hỏi mới..."
                    value={newQuestion}
                    onChangeText={setNewQuestion}
                    onSubmitEditing={addQuestion}
                    returnKeyType="done"
                    style={{ borderBottomWidth: 1, padding: 5 }}
                />
            </View>

            <Button onPress={addQuestion} style={{ marginBottom: 20 }}>
                <Icon name="plus" color="white" size={30} />
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Thêm câu hỏi</Text>
            </Button>
        </ScrollView>
    );
}

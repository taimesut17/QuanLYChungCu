import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, TextInput } from 'react-native-paper';
import MyContext from '../../configs/MyContext';
import { authAPI, endpoints } from '../../configs/API';

export default function SurveyDetails({ route }) {
  const [user, dispatch] = useContext(MyContext);
  const { data: questions, survey_id: survey_form_id } = route.params;
  const [answers, setAnswers] = useState([]);
  const [buttonVisible, setButtonVisible] = useState(false);

  // Kiểm tra nếu tất cả các câu hỏi đã có câu trả lời
  const checkButton = () => {
    const allAnswered = questions.every((_, index) => answers[index]?.trim());
    setButtonVisible(allAnswered);
    if (!questions || questions.length <= 0) {
      setButtonVisible(false);
    }
  };

  // Cập nhật câu trả lời khi người dùng nhập
  const handleAnswerChange = (index, text) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = text;
      return updatedAnswers;
    });
  };

  // Kiểm tra mỗi khi answers thay đổi
  useEffect(() => {
    checkButton();
    console.log(user);
  }, [answers]);

  // Gửi dữ liệu khảo sát
  const submitSurvey = async () => {
    try {
      const access_token = await AsyncStorage.getItem('access-token');
      if (!access_token) {
        Alert.alert('Thông báo', 'Không tìm thấy token, vui lòng đăng nhập lại.');
        return;
      }
  
      // Duyệt qua từng câu trả lời và gửi câu trả lời tương ứng với câu hỏi
      for (let index in answers) {
        const responseForm = {
          resident: user.id,
          active: true,
          answer: answers[index], // Câu trả lời cho câu hỏi
          survey_form: survey_form_id,
          question: questions[index].id, // ID câu hỏi tương ứng
        };
  
        console.log("Đang gửi dữ liệu: ", responseForm);
  
        // Gửi yêu cầu POST tới API
        const res = await authAPI(access_token).post(endpoints['response_forms'], responseForm, {
          headers: {
            'Authorization': `Bearer ${access_token}`, // Thêm header Authorization
            'Content-Type': 'application/json', // Đảm bảo gửi đúng kiểu dữ liệu
          }
        });
  
        if (res.status === 201 || res.status === 200) {
          console.log('Gửi thành công:', responseForm);
        } else {
          console.log('Gửi thất bại:', responseForm);
          Alert.alert('Thông báo', 'Có lỗi xảy ra khi gửi khảo sát!');
          return; // Dừng lại nếu có lỗi
        }
      }
  
      Alert.alert('Thành công', 'Khảo sát đã được gửi thành công!');
    } catch (error) {
      console.error('Lỗi khi gửi khảo sát:', error.response?.data || error.message);
      Alert.alert('Thông báo', 'Có lỗi xảy ra khi gửi khảo sát!');
    }
  };
  

  return (
    <>
      <ScrollView style={{ padding: 5 }}>
        {questions && questions.length > 0 ? (
          questions.map((question, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {`${index + 1}. ${question.question || "Nội dung không xác định"}`}?
              </Text>
              <TextInput
                placeholder="Điền phản hồi vào đây..."
                multiline={true}
                value={answers[index] || ''}
                onChangeText={(text) => handleAnswerChange(index, text)}
                style={{
                  backgroundColor: '#f5f5f5',
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 5,
                }}
              />
            </View>
          ))
        ) : (
          <Text>Không có câu hỏi nào để hiển thị.</Text>
        )}

        {buttonVisible && (
          <TouchableOpacity style={{ marginTop: 20 }}>
            <Button
              mode="contained"
              buttonColor="#ef4136"
              onPress={submitSurvey}
            >
              Gửi khảo sát
            </Button>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
}

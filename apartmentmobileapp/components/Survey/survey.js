import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import style from './style';
import MyContext from '../../configs/MyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, endpoints } from '../../configs/API';

export default function Survey({ navigation }) {
  const [user, dispatch] = useState(MyContext)
  const [surveys, setSurveys] = useState([])
    
  const loadQuestions = async () => {
    try {
      const access_token = await AsyncStorage.getItem('access-token');
      let allSurveys = [];
      let nextPage = endpoints['surveys']; 
  
      while (nextPage) {
        const res = await authAPI(access_token).get(nextPage);
        console.log("Surveys responses:", res.data.results);
        
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
    loadQuestions()
},[])

  return (
    
    <ScrollView style={style.container}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
        <Text>Bộ lộc</Text>
            <Text>Phiếu Khảo Sát</Text>
        </View>
        
        {surveys ? surveys.map(item => (
            <View key={item.id} style={{marginTop: 10}}>
                <View style={{display: 'flex', flexDirection: 'row', marginBottom: 5}}>
                    <Text style={{flex: 8, fontWeight: 'bold'}}>{item.header} ?</Text>
                    <Text style={{flex: 2}}>{new Date(item.created_date).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                    </Text>
                </View>
                <Button
                    title="Xem chi tiết khảo sát"
                    onPress={() => navigation.navigate('SurveyDetails', { data: item.questions, survey_id: item.id })}
                />
            </View>
        )): <Text>Chưa có phiếu khảo sát nào!</Text>}
        
    </ScrollView>
  );
}

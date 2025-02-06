
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Tab, TabView } from '@rneui/themed';
import Survey from './survey';
import SurveyDetails from './surveyDetails'; 
import CreateSurvey from './createSurvey';
import SurveyStatistics from './surveyStatistics';
import { useState } from 'react';


// Tạo Stack Navigator
const Stack = createNativeStackNavigator();

// Stack Navigator cho tab "Khảo sát"
const SurveyStackScreen = () => (
    <Stack.Navigator>
        <Stack.Screen name="Survey" component={Survey} options={{ title: 'Khảo sát' }} />
        <Stack.Screen name="SurveyDetails" component={SurveyDetails} options={{ title: 'Chi tiết khảo sát' }} />
    </Stack.Navigator>
);


const AdminSurvey = () => {
    const [index, setIndex] = useState(0);

    return (
        <>
            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                    backgroundColor: '#ef4136',
                    height: 3,
                }}
                variant="primary"
            >
                <Tab.Item
                    title="Khảo sát"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Tạo khảo sát"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'add-circle-outline', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Thống kê"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'stats-chart-outline', type: 'ionicon', color: 'white' }}
                />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <SurveyStackScreen />
                </TabView.Item>

                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <CreateSurvey />
                </TabView.Item>

                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <SurveyStatistics />
                </TabView.Item>
            </TabView>
        </>
    );
};

export default AdminSurvey;

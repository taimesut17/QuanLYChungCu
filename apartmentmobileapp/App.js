import { NavigationContainer } from '@react-navigation/native';
import Home from './components/Home/home';
import Login from './components/User/login';
import Register from './components/User/register';
import Logout from './components/User/logout';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useReducer } from 'react';
import MyUserReducer from './reducers/MyUserReducer';
import MyContext from './configs/MyContext'
import Looker from './components/Looker/looker';
import bill from './components/Bill/bill';
import family from './components/User/family';
import myStyle from './styles/myStyle';
import conplaint from './components/Complaint/conplaint';
import manage from './components/Admin/manage';
import Survey from './components/Survey/survey';
import SurveyDetails from './components/Survey/surveyDetails';
import Users from './components/Chat/users'
import Chat from './components/Chat/chat';
import adminSurvey from './components/Survey/adminSurvey';
import paymentView from './components/Payment/paymentView';
import manageView from './components/Admin/manageView';


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null)

  const SurveyStackScreen = () => (
    <Stack.Navigator>
      <Stack.Screen name="Survey" component={Survey} options={{ title: 'Khảo sát' }} />
      <Stack.Screen name="SurveyDetails" component={SurveyDetails} options={{ title: 'Chi tiết khảo sát' }} />
    </Stack.Navigator>
  );


  const ChatStackScreen = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Users"
        component={Users}
        options={{ title: 'Chat' }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ title: 'Chat', headerBackTitle: 'Quay lại' }}
      />
    </Stack.Navigator>
  );

  const PaymentStackScreen = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Bills"
        component={bill}
        options={{ title: 'Hoá đơn của tôi' }}
      />
      <Stack.Screen
        name="paymentView"
        component={paymentView}
        options={{ title: 'Thanh toán hoá đơn', headerBackTitle: 'Quay lại' }}
      />
    </Stack.Navigator>
  );


  return (
    <MyContext.Provider value={[user, dispatch]}>
      <NavigationContainer >
        <Drawer.Navigator screenOptions={{
          headerRight: Logout, drawerLabelStyle: {
            fontWeight: 'bold',
            fontSize: 16
          }
        }}>
          <Drawer.Screen name="Home" component={Home} options={{ title: 'Trang chủ' }} />
          {user === null ? <>
            <Drawer.Screen name="Login" component={Login} options={{ title: 'Đăng Nhập' }} />
            {/* <Drawer.Screen name="Register" component={Register} options={{ title: 'Đăng Ký' }} /> */}
          </> :
            <>
              <Drawer.Screen name="Chat" component={ChatStackScreen} options={{ title: 'Chat' }} />


              {user.role === 'ADMIN' ?
                <>
                  <Drawer.Screen name="User Managements" component={manageView} options={{ title: 'Quản lý' }} />
                  <Drawer.Screen name="Admin Survey" component={adminSurvey} options={{ title: 'Khảo sát' }} />
                </>
                : 
                <>
                <Drawer.Screen name="Survey" component={SurveyStackScreen} options={{ title: 'Khảo sát' }} />
                <Drawer.Screen name="Bill" component={PaymentStackScreen} options={{ title: 'Hoá đơn' }} />
                <Drawer.Screen name="Family" component={family} options={{ title: 'Người thân' }} />
                <Drawer.Screen name="Complaint" component={conplaint} options={{ title: 'Phản ánh' }} />
                <Drawer.Screen name="Looker" component={Looker} options={{ title: 'Tủ đồ' }} />
                </>}
              <Drawer.Screen name="Logout" component={Logout} options={{ drawerItemStyle: { display: 'none' } }} />
            </>}
        </Drawer.Navigator>
      </NavigationContainer>
    </MyContext.Provider>
  );
}


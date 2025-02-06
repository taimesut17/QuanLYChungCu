import { Tab, TabView } from '@rneui/themed';
import Manage from './manage';
import Register from '../User/register';
import { useState } from 'react';

export default ManageView = () => {
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
                    title="Khách hàng"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Cấp tài khoản"
                    titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'add-circle-outline', type: 'ionicon', color: 'white' }}
                />
                
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <Manage/>
                </TabView.Item>

                <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
                    <Register/>
                </TabView.Item>

                
            </TabView>
        </>
    );
}
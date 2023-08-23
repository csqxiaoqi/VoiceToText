// router/index.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// 导入页面组件
import Index from '../pages/Index';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen name="index" component={Index} />
        {/* 可以添加更多页面的路由 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

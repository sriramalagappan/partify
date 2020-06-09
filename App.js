/**********************************************************************;
* Project           : Partify
*
* Author            : Sriram V Alagappan
*
* Date created      : 05/31/2020
*
* Purpose           : Mobile application on IOS and Android that allows 
*                     users to create private rooms and create a shared 
*                     playlist together. The playlist is outputted on a 
*                     designated host phone can be updated in real-time 
*                     by anyone (for use in a party or gathering) 
*
***********************************************************************/

import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk'
import MainNavigator from './navigation/MainNavigator'

// reducer imports
import userReducer from './store/reducers/user'
import deviceReducer from './store/reducers/devices'
import roomReducer from './store/reducers/room'
import songReducer from './store/reducers/songs'
import playerReducer from './store/reducers/player'
import adminReducer from './store/reducers/admin'

// disable error warnings while in development
console.disableYellowBox = true;

const rootReducer = combineReducers({
  user: userReducer,
  devices: deviceReducer,
  room: roomReducer,
  songs: songReducer,
  player: playerReducer,
  admin: adminReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

// fetch fonts from the assets folder
const fetchFonts = () => {
  return Font.loadAsync({
    'regular': require('./assets/fonts/regular.ttf'),
    'bold': require('./assets/fonts/bold.ttf'),
    'medium': require('./assets/fonts/medium.ttf'),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}
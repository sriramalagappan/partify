// Button to be used in a header

import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import device from '../misc/device'

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={Platform.OS === 'android' ? 'white' : Colors.primary}
      buttonStyle={{
        marginTop: (Platform.OS === 'android' || device()) ? 30 : 20,
      }}
    />
  );
};

export default CustomHeaderButton;

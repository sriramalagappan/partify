import React from 'react'
import { View, Keyboard, TouchableWithoutFeedback, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../components/Input'
import SpotifyDevice from '../../components/SpotifyDevice'
import CustomButton from '../../components/CustomButton'
import { LinearGradient } from 'expo-linear-gradient';

import styles from './styles'

const CreateRoomScreenUI = props => (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <KeyboardAwareScrollView style={{ backgroundColor: 'black' }} contentContainerStyle={styles.screen}>
            <LinearGradient
                colors={['rgba(100,100,100,0.8)', 'transparent']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 200,
                }}
            />
            <Text style={styles.header}>Create Room</Text>
            <Input
                placeholder={'Room Name'}
                maxLength={30}
                error={''}
                value={props.roomName}
                onChangeText={props.roomNameHandler}
                error={props.nameError}
            />
            <Input
                placeholder={'Password (optional)'}
                maxLength={30}
                error={''}
                isPassword={true}
                value={props.passowordHandler}
                onChangeText={props.passowordHandler}
                error={props.passError}
            />
            <SpotifyDevice
                devices={props.devices}
                onPressIcon={props.refreshHandler}
                onPress={(input) => { props.deviceHandler(input) }}
                selectedDevice={props.device}
                isLoading={props.isLoading}
            />
            <View style={styles.errorContainer}>
                <Text style={{ ...styles.errorText, ...props.errorTextStyle }} numberOfLines={1}>{props.deviceError}</Text>
            </View>
            <CustomButton
                style={styles.button}
                title={'Create Room'}
                textStyle={styles.buttonText}
                onPress={props.createHandler}
            />
        </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
)

export default CreateRoomScreenUI
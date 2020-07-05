import React from 'react'
import { View, Text } from 'react-native'
import CustomButton from '../../components/CustomButton'
import styles from './styles'
import { LinearGradient } from 'expo-linear-gradient';

const AuthScreenContainer = props => (
    <View style={styles.screen}>
        <LinearGradient
            colors={['rgba(80,80,80,0.8)', 'transparent']}
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 200,
            }}
        />
        <Text style={styles.header}>Partify</Text>
        <View style={styles.buttonContainer}>
            <CustomButton
                onPress={props.loginHandler}
                title={"Login to Spotify"}
                style={styles.button}
            />
        </View>
    </View>
)

export default AuthScreenContainer
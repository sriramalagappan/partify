import React from 'react'
import { View, Text } from 'react-native'
import CustomButton from '../../components/CustomButton'
import styles from './styles'

const AuthScreenContainer = props => (
    <View style={styles.screen}>
        <Text style={styles.header}>Partify</Text>
        <View style={styles.buttonContainer}>
            <CustomButton
                onPress={props.loginHandler}
                title={"Login to Spotify"}
                style={styles.button}
            />
            <CustomButton
                onPress={props.test}
                title={"test"}
            />
        </View>
    </View>
)

export default AuthScreenContainer
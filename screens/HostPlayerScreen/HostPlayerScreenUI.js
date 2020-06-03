import React from 'react'
import { View, Text, Easing } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import TextTicker from 'react-native-text-ticker'

import styles from './styles'

const HostPlayerScreenUI = props => {

    return (
        <View style={styles.screen}>
            <LinearGradient
                colors={['rgba(29,180,76,0.6)', 'transparent']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 200,
                }}
            />
            <TextTicker
                style={styles.scrollingText}
                duration={15000}
                loop
                bounce
                repeatSpacer={50}
                easing={Easing.inOut(Easing.ease)}
            >
                You have no songs. To add a song and get started, click the add button below
            </TextTicker>
        </View>
    )
}

export default HostPlayerScreenUI
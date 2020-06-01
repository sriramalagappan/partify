import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import styles from './styles'

const StartupScreenContainter = props => (
    <View style={styles.screen}>
        <ActivityIndicator
            size='large'
            color='black'
        />
    </View>
)

export default StartupScreenContainter
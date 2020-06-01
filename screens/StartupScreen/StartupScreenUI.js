import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import colors from '../../constants/Colors'
import styles from './styles'

const StartupScreenContainter = props => (
    <View style={styles.screen}>
        <ActivityIndicator
            size='large'
            color={colors.primary}
        />
    </View>
)

export default StartupScreenContainter
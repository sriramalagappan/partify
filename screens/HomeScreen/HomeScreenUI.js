import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

const HomeScreenUI = props => (
    <View style={styles.screen}>
        <Text style={styles.header}>Hello {props.display_name}</Text>
    </View>
)

export default HomeScreenUI



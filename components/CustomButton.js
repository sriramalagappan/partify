import React from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableNativeFeedback, Platform, Text } from 'react-native'
import colors from '../constants/Colors'

const CustomButton = props => {

    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    return (
        <View style={styles.container}>
            <TouchableCmp style={(Platform.OS === 'android') ? {flex:1} : null} onPress={props.onPress}>
                <View style={{ ...styles.button, ...props.style }}>
                    <Text style={{ ...styles.text, ...props.textStyle}}>
                        {props.title}
                    </Text>
                </View>
            </TouchableCmp>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        width: 100,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
    },

    container: {
        borderRadius: 10,
        overflow: (Platform.OS === 'android' && Platform.Version >= 21) ? 'hidden' : 'visible',
        marginVertical: 10,
        marginHorizontal: 10,
    },

    text: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,
        fontFamily: 'regular'
    }
});

export default CustomButton
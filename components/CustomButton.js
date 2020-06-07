import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import colors from '../constants/Colors'

const CustomButton = props => {

    return (
        <View style={{...styles.container, ...props.buttonContainerStyle}}>
            <TouchableOpacity onPress={props.onPress}>
                <View style={{ ...styles.button, ...props.style }}>
                    <Text style={{ ...styles.text, ...props.textStyle}}>
                        {props.title}
                    </Text>
                </View>
            </TouchableOpacity>
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
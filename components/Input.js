// Default input fields

import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import colors from '../constants/Colors'

const Input = props => {

    const [highlight, setHighlight] = useState(false)

    let inputContainerStyle = (highlight) ? styles.inputContainerHighlight : styles.inputContainer

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={{...inputContainerStyle, ...props.style}}>
                <TextInput
                    {...props}
                    style={{...styles.input, ...props.inputStyle}}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    selectionColor={'black'}
                    onFocus={() => setHighlight(true)}
                    onBlur={() => setHighlight(false)}
                    placeholder={props.placeholder}
                    placeholderTextColor={'#aeb5bf'}
                    maxLength={props.maxLength}
                    selectionColor={'#aeb5bf'}
                    secureTextEntry={props.isPassword}
                />
            </View>
            <Text style={{...styles.errorText, ...props.errorTextStyle}} numberOfLines={1}>{props.error}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: 60,
        marginHorizontal: 15,
        marginVertical: 10,
    },

    title: {
        fontFamily: 'regular',
        fontSize: 15,
    },

    inputContainer: {
        height: 40,
        borderColor: '#3b3b3b',
        borderBottomWidth: 2,
    },

    inputContainerHighlight: {
        height: 40,
        borderColor: colors.primary,
        borderBottomWidth: 2,
    },

    input: {
        height: 40,
        fontFamily: 'regular',
        fontSize: 20,
        color: '#a8a8a8'
    },

    errorText: {
        color: 'red',
        fontSize: 15,
        fontFamily: 'medium',
        marginTop: 5,
    }
})

export default Input

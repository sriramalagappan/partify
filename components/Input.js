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
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: 60,
        margin: 15,
    },

    title: {
        fontFamily: 'regular',
        fontSize: 15,
    },

    inputContainer: {
        height: 40,
        borderColor: 'black',
        borderRadius: 10,
        borderWidth: 2,
    },

    inputContainerHighlight: {
        height: 40,
        borderColor: colors.primary,
        borderRadius: 10,
        borderWidth: 2,
    },

    input: {
        marginLeft: 5,
        marginRight: 4,
        paddingBottom: 4.8,
        height: 40,
        fontFamily: 'regular',
        fontSize: 20
    }
})

export default Input

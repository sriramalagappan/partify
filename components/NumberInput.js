// An input field that should be used when wanting the user to only input numbers

import React from "react"
import { TextInput, StyleSheet } from "react-native"

const NumberInput = props => (
    <TextInput {...props}
        style={{ ...styles.input, ...props.style }}
        autoCorrect={false}
        keyboardType={props.isLetters ? "default" : "number-pad"}
        maxLength={props.length}
        blurOnSubmit
    />
)

const styles = StyleSheet.create({
    input: {
        height: 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        width: 40,
        fontFamily: 'thin',
        fontSize: 15,
        color: 'black'
      },
})

export default NumberInput

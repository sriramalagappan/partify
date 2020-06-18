// Circular button that should be used for any add functionality

import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

const AddButton = props => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={props.onPress}>
                <View style={{ ...styles.card, ...props.style }}>
                    {props.children}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },

    container: {
        borderRadius: 25,
    }
});

export default AddButton
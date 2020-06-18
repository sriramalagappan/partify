// Custom icon button

import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

const Icon = props => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={{ ...styles.iconContainer, ...props.style }}>
                {props.children}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        width: 25,
        height: 25,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default Icon
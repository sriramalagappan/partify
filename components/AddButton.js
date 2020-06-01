import React from 'react'
import { View, StyleSheet, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native'

const AddButton = props => {

    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    return (
        <View style={styles.container}>
            <TouchableCmp style={(Platform.OS === 'android') ? {flex:1} : null} onPress={props.onPress}>
                <View style={{ ...styles.card, ...props.style }}>
                    {props.children}
                </View>
            </TouchableCmp>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 50,
        height: 50,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        borderRadius: 25,
        backgroundColor: 'white',
    },
    
    container: {
        borderRadius: 25,
        overflow: (Platform.OS === 'android' && Platform.Version >= 21) ? 'hidden' : 'visible',
        elevation: 5,
    }
});

export default AddButton
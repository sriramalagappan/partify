import React from 'react'
import { View, StyleSheet, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native'
import colors from '../constants/Colors'
import { Entypo } from '@expo/vector-icons';


const AddButton = props => {

    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    return (
        <View style={styles.container}>
            <TouchableCmp style={(Platform.OS === 'android') ? { flex: 1 } : null} onPress={props.onPress}>
                <View style={{ ...styles.card, ...props.style }}>
                    <Entypo name='plus' size={40} color={'white'} />
                </View>
            </TouchableCmp>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },

    container: {
        borderRadius: 25,
        overflow: (Platform.OS === 'android' && Platform.Version >= 21) ? 'hidden' : 'visible',
    }
});

export default AddButton
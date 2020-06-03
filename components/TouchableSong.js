import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'

const height = (Dimensions.get('window').height)
const width = (Dimensions.get('window').width)

const TouchableSong = props => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={{ uri: props.imageUri }}
                />
                <View style={styles.column}>
                    <Text style={styles.name} numberOfLines={2}>{props.name}</Text>
                    <Text style={styles.author} numberOfLines={1}>{props.author}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: '#494c52',
        marginTop: 20,
        flexDirection: 'row',
        borderRadius: 5,
    },

    image: {
        width: 60,
        height: 60,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },

    column: {
        flexDirection: 'column',
        width: (width * 8 / 10) - 60,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        justifyContent: 'space-evenly'
    },

    name: {
        fontFamily: 'regular',
        fontSize: 15,
        color: 'white',
        marginLeft: 5,
    },

    author: {
        fontFamily: 'medium',
        fontSize: 15,
        color: '#cccccc',
        marginLeft: 5,
    },
})

export default TouchableSong
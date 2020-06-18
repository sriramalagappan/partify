// Song button component that displays image, title, and artist(s)

import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'

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
                    <View style={styles.row}>
                        {(props.isExplicit) ?
                            (
                                <View style={styles.explicitContainer}>
                                    <Text style={styles.explicitText}>E</Text>
                                </View>
                            ) : (
                                <View />
                            )
                        }
                        <Text style={(props.isExplicit ? styles.explicitAuthor : styles.author)} numberOfLines={1}>{props.author}</Text>
                    </View>
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
        fontFamily: 'medium',
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

    explicitAuthor: {
        fontFamily: 'medium',
        fontSize: 15,
        color: '#cccccc',
        marginLeft: 5,
        width: '88%'
    },

    explicitContainer: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#444444',
        borderRadius: 3,
        marginLeft: 5,
    },

    row: {
        flexDirection: 'row',
    },

    explicitText: {
        fontFamily: 'bold',
        fontSize: 12,
        color: 'white'
    },
})

export default TouchableSong
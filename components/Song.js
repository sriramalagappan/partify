// Song component that displays image, title, and artist(s)

import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable';

const width = (Dimensions.get('window').width)

const Song = props => {

    const RightAction = () => {
        return (
            <View style={styles.rightAction}>
                <Text style={styles.actionText}>Remove from queue</Text>
            </View>
        )
    }

    const container = (props.isQueue) ? styles.queueContainer : styles.defaultContainer

    const SongComopnent = (
        <View style={container}>
            {(props.imageUri) ?
                (
                    <Image
                        style={styles.image}
                        source={{ uri: props.imageUri }}
                    />
                ) : (
                    <View style={styles.blankImage}>
                        <Text style={styles.fillerText}>E</Text>
                    </View>
                )
            }
            <View style={styles.column}>
                <Text style={styles.name} numberOfLines={1}>{props.name}</Text>
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
    )

    // Determine whether the use can interact with the element given their status in the room
    if (props.isQueue && props.elevatedUser) {
        return (
            <Swipeable
                renderRightActions={RightAction}
                onSwipeableRightOpen={props.onSwipeRight}
            >
                {SongComopnent}
            </Swipeable>
        )
    } else {
        return (
            <View>
                {SongComopnent}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    defaultContainer: {
        height: 60,
        backgroundColor: '#747982',
        marginTop: 20,
        flexDirection: 'row',
        borderRadius: 5,
    },

    queueContainer: {
        height: 60,
        backgroundColor: '#222222',
        marginTop: 5,
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
        width: '95%'
    },

    explicitAuthor: {
        fontFamily: 'medium',
        fontSize: 15,
        color: '#cccccc',
        marginLeft: 5,
        width: '88%'
    },

    rightAction: {
        width: '100%',
        height: 60,
        backgroundColor: 'red',
        flexDirection: 'row',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 5,
    },

    actionText: {
        fontFamily: 'regular',
        fontSize: 20,
        color: 'white',
        marginRight: 10,
    },

    blankImage: {
        width: 60,
        height: 60,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    fillerText: {
        fontFamily: 'bold',
        fontSize: 30,
        color: 'white'
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

export default Song
import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable';

const height = (Dimensions.get('window').height)
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
            <Image
                style={styles.image}
                source={{ uri: props.imageUri }}
            />
            <View style={styles.column}>
                <Text style={styles.name} numberOfLines={2}>{props.name}</Text>
                <Text style={styles.author} numberOfLines={1}>{props.author}</Text>
            </View>
        </View>
    )

    if (props.isQueue && props.elevatedUser) {
        return (
            <Swipeable
                renderRightActions={RightAction}
                onSwipeableRightOpen={() => console.log('hi')}
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

    rightAction: {
        width: '100%',
        height: 60,
        backgroundColor: 'red',
        marginTop: 20,
        flexDirection: 'row',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    actionText: {
        fontFamily: 'regular',
        fontSize: 20,
        color: 'white',
        marginRight: 10,
    }
})

export default Song
import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black'
    },

    scrollingText: {
        color: 'white',
        fontFamily: 'bold',
        fontSize: 35,
        marginTop: 50,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    header: {
        color: 'white',
        fontSize: 25,
        fontFamily: 'bold',
        textAlign: 'left',
        width: '80%',
        marginTop: 25,
    },

    listContainer: {
        height: '50%',
    },

    div: {
        width: '80%',
        borderBottomColor: 'white',
        borderBottomWidth: 3,
    },

    player: {
        width: '80%',
        height: '20%',
        justifyContent: 'center',
    },

    playButton: {
        backgroundColor: 'black',
    },
})
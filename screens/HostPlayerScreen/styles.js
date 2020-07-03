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

    modalContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.62)'
    },

    modal: {
        marginLeft: 30,
        marginRight: 30,
        ...Platform.select({
            ios: {
                backgroundColor: '#303942',
                borderRadius: 10,
                minWidth: 300,
            },
            android: {
                backgroundColor: '#303942',
                elevation: 24,
                minWidth: 280,
                borderRadius: 5,
            },
        }),
    },

    modalBody: {
        ...Platform.select({
            ios: {
                padding: 10,
                paddingVertical: 30,
            },
            android: {
                padding: 24,
                paddingVertical: 40,
            },
        }),
        alignItems: 'center',
    },

    modalButton: {
        backgroundColor: '#434d57',
        width: 200,
        height: 50,
    },

    modalButtonText: {
        color: '#e8e8e8'
    }
})
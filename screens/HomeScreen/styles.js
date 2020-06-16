import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../constants/Colors'

const height = (Dimensions.get('window').height)
const width = (Dimensions.get('window').width)


export default StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
    },

    header: {
        color: 'white',
        fontSize: 25,
        fontFamily: 'bold',
        textAlign: 'left',
        width: '85%',
        marginTop: 30,
        marginBottom: 10,
    },

    searchContainer: {
        width: '100%',
        height: (height / 1.35),
        alignItems: 'center',
    },

    buttonsContainer: {
        width: '100%',
        height: (height / 3.85),
        alignItems: 'center',
        justifyContent: 'center',
    },

    createButton: {
        width: (width / 1.7),
    },

    logoutButton: {
        backgroundColor: 'black'
    },

    logoutText: {
        color: 'red'
    },

    createText: {
        fontSize: 20,
        fontFamily: 'regular'
    },

    searchBar: {
        width: '90%',
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        marginTop: (height / 23)
    },

    inputText: {
        fontFamily: 'medium',
    },

    caption: {
        fontFamily: 'medium',
        fontSize: 15,
        color: 'white',
        width: '85%',
        marginTop: 20,
    },

    roomButton: {
        backgroundColor: '#111111',
        width: width,
        borderRadius: 0,
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row'
    },

    roomText: {
        color: '#a8a8a8',
        marginLeft: width / 15.2,
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'regular'
    },

    roomOnline: {
        color: colors.primary,
        marginRight: width / 15.2,
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'medium'
    },

    roomOffline: {
        color: '#444444',
        marginRight: width / 15.2,
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'medium'
    },

    roomContainer: {
        marginVertical: 1,
    },

    refreshIndicator: {
        alignContent: 'center',
        justifyContent: 'flex-end',
        marginBottom: 40,
        flex: 1,
    },

    userTypeText: {
        color: '#666666',
        marginRight: 20,
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'medium'
    },

    rightRoomText: {
        flexDirection: 'row'
    },

    foundText: {
        color: '#a8a8a8',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'regular',
        marginTop: 10,
    },

    roomSearchButton: {
        backgroundColor: '#222222',
        width: width,
        borderRadius: 0,
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row'
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
            },
            android: {
                padding: 24,
            },
        }),
        alignItems: 'center'
    },

    modalTitle: {
        fontFamily: 'bold',
        fontSize: 20,
        marginTop: 10,
        textAlign: 'center',
        marginBottom: 5,
        color: '#a8a8a8'
    },

    modalButton: {
        backgroundColor: '#303942',
        width: 60,
        height: 35,
    },

    modalInput: {
        borderColor: '#a8a8a8'
    }
})
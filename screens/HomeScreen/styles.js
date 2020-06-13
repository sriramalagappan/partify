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
        marginLeft: width/15.2,
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'regular'
    },

    roomOnline: {
        color: colors.primary,
        marginRight: width/15.2,
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'medium'
    }, 

    roomOffline: {
        color: '#444444',
        marginRight: width/15.2,
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
    }
})
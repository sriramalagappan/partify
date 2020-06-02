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
        backgroundColor: 'black',
        marginTop: (height / 30)
    },

    inputText: {
        fontFamily: 'medium'
    },

    caption: {
        fontFamily: 'medium',
        fontSize: 15,
        color: 'white',
        width: '85%',
        marginTop: 20,
    }
})
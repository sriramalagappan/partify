import { StyleSheet, Dimensions } from 'react-native'

const height = (Dimensions.get('window').height)
const width = (Dimensions.get('window').width)

export default StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black'
    },

    searchContainer: {
        width: '100%',
        alignItems: 'center',
    },

    inputText: {
        fontFamily: 'medium'
    },

    searchBar: {
        width: '90%',
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        marginTop: (height / 30),
    },
    
    listContainer: {
        height: '85%',
        borderBottomWidth: 2,
        borderBottomColor: 'white'
    }
})
import { StyleSheet, Dimensions } from 'react-native'

const height = (Dimensions.get('window').height)
const width = (Dimensions.get('window').width)

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
        marginTop: 50,
    },

    header: {
        color: 'white',
        fontSize: 25,
        fontFamily: 'bold',
        textAlign: 'left',
        width: '80%',
        marginTop: 30,
    }
})
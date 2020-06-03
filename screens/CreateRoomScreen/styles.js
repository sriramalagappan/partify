import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../constants/Colors'

const height = (Dimensions.get('window').height)
const width = (Dimensions.get('window').width)

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
    },

    header: {
        color: 'white',
        fontSize: 25,
        fontFamily: 'bold',
        marginTop: (height / 25)
    },

    errorText: {
        color: 'red',
        fontSize: 15,
        fontFamily: 'medium',
        marginTop: 5,
    },

    errorContainer: {
        width: '80%',
        height: 30
    },

    button: {
        marginTop: 50,
        width: width / 2.25
    },

    buttonText: {
        fontSize: 17,
        fontFamily: 'regular'
    },

})
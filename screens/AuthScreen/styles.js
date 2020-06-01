import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../constants/Colors'

const height = (Dimensions.get('window').height)

export default StyleSheet.create({
    screen: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'black'
    },

    header: {
        marginTop: (height / 5),
        fontSize: 60,
        fontFamily: 'bold',
        color: colors.primary,
    },

    button: {
        width: 200,
    },

    buttonContainer: {
        marginTop: (height / 2.5),
    }
})

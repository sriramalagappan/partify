import { StyleSheet, Dimensions } from 'react-native'

import colors from '../../constants/Colors'

const height = (Dimensions.get('window').height)

export default StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    header: {
        color: 'white',
        marginTop: (height / 20),
        fontSize: 20,
        fontFamily: 'bold'
    }
})
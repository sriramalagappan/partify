import React from 'react'
import { View, StyleSheet } from 'react-native'
import AddButton from '../../components/AddButton'
import { Entypo } from '@expo/vector-icons'

const AdminPlayer = props => {

    return (
        <View style={styles.player}>
            <View style={styles.buttonContainer}>
                <AddButton
                    style={styles.playerButton}
                    onPress={props.addSongHandler}
                >
                    <Entypo name='plus' size={25} color={'white'} />
                </AddButton>
                <AddButton
                    style={styles.playerButton}
                    onPress={props.addSongHandler}
                >
                    <Entypo name='menu' size={25} color={'white'} />
                </AddButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    player: {
        width: '80%',
        height: '20%',
        justifyContent: 'center',
    },

    playerButton: {
        backgroundColor: 'black',
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
})

export default AdminPlayer
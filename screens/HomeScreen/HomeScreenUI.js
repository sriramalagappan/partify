import React from 'react'
import { View, Text, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native'
import styles from './styles'
import CustomButton from '../../components/CustomButton'
import { SearchBar } from 'react-native-elements'

const HomeScreenUI = props => (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <ScrollView style={{ backgroundColor: 'black' }} contentContainerStyle={styles.screen}>
            <View style={styles.searchContainer}>
                <SearchBar
                    placeholder={'Search for a room'}
                    onChangeText={props.searchInputHandler}
                    value={props.roomName}
                    containerStyle={styles.searchBar}
                    lightTheme={false}
                    round={true}
                    inputStyle={styles.inputText}
                />
                <Text style={styles.header}>Current Rooms</Text>
                <Text style={styles.caption}>You are currently not in any rooms. Join one or create your own!</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <CustomButton
                    title={'Create a Room'}
                    style={styles.createButton}
                    onPress={() => { }}
                    textStyle={styles.createText}
                />
                <CustomButton
                    title={'Logout'}
                    style={styles.logoutButton}
                    onPress={props.logoutHandler}
                    textStyle={styles.logoutText}
                />
            </View>
        </ScrollView>
    </TouchableWithoutFeedback>
)

export default HomeScreenUI



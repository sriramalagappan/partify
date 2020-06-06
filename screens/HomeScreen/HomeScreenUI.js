import React from 'react'
import { View, Text, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native'
import styles from './styles'
import CustomButton from '../../components/CustomButton'
import { SearchBar } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreenUI = props => (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <ScrollView style={{ backgroundColor: 'black' }} contentContainerStyle={styles.screen}>
            <LinearGradient
                colors={['rgba(100,100,100,0.8)', 'transparent']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 200,
                }}
            />
            <View style={styles.searchContainer}>
                <SearchBar
                    placeholder={'Search for a room...'}
                    onChangeText={props.searchInputHandler}
                    value={props.roomName}
                    containerStyle={styles.searchBar}
                    lightTheme={false}
                    round={true}
                    inputStyle={styles.inputText}
                    showLoading={props.isLoading}
                    onSubmitEditing={props.joinRoomHandler}
                />
                <Text style={styles.header}>Current Rooms</Text>
                {(props.userRooms == false) ?
                    (
                        <Text style={styles.caption}>You are currently not in any room. Join one or create your own!</Text>
                    ) :
                    (
                        props.userRooms.map((room) => (
                            <CustomButton
                                title={room}
                                style={styles.roomButton}
                                onPress={() => {props.rejoinRoomHandler(room)}}
                                textStyle={styles.roomText}
                                buttonContainerStyle={styles.roomContainer}
                                key={room}
                            />
                        ))
                    )
                }
            </View>
            <View style={styles.buttonsContainer}>
                <CustomButton
                    title={'Create a Room'}
                    style={styles.createButton}
                    onPress={props.createRoomHandler}
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



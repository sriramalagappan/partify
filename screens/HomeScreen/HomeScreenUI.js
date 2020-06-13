import React from 'react'
import { View, Text, Keyboard, TouchableWithoutFeedback, ScrollView, Platform, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import styles from './styles'
import CustomButton from '../../components/CustomButton'
import { SearchBar } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreenUI = props => (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <ScrollView
            style={{ backgroundColor: 'black' }}
            contentContainerStyle={styles.screen}
            refreshControl={
                <RefreshControl
                    refreshing={props.refreshing}
                    onRefresh={props.refreshHandler}
                />
            }
        >

            {/* Create a different top background color */}

            {Platform.OS === 'ios' && (
                <View
                    style={{
                        backgroundColor: 'rgba(100,100,100,0.8)',
                        height: 1000,
                        position: 'absolute',
                        top: -1000,
                        left: 0,
                        right: 0,
                    }}
                >
                    {(props.refreshing) ?
                        (
                            <View style={styles.refreshIndicator}>
                                <ActivityIndicator size='large' color='black' />
                            </View>
                        ) :
                        (
                            <View />
                        )
                    }
                </View>
            )}

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
                            <View style={styles.roomContainer} key={room.roomID}>
                                <TouchableOpacity onPress={() => { props.rejoinRoomHandler(room.roomID, room.userType, room.time) }}>
                                    <View style={styles.roomButton}>
                                        <Text style={styles.roomText}> {room.name} </Text>

                                        {/* See if room is online */}

                                        <Text style={((Date.now() - room.time) < 63000) ? styles.roomOnline : styles.roomOffline}>
                                            {((Date.now() - room.time) < 63000) ? 'Online' : 'Offline'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
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



import React from 'react'
import { View, Text, Keyboard, TouchableWithoutFeedback, ScrollView, Platform, TouchableOpacity, RefreshControl, ActivityIndicator, Modal, TextInput } from 'react-native'
import styles from './styles'
import CustomButton from '../../components/CustomButton'
import Input from '../../components/Input'
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
                    {(props.refreshing)  ?
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

            {/* Gradient */}

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

            {/* Modal */}

            <Modal
                visible={props.visible}
                transparent={true}
                onRequestClose={props.closeHandler}
                animationType={'fade'}
            >
                <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={props.closeHandler}>
                    <View style={styles.modal}>
                        <View style={styles.modalBody}>
                            <Text style={styles.modalTitle}>Enter the Room's Password</Text>
                            <Input 
                                value={props.password}
                                onChangeText={props.passwordHandler}
                                maxLength={30}
                                isPassword={true}
                                style={styles.modalInput}
                            />
                            <CustomButton 
                                style={styles.modalButton}
                                title={"Submit"}
                                textStyle={styles.modalButtonText}
                                onPress={props.submitPasswordHandler}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Screen */}

            <View style={styles.searchContainer}>
                <SearchBar
                    placeholder={'Search for a room...'}
                    onChangeText={props.searchInputHandler}
                    value={props.name}
                    containerStyle={styles.searchBar}
                    lightTheme={false}
                    round={true}
                    inputStyle={styles.inputText}
                    showLoading={props.isLoading}
                />
                {(props.name && !props.isLoading) ?
                    (!(props.matches == false)) ?
                        (
                            <View style={{ alignItems: 'center' }}>
                                {props.matches.map((room) => (
                                    <View style={styles.roomContainer} key={room.id}>
                                        <TouchableOpacity onPress={() => { props.joinRoomHandler(room.password, room.id) }}>
                                            <View style={styles.roomSearchButton}>
                                                <Text style={styles.roomText}> {room.name} </Text>
                                                <View style={styles.rightRoomText}>
                                                    <Text style={styles.userTypeText}>{room.hostUsername}</Text>

                                                    {/* See if room is online */}

                                                    <Text style={((Date.now() - room.time) < 63000) ? styles.roomOnline : styles.roomOffline}>
                                                        {((Date.now() - room.time) < 63000) ? 'Online' : 'Offline'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.foundText}>No rooms found</Text>
                        )
                    : (
                        <View />
                    )
                }
                <Text style={styles.header}>Your Rooms</Text>
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
                                        <View style={styles.rightRoomText}>
                                            <Text style={styles.userTypeText}>{room.userType.split(/\s+/).map(s => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()).join(" ")}</Text>

                                            {/* See if room is online */}

                                            <Text style={((Date.now() - room.time) < 63000) ? styles.roomOnline : styles.roomOffline}>
                                                {((Date.now() - room.time) < 63000) ? 'Online' : 'Offline'}
                                            </Text>
                                        </View>
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



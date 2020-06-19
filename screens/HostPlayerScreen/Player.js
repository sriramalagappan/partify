// AFTER DONE WITH EXPO BARE WORKFLOW, EJECT EXPO AND INSTALL React Native Background Timer
// TO ALLOW SONGS TO BE UPDATED IN THE BACKGROUND

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import AddButton from '../../components/AddButton'
import { Entypo } from '@expo/vector-icons'
import * as playerActions from '../../store/actions/player'
import * as songActions from '../../store/actions/songs'
import * as roomActions from '../../store/actions/room'
import * as hostActions from '../../store/actions/host'
import * as deviceActions from '../../store/actions/devices'
import useInterval from '../../misc/useInterval'
import { Alert } from 'react-native'

const Player = props => {

    // Redux Store State Variables
    const deviceID = useSelector(state => state.room.device.id)
    const playlistID = useSelector(state => state.room.playlistID)
    const roomID = useSelector(state => state.room.roomID)
    const index = useSelector(state => state.room.index)
    const playlistURI = useSelector(state => state.room.uri)
    const position_ms = useSelector(state => state.player.position_ms)

    // Timer states
    const [time, setTime] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [delay, setDelay] = useState(0)
    const [delayTime, setDelayTime] = useState(0)
    const [songEnd, setSongEnd] = useState(false)
    const [startedPlayback, setStartedPlayback] = useState(false)

    let interval;

    const dispatch = useDispatch()

    // timer functionality + play / pause Spotify playback functionality
    const toggleTimer = async () => {
        if (isActive) {
            await dispatch(playerActions.pausePlayback(deviceID))
            setDelayTime(Date.now())
            setIsActive(false)
            clearInterval(interval)
        } else {
            const response = await deviceActions.checkDevice(deviceID)
            if (!response) {
                Alert.alert('Device Not Active', 'The Spotify device is not active. To help us find your device, please open up your Spotify device and play any song in the background. Then come back to this app and try playing again. Sorry for the inconvenience.', [{ text: 'Okay' }])
            } else {
                if (startedPlayback) {
                    const newDelay = delay + (Date.now() - delayTime)
                    setDelay(newDelay)
                } else {
                    setTime(Date.now())
                    setDelay(0)
                    setStartedPlayback(true)
                }
                await dispatch(playerActions.startPlayback(deviceID, playlistURI, position_ms, index))
                setIsActive(true)
            }
        }
    }

    // create a new background timer with each new song that listens for the end of a song
    useEffect(() => {
        if (startedPlayback && isActive) {
            clearInterval(interval)
            interval = setInterval(() => {
                console.log('here')
                const length = (Date.now() - time - delay)
                if (time && (length > props.duration) && isActive) {
                    setSongEnd(true)
                    clearInterval(interval)
                }
            }, 500)
        }
    }, [startedPlayback, isActive, time])

    // Song Ending functionality that updates state and db
    useEffect(() => {
        // reset all the states, update index, refresh the playlist, and prepare for the new song
        const songEndHandler = async () => {
            setSongEnd(false)
            clearInterval(interval)
            const newIndex = index + 1
            await dispatch(roomActions.setIndex(newIndex, roomID))
            await hostActions.updateResponse(roomID)
            await dispatch(songActions.getPlaylistSongs(playlistID))
            // if a song is coming up, prepare for that by initializing the states
            if (props.next) {
                setTime(Date.now())
                setDelay(0)
            } else {
                setIsActive(false)
            }
        }
        if (songEnd) {
            songEndHandler()
        }
    }, [songEnd])

    // fast forward functionality
    const skipNext = async () => {
        // only allow if it is possible to go forward
        if (props.current) {
            // check device availability
            const response = await deviceActions.checkDevice(deviceID)
            if (!response) {
                Alert.alert('Device Not Active', 'The Spotify device is not active. To help us find your device, please open up your Spotify device and play any song in the background. Then come back to this app and try playing again. Sorry for the inconvenience.', [{ text: 'Okay' }])
            } else {
                clearInterval(interval)
                const newIndex = index + 1
                await dispatch(roomActions.setIndex(newIndex, roomID))
                await dispatch(playerActions.startPlayback(deviceID, playlistURI, position_ms, newIndex))
                await hostActions.updateResponse(roomID)
                await dispatch(songActions.getPlaylistSongs(playlistID))
                // determine if playback should continue or stop 
                if (props.next) {
                    setTime(Date.now())
                    setDelay(0)
                    setIsActive(true)
                } else {
                    startedPlayback(false)
                    setIsActive(false)
                }
            }
        }
    }

    // rewind functionality
    const skipBack = async () => {
        // check device availability
        const response = await deviceActions.checkDevice(deviceID)
        if (!response) {
            Alert.alert('Device Not Active', 'The Spotify device is not active. To help us find your device, please open up your Spotify device and play any song in the background. Then come back to this app and try playing again. Sorry for the inconvenience.', [{ text: 'Okay' }])
        } else {
            clearInterval(interval)
            // only allow if it is possible to go back, otherwise repeat first song
            if (index !== 0) {
                const newIndex = index - 1
                await dispatch(roomActions.setIndex(newIndex, roomID))
                await dispatch(playerActions.startPlayback(deviceID, playlistURI, position_ms, newIndex))
                await hostActions.updateResponse(roomID)
                await dispatch(songActions.getPlaylistSongs(playlistID))
                setTime(Date.now())
                setDelay(0)
                setIsActive(true)
            } else {
                await dispatch(playerActions.startPlayback(deviceID, playlistURI, position_ms, 0))
                setTime(Date.now())
                setDelay(0)
                setIsActive(true)
            }
        }
    }

    const placbackButton = (isActive) ? ('controller-paus') : ('controller-play')

    return (
        <View style={styles.player}>
            <View style={styles.buttonContainer}>
                <AddButton
                    style={styles.playButton}
                    onPress={props.addSongHandler}
                >
                    <Entypo name='plus' size={25} color={'white'} />
                </AddButton>
                <AddButton
                    style={styles.playButton}
                    onPress={skipBack}
                >
                    <Entypo name='controller-jump-to-start' size={35} color={'white'} />
                </AddButton>
                <AddButton
                    style={styles.playButton}
                    onPress={toggleTimer}
                >
                    <Entypo name={placbackButton} size={40} color={'white'} style={styles.playIcon} />
                </AddButton>
                <AddButton
                    style={styles.playButton}
                    onPress={skipNext}
                >
                    <Entypo name='controller-next' size={35} color={'white'} />
                </AddButton>
                <AddButton
                    style={styles.playButton}
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

    playButton: {
        backgroundColor: 'black',
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
})

export default Player
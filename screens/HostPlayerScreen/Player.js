// AFTER DONE WITH EXPO BARE WORKFLOW, EJECT EXPO AND INSTALL React Native Background Timer
// TO ALLOW SONGS TO BE UPDATED IN THE BACKGROUND

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet, AppState } from 'react-native'
import AddButton from '../../components/AddButton'
import { Entypo } from '@expo/vector-icons'
import * as playerActions from '../../store/actions/player'
import * as songActions from '../../store/actions/songs'
import * as roomActions from '../../store/actions/room'
import * as hostActions from '../../store/actions/host'
import * as deviceActions from '../../store/actions/devices'
import { Alert } from 'react-native'

const Player = props => {

    // Redux Store State Variables
    const deviceID = useSelector(state => state.room.device.id)
    const playlistID = useSelector(state => state.room.playlistID)
    const roomID = useSelector(state => state.room.roomID)
    const index = useSelector(state => state.room.index)
    const playlistURI = useSelector(state => state.room.uri)
    const position_ms = useSelector(state => state.player.position_ms)
    const syncData = useSelector(state => state.room.syncData)
    const is_playing = useSelector(state => state.room.is_playing)
    const position_ms_sync = useSelector(state => state.room.position_ms)
    const duration = useSelector(state => state.room.duration)

    // Stateful Variables
    const [isActive, setIsActive] = useState(false)
    const [timeoutID, setTimeoutID] = useState(null)
    const [time, setTime] = useState(Date.now())

    const dispatch = useDispatch()

    // sync functionality when data is recieved from Spotify
    useEffect(() => {
        const silentPB = async () => {
            await playerActions.silentPlayback(deviceID)

        }
        if (syncData) {
            dispatch(roomActions.resetSync())
            setIsActive(is_playing)
            dispatch(playerActions.syncProgress(position_ms_sync))
            clearAllTimeout(timeoutID)
            if (is_playing) {
                const songTimeout = setTimeout(() => { songEndHandler(index, songTimeout) }, (duration - position_ms_sync))
                setTimeoutID(songTimeout)
            } else {
                silentPB()
            }
        }
    }, [syncData, timeoutID, is_playing, position_ms_sync, duration, index])

    // App state listener
    useEffect(() => {
        AppState.addEventListener('change', deviceState)

        return () => {
            AppState.removeEventListener('change', deviceState)
        }
    })

    /**
    * Delete timeout when user leaves app
    * @param {*} nextState the current state of the app (active or background)
    */
    const deviceState = (async (nextState) => {
        if (nextState === 'background') {
            clearAllTimeout(timeoutID)
        }
    })

    // timer functionality + play / pause Spotify playback functionality
    const toggleTimer = async () => {
        if (isActive) {
            await dispatch(playerActions.pausePlayback(deviceID))
            clearAllTimeout(timeoutID)
            setIsActive(false)
        } else {
            const response = await deviceActions.checkDevice(deviceID)
            if (!response) {
                Alert.alert('Device Not Active', 'The Spotify device is not active. To help us find your device, please open up your Spotify device and play any song in the background. Then come back to this app and try playing again. Sorry for the inconvenience.', [{ text: 'Okay' }])
            } else if (!props.current) {
                Alert.alert('No Song to Play', 'Please add a song before attempting to play by clicking the plus button below and selecting a song.', [{ text: 'Okay' }])
            } else {
                await dispatch(playerActions.startPlayback(deviceID, playlistURI, position_ms, index))
                const songTimeout = setTimeout(() => { songEndHandler(index, songTimeout) }, (props.duration - position_ms))
                setTimeoutID(songTimeout)
                setIsActive(true)
            }
        }
    }

    // reset all the states, update index, refresh the playlist, and prepare for the new song
    const songEndHandler = async (currentIndex, timeout) => {
        const newIndex = currentIndex + 1
        clearAllTimeout(timeout)
        // if a song is coming up, prepare for that song by starting next timeout
        const nextSong = await songActions.getNextSong(playlistID, newIndex)
        if (nextSong) {
            const songTimeout = setTimeout(() => { songEndHandler(newIndex, songTimeout) }, (nextSong.track.duration_ms))
            setTimeoutID(songTimeout)
        } else {
            await dispatch(playerActions.pausePlayback(deviceID))
            setIsActive(false)
        }
        // use sync funtion to reset position_ms back to 0
        dispatch(playerActions.syncProgress(0))
        await dispatch(roomActions.setIndex(newIndex, roomID))
        await hostActions.updateResponse(roomID)
        await dispatch(songActions.getPlaylistSongs(playlistID))
    }

    // fast forward functionality
    const skipNext = async () => {
        // only allow if it is possible to go forward
        if (props.current) {
            // check device availability
            const response = await deviceActions.checkDevice(deviceID)
            if (!response) {
                Alert.alert('Device Not Active', 'The Spotify device is not active. To help us find your device, please open up your Spotify device and play any song in the background. Then come back to this app and try playing again. Sorry for the inconvenience.', [{ text: 'Okay' }])
            } else {
                const newIndex = index + 1
                await dispatch(roomActions.setIndex(newIndex, roomID))
                await dispatch(playerActions.startPlayback(deviceID, playlistURI, 0, newIndex))
                await hostActions.updateResponse(roomID)
                await dispatch(songActions.getPlaylistSongs(playlistID))
                clearAllTimeout(timeoutID)
                if (props.next) {
                    setIsActive(true)
                    const songTimeout = setTimeout(() => { songEndHandler(newIndex, songTimeout) }, (props.nextDuration))
                    setTimeoutID(songTimeout)
                } else {
                    setIsActive(false)
                    await playerActions.silentPlayback(deviceID)
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
            // only allow if it is possible to go back, otherwise puase at first song
            clearAllTimeout(timeoutID)
            if (index !== 0) {
                const currentTime = Date.now()
                // determine whether to repeat song or to go back to previous song
                const newIndex = index - 1
                if (((currentTime - time) < 3000) || (!props.current)) {
                    await dispatch(roomActions.setIndex(newIndex, roomID))
                    await dispatch(playerActions.startPlayback(deviceID, playlistURI, 0, newIndex))
                    await hostActions.updateResponse(roomID)
                    await dispatch(songActions.getPlaylistSongs(playlistID))
                    setIsActive(true)
    
                    const songTimeout = setTimeout(() => { songEndHandler(newIndex, songTimeout) }, (props.prevDuration))
                    setTimeoutID(songTimeout)
                } else {
                    await dispatch(playerActions.startPlayback(deviceID, playlistURI, 0, index))
                    const songTimeout = setTimeout(() => { songEndHandler(newIndex, songTimeout) }, (props.duration))
                    setTimeoutID(songTimeout)
                }
                // update time
                setTime(currentTime)
            } else {
                await dispatch(playerActions.startPlayback(deviceID, playlistURI, 0, 0))
                await dispatch(playerActions.pausePlayback(deviceID))
                setIsActive(false)
            }
        }
    }

    const clearAllTimeout = (timeout) => {
        for (var i = timeout; i > 0; i--) {
            clearTimeout(i)
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
                    onPress={props.displayModal}
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
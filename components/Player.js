// AFTER DONE WITH EXPO BARE WORKFLOW, EJECT EXPO AND INSTALL React Native Background Timer
// TO ALLOW SONGS TO BE UPDATED IN THE BACKGROUND

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import AddButton from './AddButton'
import { Entypo } from '@expo/vector-icons'
import * as playerActions from '../store/actions/player'
import * as songActions from '../store/actions/songs'
import * as roomActions from '../store/actions/room'

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
    const [playerInterval, setPlayerInterval] = useState(null)
    const [songEnd, setSongEnd] = useState(false)
    const [startedPlayback, setStartedPlayback] = useState(false)

    const dispatch = useDispatch()

    // timer functionality + play / pause Spotify playback functionality
    const toggleTimer = async () => {
        if (isActive) {
            await dispatch(playerActions.pausePlayback(deviceID))
            setDelayTime(Date.now())
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
        }
        setIsActive(!isActive)
    }

    // create a new background timer with each new song that listens for the end of a song
    useEffect(() => {
        if (startedPlayback && !playerInterval) {
            setPlayerInterval(setInterval(() => {
                const length = (Date.now() - time - delay)
                if (time && (length > props.duration)) {
                    setSongEnd(true)
                }
            }, 500))
        }
    }, [startedPlayback, time])

    // Song Ending functionality that updates state and db
    useEffect(() => {
        const songEndHandler = async () => {
            const newIndex = index + 1
            await dispatch(roomActions.setIndex(newIndex, roomID))
            await dispatch(songActions.getPlaylistSongs(playlistID))
            // if a song is coming up, prepare for that by initializing the states
            if (props.next) {
                setTime(Date.now())
                setDelay(0)
                setIsActive(true)
            }
        }
        if (songEnd) {
            // reset all the states, update index, refresh the playlist, and prepare for the new song
            setIsActive(false)
            clearInterval(playerInterval)
            setPlayerInterval(null)
            setSongEnd(false)
            songEndHandler()
        }
    }, [songEnd])

    // fast forward functionality
    const skipNext = async () => {
        // only allow if it is possible to go forward
        if (props.current) {
            const newIndex = index + 1
            await dispatch(roomActions.setIndex(newIndex, roomID))
            await dispatch(playerActions.startPlayback(deviceID, playlistURI, position_ms, newIndex))
            await dispatch(songActions.getPlaylistSongs(playlistID))
            clearInterval(playerInterval)
            setPlayerInterval(null)
            // determine if playback should continue or stop 
            if (props.next) {
                setTime(Date.now())
                setDelay(0)
            } else {
                startedPlayback(false)
                setIsActive(false)
            }
        }
    }

    // rewind functionality
    const skipBack = async () => {
        // only allow if it is possible to go back, otherwise repeat first song
        if (index !== 0) {
            const newIndex = index - 1
            await dispatch(roomActions.setIndex(newIndex, roomID))
            await dispatch(playerActions.startPlayback(deviceID, playlistURI, position_ms, newIndex))
            await dispatch(songActions.getPlaylistSongs(playlistID))
            clearInterval(playerInterval)
            setPlayerInterval(null)
            setTime(Date.now())
            setDelay(0)
        } else {
            await dispatch(playerActions.startPlayback(deviceID, playlistURI, position_ms, 0))
            clearInterval(playerInterval)
            setPlayerInterval(null)
            setTime(Date.now())
            setDelay(0)
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
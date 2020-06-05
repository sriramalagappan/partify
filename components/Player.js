import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import AddButton from './AddButton'
import { Entypo } from '@expo/vector-icons'
import * as playerActions from '../store/actions/player'
import * as songActions from '../store/actions/songs'

const Player = props => {

    // Redux Store State Variables
    const deviceID = useSelector(state => state.room.device.id)
    const playlistID = useSelector(state => state.room.playlistID)

    // Timer functionality
    const [time, setTime] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [delay, setDelay] = useState(0)
    const [delayTime, setDelayTime] = useState(0)
    const [playerInterval, setPlayerInterval] = useState(null)
    const [songEnd, setSongEnd] = useState(false)
    const [startedPlayback, setStartedPlayback] = useState(false)
    const [toggle, setToggle] = useState(false)

    const dispatch = useDispatch()

    const toggleTimer = async () => {
        if (props.currentURI) {
            if (isActive) {
                await playerActions.pausePlayback(deviceID)
                setDelayTime(Date.now())
            } else {
                if (startedPlayback) {
                    const newDelay = delay + (Date.now() - delayTime)
                    const positionTime = Date.now() - time - newDelay
                    await playerActions.startPlayback(deviceID, props.currentURI, positionTime)
                    setDelay(newDelay)
                } else {
                    await playerActions.startPlayback(deviceID, props.currentURI, 0)
                    setTime(Date.now())
                    setDelay(0)
                    setStartedPlayback(true)
                }
            }
        }
        setIsActive(!isActive)
    }

    useEffect(() => {
        if (startedPlayback && !playerInterval) {
            setPlayerInterval(setInterval(() => {
                const length = (Date.now() - time - delay)
                if (time && (length > props.duration)) {
                    setSongEnd(true)
                }
            }, 1000))
        }
    },[startedPlayback, toggle])

    useEffect(() => {
        const songEndHandler = async () => {
            await dispatch(songActions.deleteSong(props.currentURI, playlistID, props.index))
            await dispatch(songActions.getPlaylistSongs(playlistID))
            if (props.nextURI) {
                await playerActions.startPlayback(deviceID, props.nextURI, 0)
                setTime(Date.now())
                setDelay(0)
                setIsActive(true)
                setToggle(!toggle)
            }
        }
        if (songEnd) {
            // reset all the states, delete the song, refresh the playlist, and start playing the new song
            setIsActive(false)
            clearInterval(playerInterval)
            setPlayerInterval(null)
            setSongEnd(false)
            songEndHandler()
        }
    }, [songEnd])

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
                    onPress={props.addSongHandler}
                >
                    <Entypo name='controller-fast-backward' size={35} color={'white'} />
                </AddButton>
                <AddButton
                    style={styles.playButton}
                    onPress={toggleTimer}
                >
                    <Entypo name={placbackButton} size={40} color={'white'} style={styles.playIcon} />
                </AddButton>
                <AddButton
                    style={styles.playButton}
                    onPress={props.addSongHandler}
                >
                    <Entypo name='controller-fast-forward' size={35} color={'white'} />
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
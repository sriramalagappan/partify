import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HostPlayerScreenUI from './HostPlayerScreenUI'
import * as songActions from '../../store/actions/songs'
import * as deviceActions from '../../store/actions/devices'
import * as roomActions from '../../store/actions/room'
import * as listener from '../../misc/listener'
import * as hostActions from '../../store/actions/host'
import artistBuilder from '../../misc/artistBuilder'
import { Alert, AppState } from 'react-native'

const HostPlayerScreen = props => {

    // Stateful Variables
    const [message, setMessage] = useState('You have no songs. To get started, add a song by clicking the plus button below')
    const [queueTracks, setQueueTracks] = useState(null)
    const [currentTrack, setCurrentTrack] = useState(null)
    const [nextTrack, setNextTrack] = useState(null)
    const [visible, setVisible] = useState(false)
    const [prevDuration, setPrevDuration] = useState(null)

    // Redux Store State Variables
    const playlistID = useSelector(state => state.room.playlistID)
    const tracksData = useSelector(state => state.songs.tracks)
    const userType = useSelector(state => state.room.userType)
    const deviceID = useSelector(state => state.room.device.id)
    const index = useSelector(state => state.room.index)
    const roomID = useSelector(state => state.room.roomID)
    const playlistURI = useSelector(state => state.room.uri)

    let initialized = false;

    const dispatch = useDispatch()

    // componentDidMount 
    useEffect(() => {
        /**
         * Check if the device is availbale, otherwise throw error/alert and route back to home page
         */
        const checkDevice = async () => {
            if (userType === 'host') {
                const response = await deviceActions.checkDevice(deviceID)
                if (!response) {
                    Alert.alert('Could Not Find Device', 'The Spotify device you selected could not be found. Please make sure Spotify is running on that device and try joining the room again', [{ text: 'Okay', onPress: () => { props.navigation.pop() } }])
                } else {
                    // send inital room time
                    hostActions.updateRoomTime(roomID)

                    // start listener
                    listener.startListener(roomID, async (data) => { await processMessage(data) })

                    // get playlist songs
                    await dispatch(songActions.getPlaylistSongs(playlistID))
                }
            }
        }
        checkDevice()

        // componentWillUnmount
        return () => {
            // reset room data to default values
            dispatch(roomActions.resetRoom())
            // stop listener when leaving the room
            listener.stopListener(roomID)
        }
    }, [])

    // update/filter track data
    useEffect(() => {
        if (tracksData) {
            // store duration of song before index (for rewind functionality)
            if (index > 0) {
                if (tracksData[(index - 1)]) {
                    setPrevDuration(tracksData[(index - 1)].track.duration_ms)
                }
            }
            // modify tracks by filtering out the previous songs
            let i;
            for (i = 0; i < index; i++) {
                tracksData.shift()
            }
            // check if there are remaining tracks
            if (tracksData[0]) {
                // assign current track to the first track
                const tempTrack = tracksData.shift()
                setCurrentTrack(tempTrack)
                // assign queueTracks to the remaining tracks
                setQueueTracks(tracksData)
                if (tracksData[0]) {
                    setNextTrack(tracksData[0])
                    setMessage(`Currently Playing: ${tempTrack.track.name} - ${artistBuilder(tempTrack.track.artists)}     Up Next: ${tracksData[0].track.name} - ${artistBuilder(tracksData[0].track.artists)}`)
                } else {
                    setNextTrack(null)
                    setMessage(`Currently Playing: ${tempTrack.track.name} - ${artistBuilder(tempTrack.track.artists)}`)
                }
            } else {
                // set states back to default values if there is not a song to play
                setCurrentTrack(null)
                setQueueTracks(null)
                setMessage('You have no songs. To get started, add a song by clicking the plus button below')
            }
        }
    }, [tracksData])

    useEffect(() => {
        // sync this device with Spotify every 30 seconds
        const syncInterval = setInterval(async () => {
            await dispatch(roomActions.getCurrentPlayback(currentTrack, tracksData, deviceID, playlistURI, index, roomID))
            await dispatch(songActions.getPlaylistSongs(playlistID))
            await hostActions.updateResponse(roomID)
            await hostActions.updateRoomTime(roomID)
        }, 30000)

        return () => {
            clearInterval(syncInterval)
        }
    }, [currentTrack, tracksData, deviceID, playlistURI, index, roomID])

    // App state listener
    useEffect(() => {
        AppState.addEventListener('change', deviceState)

        return () => {
            AppState.removeEventListener('change', deviceState)
        }
    })

    /**
     * Sync playback information when user returns to app from background
     * @param {*} nextState the current state of the app (active or background)
     */
    const deviceState = (async (nextState) => {
        if (nextState === 'active') {
            await dispatch(roomActions.getCurrentPlayback(currentTrack, tracksData, deviceID, playlistURI, index, roomID))
            await dispatch(songActions.getPlaylistSongs(playlistID))
            await hostActions.updateResponse(roomID)
        }
    })

    /**
     * Route to add song screen if button pressed
     */
    const addSongHandler = () => {
        props.navigation.navigate({ routeName: 'Add' })
    }

    /**
     * Delete the given song from the queue
     * @param {*} songID Spotify ID of the song to delete
     * @param {*} position Position of the song to delete in the playlist
     */
    const deleteSongHandler = async (songID, position) => {
        await dispatch(songActions.deleteSong(songID, playlistID, (position + index)))
        await hostActions.updateResponse(roomID)
        await dispatch(songActions.getPlaylistSongs(playlistID))
        return;
    }

    /**
     * Procecss and respond to messages sent via Firebase 
     * @param {*} data Content of message recieved from firebase
     */
    const processMessage = async (data) => {
        if (data && data.val()) {
            const to = data.val().to
            const from = data.val().from
            const type = data.val().type
            const body = data.val().body

            if (to === 'HOST') {
                if (type === 'ADD_SONG') {
                    // delete message from database once read if request was to host
                    await hostActions.clearMessage(roomID)
                    const { songID } = body
                    // add the song to the playlist
                    const formattedID = songID.replace(/:/g, '%3A')
                    const errResponse = await songActions.addSong(formattedID, playlistID)
                    // if addition was successful, send a message back indicating that is was successful
                    if (!errResponse) {
                        await dispatch(songActions.getPlaylistSongs(playlistID))
                        await hostActions.updateResponseFromCustomer(roomID, from)
                    } else {
                        await hostActions.failureResponse(from, 'COULD NOT ADD SONG', roomID)
                    }
                } else if (type === 'DELETE_SONG') {
                    const { songID, position, playlistID } = body
                    // delete the song from the playlist
                    await dispatch(songActions.deleteSong(songID, playlistID, position))
                    await dispatch(songActions.getPlaylistSongs(playlistID))
                    await hostActions.updateResponse(roomID)
                }
            }
        }
    }

    /**
     * Display modal when menu button is pressed
     */
    const displayModal = () => {
        setVisible(true)
    }

    /**
     * Close modal
     */
    const closeModal = () => {
        setVisible(false)
    }

    /**
     * Route user back to home scree
     */
    const routeHome = () => {
        setVisible(false)
        props.navigation.pop()
    }

    return (
        <HostPlayerScreenUI
            addSongHandler={addSongHandler}
            currentTrack={currentTrack}
            nextTrack={nextTrack}
            queueTracks={queueTracks}
            deleteSongHandler={deleteSongHandler}
            message={message}
            visible={visible}
            displayModal={displayModal}
            closeModal={closeModal}
            routeHome={routeHome}
            prevDuration={prevDuration}
        />
    )
}

export default HostPlayerScreen
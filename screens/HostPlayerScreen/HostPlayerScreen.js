import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HostPlayerScreenUI from './HostPlayerScreenUI'
import * as songActions from '../../store/actions/songs'
import * as deviceActions from '../../store/actions/devices'
import * as roomActions from '../../store/actions/room'
import * as listener from '../../misc/listener'
import * as hostActions from '../../store/actions/host'
import artistBuilder from '../../misc/artistBuilder'
import { Alert } from 'react-native'

const HostPlayerScreen = props => {

    // Stateful Variables
    const [message, setMessage] = useState('You have no songs. To get started, add a song by clicking the plus button below')
    const [queueTracks, setQueueTracks] = useState(null)
    const [currentTrack, setCurrentTrack] = useState(null)
    const [nextTrack, setNextTrack] = useState(null)
    const [length, setLength] = useState(null)

    // Redux Store State Variables
    const playlistID = useSelector(state => state.room.playlistID)
    const tracksData = useSelector(state => state.songs.tracks)
    const userType = useSelector(state => state.room.userType)
    const deviceID = useSelector(state => state.room.device.id)
    const index = useSelector(state => state.room.index)
    const roomID = useSelector(state => state.room.roomID)

    // create copy of tracksData for deleteHandler
    const tracksCopy = tracksData

    const dispatch = useDispatch()

    // componentDidMount 
    useEffect(() => {
        // check if the device is availbale, otherwise throw error and route back to home page
        const checkDevice = async () => {
            if (userType === 'host') {
                const response = await deviceActions.checkDevice(deviceID)
                if (!response) {
                    Alert.alert('Could Not Find Device', 'The Spotify device you selected could not be found. Please make sure Spotify is running on that device and try joining the room again', [{ text: 'Okay', onPress: () => { props.navigation.pop() } }])
                }
            }
        }
        checkDevice()
        dispatch(songActions.getPlaylistSongs(playlistID))

        return () => {
            dispatch(roomActions.resetRoom())
            listener.stopListener(roomID)
        }
    }, [])

    // update/filter track data
    useEffect(() => {
        if (tracksData) {
            // modify tracks by filtering out the previous songs
            setLength(tracksData.length)
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
    }, [tracksData, index])

    // start listener to firebase
    useEffect(() => {
        if (roomID) {
            listener.startListener(roomID, (data) => { processMessage(data) })
        }
    }, [roomID])

    // route to add song screen if button pressed
    const addSongHandler = () => {
        props.navigation.navigate({ routeName: 'Add', params: { position: length } })
    }

    // delete the given song from the queue
    const deleteSongHandler = async (songID) => {
        if (tracksCopy) {
            // find song index
            let i;
            for (i = 0; i < tracksCopy.length; i++) {
                if (tracksCopy[i].track.uri === songID) {
                    // once found, delete, update, and terminate
                    await dispatch(songActions.deleteSong(songID, playlistID, (i + index + 1)))
                    await hostActions.updateResponse(roomID)
                    dispatch(songActions.getPlaylistSongs(playlistID))
                    return;
                }
            }
        }
    }

    // if a message is sent to the host, procecss it depending on the type
    const processMessage = async (data) => {
        if (data && data.val()) {
            const to = data.val().to
            const from = data.val().from
            const type = data.val().type
            const body = data.val().body
            const { songID, position } = body
            if (to === 'host') {
                if (type === 'ADD_SONG') {
                    // add the song to the playlist
                    const formattedID = songID.replace(/:/g, '%3A')
                    const errResponse = await songActions.addSong(formattedID, playlistID, position)
                    // if addition was successful, send a message back indicating that is was successful
                    if (!errResponse) {
                        dispatch(songActions.getPlaylistSongs(playlistID))
                        await hostActions.successResponse(from, roomID)
                    } else {
                        await hostActions.failureResponse(from, 'COULD NOT ADD SONG', roomID)
                    }
                }
            }
        }
    }

    return (
        <HostPlayerScreenUI
            addSongHandler={addSongHandler}
            currentTrack={currentTrack}
            nextTrack={nextTrack}
            queueTracks={queueTracks}
            deleteSongHandler={deleteSongHandler}
            message={message}
        />
    )
}

export default HostPlayerScreen
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HostPlayerScreenUI from './HostPlayerScreenUI'
import * as songActions from '../../store/actions/songs'
import * as deviceActions from '../../store/actions/devices'
import * as roomActions from '../../store/actions/room'
import artistBuilder from '../../misc/artistBuilder'
import { Alert } from 'react-native'

const HostPlayerScreen = props => {

    // Stateful Variables
    const [message, setMessage] = useState('You have no songs. To get started, add a song by clicking the plus button below')
    const [queueTracks, setQueueTracks] = useState(null)
    const [currentTrack, setCurrentTrack] = useState(null)
    const [nextTrack, setNextTrack] = useState(null)

    // Redux Store State Variables
    const playlistID = useSelector(state => state.room.playlistID)
    const tracksData = useSelector(state => state.songs.tracks)
    const userType = useSelector(state => state.room.userType)
    const deviceID = useSelector(state => state.room.device.id)
    const index = useSelector(state => state.room.index)

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
        }
    }, [])

    // update/filter track data
    useEffect(() => {
        if (tracksData) {
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
                    dispatch(songActions.getPlaylistSongs(playlistID))
                    return;
                }
            }
        }
    }

    // determine if the user has elevated status (host/admin)


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
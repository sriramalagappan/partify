import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminPlayerScreenUI from './AdminPlayerScreenUI'
import * as songActions from '../../store/actions/songs'
import * as roomActions from '../../store/actions/room'
import * as adminActions from '../../store/actions/admin'
import artistBuilder from '../../misc/artistBuilder'
import * as listener from '../../misc/listener'
import { Alert } from 'react-native'

const AdminPlayerScreen = props => {

    // Stateful Variables
    const [message, setMessage] = useState('You have no songs. To get started, add a song by clicking the plus button below')
    const [queueTracks, setQueueTracks] = useState(null)
    const [currentTrack, setCurrentTrack] = useState(null)
    const [length, setLength] = useState(null)

    // Redux Store State Variables
    const playlistID = useSelector(state => state.room.playlistID)
    const tracksData = useSelector(state => state.songs.tracks)
    const index = useSelector(state => state.room.index)
    const roomID = useSelector(state => state.room.roomID)
    const userID = useSelector(state => state.user.userID)

    const tracksCopy = tracksData

    const dispatch = useDispatch()

    // componentDidMount 
    useEffect(() => {
        // get playlist songs
        dispatch(songActions.getPlaylistSongs(playlistID))

        return () => {
            listener.stopListener(roomID)
            dispatch(roomActions.resetRoom())
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
                    setMessage(`Currently Playing: ${tempTrack.track.name} - ${artistBuilder(tempTrack.track.artists)}     Up Next: ${tracksData[0].track.name} - ${artistBuilder(tracksData[0].track.artists)}`)
                } else {
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
            listener.startListener(roomID, (data) => { responseHandler(data) })
        }
    }, [roomID])

    // wait for response and handle it
    const responseHandler = (data) => {
        if (data && data.val()) {
            const to = data.val().to
            const from = data.val.from
            const type = data.val().type
            const body = data.val().body
            if (to === userID) {
                if (type === 'SUCCESS') {
                    dispatch(songActions.getPlaylistSongs(playlistID))
                    adminActions.updateResponse(roomID, userID)
                    Alert.alert('Song Added', 'Your song was added to the queue!', [{ text: 'Okay', onPress: () => { props.navigation.pop() } }])
                } else if (type === 'ERROR' && body === 'COULD NOT ADD SONG') {
                    Alert.alert('Error Adding Song', 'We were unable to add your selected song to the queue. Please try again', [{ text: 'Okay' }])
                }
                // clear message after read
                adminActions.clearMessage(roomID)
            } else if (to === 'EVERYONE') {
                if (type === 'UPDATE' && from !== userID) {
                    dispatch(songActions.getPlaylistSongs(playlistID))
                    dispatch(roomActions.getIndex(roomID))
                    // clear body so that the next update request will be heard from the listener
                    adminActions.clearBody(roomID)
                }
            }
        }
    }

    // route to add song screen if button pressed
    const addSongHandler = () => {
        props.navigation.navigate({ routeName: 'Add', params: { position: length } })
    }

    // delete the given song from the queue
    const deleteSongHandler = async (songID, position) => {
        //send delete request to host and stop looping
        dispatch(adminActions.sendDeleteRequest(songID, playlistID, (position + index), userID, roomID))
    }

    return (
        <AdminPlayerScreenUI
            addSongHandler={addSongHandler}
            currentTrack={currentTrack}
            queueTracks={queueTracks}
            deleteSongHandler={deleteSongHandler}
            message={message}
        />
    )
}

export default AdminPlayerScreen
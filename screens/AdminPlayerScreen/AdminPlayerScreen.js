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
    const [visible, setVisible] = useState(null)
    const [timeoutID, setTimeoutID] = useState(null)

    // Redux Store State Variables
    const playlistID = useSelector(state => state.room.playlistID)
    const tracksData = useSelector(state => state.songs.tracks)
    const index = useSelector(state => state.room.index)
    const roomID = useSelector(state => state.room.roomID)
    const userID = useSelector(state => state.user.userID)
    const sentRequest = useSelector(state => state.admin.sentRequest)

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
    }, [tracksData])

    // start listener to firebase
    useEffect(() => {
        if (roomID) {
            listener.startListener(roomID, (data) => { responseHandler(data) })
        }
    }, [roomID])


    // If a request is sent, set a timeout for 3 seconds. If a response is not heard in that
    // time frame, cancel request and let user know
    useEffect(() => {
        if (sentRequest) {
            const messageTimeout = setTimeout(async () => {
                // check sent request again when script runs in 3 seconds
                const check = await adminActions.checkRequest(roomID, userID)
                if (!check) {
                    Alert.alert('Error', 'We were unable to process your request. Please try again', [{ text: 'Okay' }])
                    dispatch(adminActions.clearMessage(roomID))
                }
            }, 3000)
            setTimeoutID(messageTimeout)
        }
    }, [sentRequest])

    /**
     * Function that takes new messages from Firebase and determines what action to take based on that message
     * @param {*} data contents of the message
     */
    const responseHandler = (data) => {
        if (data && data.val()) {
            const to = data.val().to
            const from = data.val().from
            const type = data.val().type
            const body = data.val().body
            if (to === userID) {
                clearAllTimeout(timeoutID)
                if (type === 'SUCCESS') {
                    dispatch(songActions.getPlaylistSongs(playlistID))
                    Alert.alert('Song Added', 'Your song was added to the queue!', [{ text: 'Okay' }])
                } else if (type === 'ERROR' && body === 'COULD NOT ADD SONG') {
                    Alert.alert('Error Adding Song', 'We were unable to add your selected song to the queue. Please try again', [{ text: 'Okay' }])
                }
                // clear message 
                dispatch(adminActions.clearMessage(roomID))
            } else if (to === 'EVERYONE') {
                if (type === 'UPDATE' && from !== userID) {
                    dispatch(songActions.getPlaylistSongs(playlistID))
                    dispatch(roomActions.getIndex(roomID))
                    // clear body so that the next update request will be heard from the listener
                    // only if update request was a default update request sent from host
                    if (body === 'sent') {
                        adminActions.clearBody(roomID)
                    } else if (body === userID) {
                        adminActions.clearBody(roomID)
                        Alert.alert('Song Added', 'Your song was added to the queue!', [{ text: 'Okay' }])
                    }
                }
            }
        }
    }

    /**
     * route to add song screen if button pressed
     */
    const addSongHandler = () => {
        props.navigation.navigate({ routeName: 'Add', params: { position: length } })
    }

    /**
     * delete the given song from the queue
     * @param {*} songID Spotify song ID
     * @param {*} position position in the Spotify playlist
     */
    const deleteSongHandler = async (songID, position) => {
        //send delete request to host and stop looping
        dispatch(adminActions.sendDeleteRequest(songID, playlistID, (position + index), userID, roomID))
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

    const clearAllTimeout = (timeout) => {
        for (var i = timeout; i > 0; i--) {
            clearTimeout(i)
        }
    }

    return (
        <AdminPlayerScreenUI
            addSongHandler={addSongHandler}
            currentTrack={currentTrack}
            queueTracks={queueTracks}
            deleteSongHandler={deleteSongHandler}
            message={message}
            displayModal={displayModal}
            closeModal={closeModal}
            routeHome={routeHome}
            visible={visible}
        />
    )
}

export default AdminPlayerScreen
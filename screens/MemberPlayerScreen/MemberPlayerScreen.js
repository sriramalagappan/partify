import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MemberPlayerScreenUI from './AdminPlayerScreenUI'
import * as songActions from '../../store/actions/songs'
import * as roomActions from '../../store/actions/room'
import * as adminActions from '../../store/actions/admin'
import artistBuilder from '../../misc/artistBuilder'
import * as listener from '../../misc/listener'
import { Alert } from 'react-native'

const MemberPlayerScreen = props => {

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
            const timer = setTimeout(async () => {
                // check sent request again when script runs in 3 seconds
                const check = await adminActions.checkRequest(roomID, userID)
                console.log("Check: " + check)
                if (!check) {
                    Alert.alert('Error', 'We were unable to process your request. Please try again', [{ text: 'Okay' }])
                    dispatch(adminActions.clearMessage(roomID))
                }
            }, 3000)
        }
    }, [sentRequest])

    /**
     * Function that takes new messages from Firebase and determines what action to take based on that message
     * @param {*} data contents of the message
     */
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
                // clear message 
                dispatch(adminActions.clearMessage(roomID))
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

    return (
        <MemberPlayerScreenUI
            addSongHandler={addSongHandler}
            currentTrack={currentTrack}
            queueTracks={queueTracks}
            deleteSongHandler={deleteSongHandler}
            message={message}
        />
    )
}

export default MemberPlayerScreen
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddSongScreenUI from './AddSongScreenUI'
import * as songActions from '../../store/actions/songs'
import * as adminActions from '../../store/actions/admin'
import * as hostActions from '../../store/actions/host'
import { Alert } from 'react-native'

const AddSongScreen = props => {

    // Stateful Variables
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [timer, setTimer] = useState(null)

    // Redux Store State Variables
    const searchResults = useSelector(state => state.songs.searchResults)
    const recentTracks = useSelector(state => state.songs.recentTracks)
    const playlistID = useSelector(state => state.room.playlistID)
    const userType = useSelector(state => state.room.userType)
    const roomID = useSelector(state => state.room.roomID)
    const userID = useSelector(state => state.user.userID)
    
    const dispatch = useDispatch()

    // componentDidMount
    useEffect(() => {
        dispatch(songActions.getRecentSongs())
    }, [])

    /**
     * toggle dispatch for finding song from Spotify
     */
    const toggleSearch = useCallback(async (name) => {
        setIsLoading(true)
        try {
            await dispatch(songActions.findSongs(name))
        } catch (err) {
            console.log(err.message)
        }
        setIsLoading(false)
    }, [dispatch])

    /**
     * update song name and toggle dispatch whenever field changes
     * @param {*} input a string
     */
    const nameChangeHandler = (input) => {
        setName(input)
        // clear timer if initalized
        if (timer) { clearTimeout(timer) }
        // dont make a search request if input is reset/blank
        if (input) {
            // replace space with %20 to allow for correct url format when sending request after user stops typing
            setTimer(setTimeout(() => { toggleSearch(input.replace(/ /g, '%20')) }, 500))
        }
    }

    /**
     * host action that adds a song and sends an alert that routes user back if successful
     * @param {*} songID Spotify song ID
     */
    const addSongHostHandler = async (songID) => {
        // correctly format songID
        const formattedID = songID.replace(/:/g, '%3A')
        const errResponse = await songActions.addSong(formattedID, playlistID)
        if (!errResponse) {
            // update local version of playlist
            await dispatch(songActions.getPlaylistSongs(playlistID))
            // tell other devices in room to update
            await hostActions.updateResponse(roomID)
            Alert.alert('Song Added', 'Your song was added to the queue!', [{ text: 'Okay' }])
        } else {
            Alert.alert('Error Adding Song', 'We were unable to add your selected song to the queue. Please try again', [{ text: 'Okay' }])
        }
    }

    /**
     * admin action that sends a message to Firebase asking the host to add the song
     * @param {*} songID Spotify song ID
     */
    const addSongAdminHandler = async (songID) => {
        await dispatch(adminActions.sendAddSongRequest(songID, roomID, userID))
    }

    /**
     * Route the user back to the previous screen
     */
    const backHandler = () => {
        props.navigation.pop();
    }

    // Select add song handler based on user type
    let addSongHandler = addSongHostHandler

    if (userType === 'admin') {
        addSongHandler = addSongAdminHandler
    }

    // determine which tracks to display based on whether the input field is filled or not 
    const tracks = (name) ? searchResults : recentTracks

    return (
        <AddSongScreenUI
            nameChangeHandler={nameChangeHandler}
            name={name}
            isLoading={isLoading}
            tracks={tracks}
            addSongHandler={addSongHandler}
            backHandler={backHandler}
        />
    )
}

export default AddSongScreen
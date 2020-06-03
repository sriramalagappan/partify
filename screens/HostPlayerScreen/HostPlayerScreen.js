import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HostPlayerScreenUI from './HostPlayerScreenUI'
import * as songActions from '../../store/actions/songs'

const HostPlayerScreen = props => {

    // Redux Store State Variables
    const playlistID = useSelector(state => state.room.playlistID)
    const tracks = useSelector(state => state.songs.tracks)

    const dispatch = useDispatch()

    // route to add song screen if button pressed
    const addSongHandler = () => {
        props.navigation.navigate('Add')
    }

    // componentDidMount (and if playlistID exists)
    useEffect(() => {
        if (playlistID) {
            dispatch(songActions.getPlaylistSongs(playlistID))
        }
    }, [playlistID])

    return (
        <HostPlayerScreenUI
            addSongHandler={addSongHandler}
        />
    )
}

export default HostPlayerScreen
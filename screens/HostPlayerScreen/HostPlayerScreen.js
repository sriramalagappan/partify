import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HostPlayerScreenUI from './HostPlayerScreenUI'
import * as songActions from '../../store/actions/songs'
import artistBuilder from '../../misc/artistBuilder'

const HostPlayerScreen = props => {

    // Stateful Variables

    // Redux Store State Variables
    const playlistID = useSelector(state => state.room.playlistID)
    let tracksData = useSelector(state => state.songs.tracks)

    if (tracksData == false) {
        tracksData = null
    }
    
    // default message
    let message = 'You have no songs. To get started, add a song by clicking the plus button below'
    let queueTracks = null;
    let currentTrack = null;

    // reverse tracks and modify tracks by pulling out first song
    if (tracksData) {
        queueTracks = tracksData.reverse()
        currentTrack = queueTracks.shift()
        // change message
        message = `Currently Playing: ${currentTrack.track.name} - ${artistBuilder(currentTrack.track.artists)}`
        if (queueTracks[0]) {
            message += `     Up Next: ${queueTracks[0].track.name} - ${artistBuilder(queueTracks[0].track.artists)}`
        }
    }

    const dispatch = useDispatch()

    // route to add song screen if button pressed
    const addSongHandler = () => {
        props.navigation.navigate('Add')
    }

    // componentDidMount (and if playlistID exists)
    useEffect(() => {
        dispatch(songActions.getPlaylistSongs(playlistID))
    }, [])

    // delete the given song from the queue
    const deleteSongHandler = async (songID, index) => {
        let queueIndex = Math.abs((index + 1) - queueTracks.length)
        await dispatch(songActions.deleteSong(songID, playlistID, queueIndex))
        dispatch(songActions.getPlaylistSongs(playlistID))
    }

    // determine if the user has elevated status (host/admin)


    return (
        <HostPlayerScreenUI
            addSongHandler={addSongHandler}
            currentTrack={currentTrack}
            queueTracks={queueTracks}
            deleteSongHandler={deleteSongHandler}
            message={message}
        />
    )
}

export default HostPlayerScreen
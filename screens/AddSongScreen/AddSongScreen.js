import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddSongScreenUI from './AddSongScreenUI'
import * as songActions from '../../store/actions/songs'


const AddSongScreen = props => {

    // Stateful Variables
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [timer, setTimer] = useState(null)

    // Redux Store State Variables
    const searchResults = useSelector(state => state.songs.searchResults)

    const dispatch = useDispatch()

    // toggle dispatch for finding song from Spotify
    const toggleSearch = useCallback(async (name) => {
        setIsLoading(true)
        try {
            await dispatch(songActions.findSongs(name))
        } catch (err) {
            console.log(err.message)
        }
        setIsLoading(false)
    }, [dispatch])

    // update song name and toggle dispatch whenever field changes
    const nameChangeHandler = (input) => {
        setName(input)
        // clear timer if initalized
        if (timer) { clearTimeout(timer) }
        // dont make a search request is input is reset/blank
        if (input) {
            // replace space with %20 to allow for correct url format when sending request after user stops typing
            setTimer(setTimeout(() => { toggleSearch(input.replace(/ /g, '%20')) }, 500))
        }
    }

    return (
        <AddSongScreenUI
            nameChangeHandler={nameChangeHandler}
            name={name}
            isLoading={isLoading}
            searchResults={searchResults}
        />
    )
}

export default AddSongScreen
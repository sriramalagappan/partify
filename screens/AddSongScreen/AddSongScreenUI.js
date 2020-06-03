import React from 'react'
import { View, Text, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements'
import TouchableSong from '../../components/TouchableSong'

import styles from './styles'

const AddSongScreenUI = props => {

    const renderSong = (itemData) => {
        // build string of artists
        let artists;
        let i;
        for (i = 0; i < itemData.item.artists.length; i++) {
            if (i === 0) {
                artists = itemData.item.artists[i].name
            } else {
                artists += ', ' + itemData.item.artists[i].name
            }
        }

        return (
            <TouchableSong
                name={itemData.item.name}
                author={artists}
                imageUri={itemData.item.album.images[1].url}
            />
        )
    }

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <View style={styles.screen}>
                <LinearGradient
                    colors={['rgba(29,180,76,0.6)', 'transparent']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 200,
                    }}
                />
                <View style={styles.searchContainer}>
                    <SearchBar
                        placeholder={'Search for a song...'}
                        onChangeText={props.nameChangeHandler}
                        value={props.name}
                        containerStyle={styles.searchBar}
                        lightTheme={false}
                        round={true}
                        inputStyle={styles.inputText}
                        showLoading={props.isLoading}
                    />
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        keyExtractor={(item) => item.id}
                        data={props.searchResults}
                        renderItem={renderSong}
                        numColumns={1}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default AddSongScreenUI
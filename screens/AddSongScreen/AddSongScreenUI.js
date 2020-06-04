import React from 'react'
import { View, Text, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements'
import TouchableSong from '../../components/TouchableSong'

import styles from './styles'
import artistBuilder from '../../misc/artistBuilder';

const AddSongScreenUI = props => {

    const renderSong = (itemData) => (
        <TouchableSong
            name={itemData.item.name}
            author={artistBuilder(itemData.item.artists)}
            imageUri={itemData.item.album.images[1].url}
            onPress={() => { props.addSongHandler(itemData.item.uri) }}
        />
    )


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
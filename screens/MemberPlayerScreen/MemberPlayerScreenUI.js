import React from 'react'
import { View, Text, Easing, FlatList } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import TextTicker from 'react-native-text-ticker'
import Song from '../../components/Song'
import artistBuidler from '../../misc/artistBuilder'
import AdminPlayer from './AdminPlayer'

import styles from './styles'

const MemberPlayerScreenUI = props => {

    const queueTrackRenderer = (itemData) => (
        <Song
            name={itemData.item.track.name}
            author={artistBuidler(itemData.item.track.artists)}
            imageUri={itemData.item.track.album.images[1].url}
            isQueue
            elevatedUser
            onSwipeRight={() => { props.deleteSongHandler(itemData.item.track.uri, (itemData.index + 1)) }}
            isExplicit={itemData.item.track.explicit}
        />
    )

    return (
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
            <TextTicker
                style={styles.scrollingText}
                duration={props.message.length * 300}
                loop
                repeatSpacer={50}
                easing={Easing.linear}
            >
                {props.message}
            </TextTicker>
            {(props.currentTrack) ? (
                <Song
                    name={(props.currentTrack.track.name)}
                    author={artistBuidler(props.currentTrack.track.artists)}
                    imageUri={props.currentTrack.track.album.images[1].url}
                    isExplicit={props.currentTrack.track.explicit}
                />
            ) : (
                    <Song
                        name={'The room queue is currently empty'}
                        author={'Click the plus button below to start'}
                    />
                )
            }
            <Text style={styles.header}>Queue</Text>
            <View style={styles.listContainer}>
                <FlatList
                    keyExtractor={(item) => item.track.id + props.queueTracks.indexOf(item)}
                    data={props.queueTracks}
                    renderItem={queueTrackRenderer}
                    numColumns={1}
                />
            </View>
            <View style={styles.div} />
            <AdminPlayer
                addSongHandler={props.addSongHandler}
            />
        </View>
    )
}

export default MemberPlayerScreenUI
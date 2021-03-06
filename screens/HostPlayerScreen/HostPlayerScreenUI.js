import React from 'react'
import { View, Text, Easing, FlatList, Modal, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import TextTicker from 'react-native-text-ticker'
import Song from '../../components/Song'
import artistBuidler from '../../misc/artistBuilder'
import Player from './Player'
import CustomButton from '../../components/CustomButton'

import styles from './styles'

const HostPlayerScreenUI = props => {

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

            {/* Modal */}

            <Modal
                visible={props.visible}
                transparent={true}
                onRequestClose={props.closeModal}
                animationType={'fade'}
            >
                <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={props.closeModal}>
                    <View style={styles.modal}>
                        <View style={styles.modalBody}>
                            {/* <CustomButton
                                style={styles.modalButton}
                                title={"Recommended Songs"}
                                textStyle={styles.modalButtonText}
                                onPress={props.submitPasswordHandler}
                            />
                            <CustomButton
                                style={styles.modalButton}
                                title={"Members"}
                                textStyle={styles.modalButtonText}
                                onPress={props.submitPasswordHandler}
                            /> */}
                            <CustomButton
                                style={styles.modalButton}
                                title={"Home"}
                                textStyle={styles.modalButtonText}
                                onPress={props.routeHome}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            <TextTicker
                style={styles.scrollingText}
                duration={props.message.length * 300}
                loop
                repeatSpacer={50}
                easing={Easing.linear}
            >
                {props.message}
            </TextTicker>

            {/*Check if new playlist data is loading*/}

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
                    keyExtractor={(item) => item.track.id + Math.floor(Math.random() * 1000)}
                    data={props.queueTracks}
                    renderItem={queueTrackRenderer}
                    numColumns={1}
                />
            </View>
            <View style={styles.div} />
            <Player
                addSongHandler={props.addSongHandler}
                current={(props.currentTrack) ? props.currentTrack.track.uri : null}
                duration={(props.currentTrack) ? props.currentTrack.track.duration_ms : null}
                next={(props.nextTrack) ? props.nextTrack.track.uri : null}
                nextDuration={(props.nextTrack) ? props.nextTrack.track.duration_ms : null}
                displayModal={props.displayModal}
                prevDuration={props.prevDuration}
            />
        </View>
    )
}

export default HostPlayerScreenUI
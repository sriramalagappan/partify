import React from 'react'
import { View, Text, Easing } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import TextTicker from 'react-native-text-ticker'
import AddButton from '../../components/AddButton'
import Song from '../../components/Song'

import styles from './styles'

const HostPlayerScreenUI = props => {

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
                duration={20000}
                loop
                repeatSpacer={50}
                easing={Easing.linear}
            >
                You have no songs. To get started, add a song by clicking the plus button below
            </TextTicker>
            <Song 
                name={props.playingName}
                author={props.playingArtist}
                imageUri={props.playingImageUri}
            />
            <Text style={styles.header}>Queue</Text>
            <View style={styles.buttonContainer}>
                <AddButton 
                    onPress={props.addSongHandler}
                />
            </View>
        </View>
    )
}

export default HostPlayerScreenUI
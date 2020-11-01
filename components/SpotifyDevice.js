// Component that displays active Spotify devices

import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import colors from '../constants/Colors'
import Icon from './Icon'
import { EvilIcons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const SpotifyDevice = props => {

    const deviceItem = (device) => {
        let IconType;
        switch (device.type) {
            case 'Computer': {
                IconType = (<MaterialIcons name='computer' size={30} color={colors.primary} />)
                break;
            }
            case 'Smartphone': {
                IconType = (<FontAwesome name='mobile-phone' size={30} color={colors.primary} />)
                break;
            }
            case 'TV': {
                IconType = (<FontAwesome name='television' size={30} color={colors.primary} />)
                break;
            }
            case 'Automobile': {
                IconType = (<MaterialCommunityIcons name='car' size={30} color={colors.primary} />)
                break;
            }
            default: {
                IconType = (<MaterialCommunityIcons name='speaker' size={30} color={colors.primary} />)
                break;
            }
        }

        let textStyle = styles.deviceText

        if (props.selectedDevice && props.selectedDevice.id === device.id) {
            textStyle = styles.selectedDeviceText
        }


        return (
            <TouchableOpacity
                onPress={() => { props.onPress(props.devices.indexOf(device)) }}
                style={styles.deviceItem}
                key={device.id}
            >
                <View style={styles.deviceRow}>
                    <View style={styles.deviceIcon}>
                        {IconType}
                    </View>
                    <Text style={textStyle} numberOfLines={1}>{device.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{...styles.border, backgroundColor: props.backgroundColor}}>
            <View style={styles.row}>
                <Text style={styles.header}>Your Devices</Text>
                <Icon style={styles.icon} onPress={props.onPressIcon}>
                    <EvilIcons name='refresh' size={30} color={colors.primary} />
                </Icon>
            </View>

            {(props.devices) ? (props.devices.map((device) => (deviceItem(device))))
                : (
                    <View style={styles.notFoundContainer}>
                        {(props.isLoading) ? (<ActivityIndicator size='small' color={colors.primary} />)
                            : (<Text style={styles.notFoundText}>We could not find any devices.
                            Make sure you have Spotify running on at least one device and
                            then click the refresh button above</Text>)
                        }
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({

    border: {
        width: '84%',
        marginHorizontal: 15,
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#3b3b3b',
        borderRadius: 10,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: '#3b3b3b'
    },

    header: {
        color: '#a8a8a8',
        fontFamily: 'regular',
        fontSize: 20,
        marginLeft: 7,
        marginVertical: 3,
    },

    notFoundText: {
        color: 'red',
        marginHorizontal: 7
    },

    icon: {
        marginTop: 5,
        marginRight: 7,
    },

    notFoundContainer: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    deviceItem: {
        backgroundColor: 'rgba(112, 112, 112, 0.1)',
        height: 40,
    },

    deviceRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    deviceText: {
        color: '#a8a8a8',
        fontFamily: 'medium',
        fontSize: 17,
    },

    selectedDeviceText: {
        color: colors.primary,
        fontFamily: 'medium',
        fontSize: 17,
    },

    deviceIcon: {
        marginLeft: 7,
        marginRight: 10,
        width: 40,
        alignItems: 'center'
    },
})

export default SpotifyDevice
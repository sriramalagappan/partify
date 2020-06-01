import { AsyncStorage } from 'react-native'

const setUserData = async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
}

export default setUserData
import { AsyncStorage } from 'react-native'

const getUserData = async (key) => {
    const result = await AsyncStorage.getItem(key)
    return JSON.parse(result)
}

export default getUserData
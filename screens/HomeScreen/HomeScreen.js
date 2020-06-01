import React, { useEffect } from 'react'
import HeaderButton from '../../components/HeaderButton'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HomeScreenUI from './HomeScreenUI'
import { useDispatch, useSelector } from 'react-redux'


const HomeScreen = props => {

    // Redux Store State Variables
    const display_name = useSelector(state => state.user.display_name)

    // save dispatch function in variable to use in hooks
    const dispatch = useDispatch()

    useEffect(() => {
        //componentDidMount
    }, [])

    return (
        <HomeScreenUI
            display_name={(display_name) ? display_name : ''}
        />
    )
}

// HomeScreen.navigationOptions = (navData) => {
//     return {
//         headerTitle: 'Home',
//         headerLeft: () => (
//             <HeaderButtons HeaderButtonComponent={HeaderButton}>
//                 <Item
//                     title='Menu'
//                     iconName='ios-menu'
//                     onPress={() => {}} />
//             </HeaderButtons>
//         )
//     }
// }

export default HomeScreen
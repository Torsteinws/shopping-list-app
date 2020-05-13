import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"

import Swipeable from 'react-native-gesture-handler/Swipeable';

const ListItem = (props) => {

    const swipeLeftAction = () => {
        return(
            <View style={style.wipeContainer}>
                <Icon 
                    name="trash" 
                    style={style.swipeIcon} 
                />
                <Text style={style.swipeText}>DELETE</Text>
            </View>
        )
    }

    const swipeRightAction = () => {
        return(
            <View style={[style.wipeContainer, style.leftSwipeContainer]}>
                <Text style={style.swipeText}>DELETE</Text>
                <Icon 
                    name="trash" 
                    style={style.swipeIcon} 
                />
            </View>
        )
    }

    return (
        <Swipeable 
            renderLeftActions={swipeLeftAction}
            renderRightActions={swipeRightAction}
            onSwipeableOpen={() => props.onDeleteItem(props.itemId)}
        >
            <View style={style.itemContainer}>
                <Text style={style.itemText} >{props.title}</Text>
                <MaterialIcon 
                    name="arrow-collapse-right" 
                    style={style.removeIcon} 
                    // onPress={() => props.onDeleteItem(props.itemId)}
                />
            </View>       
        </Swipeable>
    )
}


ListItem.defaultProps = {
    title: "Item not recognized"
}

const style = StyleSheet.create({
    itemContainer: {
        height: 60,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "rgb(200, 220, 200)",
        borderBottomWidth: 3,
        borderBottomColor: "rgb(230, 230, 230)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemText: {
        fontSize: 20,
        color: "rgb(50, 50, 50)"
    },
    removeIcon: {
        fontSize: 25,
        color: "rgb(50, 50, 50)"
    },

    wipeContainer: {
        flex: 1,
        backgroundColor: "rgb(230, 50, 50)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },

    leftSwipeContainer: {
        justifyContent: "flex-end"
    },

    swipeText: {
        fontSize: 20,
        color: "rgb(255, 255, 255)",
    },

    swipeIcon: {
        fontSize: 20,
        color: "rgb(255, 255, 255)",
        paddingHorizontal: 10
    },
})

export default ListItem
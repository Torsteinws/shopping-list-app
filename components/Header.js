// Core react
import React from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"

const Header = (props) => {
    return (
        <View style={style.HeaderContainer}>
            <Text style={style.HeaderText} >
                {props.title}
            </Text>
        </View>
    )
}

Header.defaultProps = {
    title: "Default title"
}

const style = StyleSheet.create({
    HeaderContainer: {
        height: 75,
        backgroundColor: "rgb(100, 200, 100)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },

    HeaderText: {
        color: "white",
        fontSize: 25
    }
})

export default Header
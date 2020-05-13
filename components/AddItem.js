import React, {useState, useRef} from "react"

import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback
} from "react-native"

import Icon from "react-native-vector-icons/Entypo"

const AddItem = (props) => {

    const [text, setText] = useState("")
    const textInputRef = useRef(null)

    const onTextChanged = (text) => { 
        setText(text)
    }

    const AddCurrentItem = () =>{
        props.onAddItemPress(text)
        setText("")
        textInputRef.current.clear()
    }

    return(
        <View>
            <View style={props.style}>
                <TextInput 
                    ref={textInputRef}
                    style = {style.textInput}
                    placeholder="Add new item..."
                    onChangeText={(text) => onTextChanged(text)}
                    onEndEditing={() => AddCurrentItem()}     
                />    
                <TouchableOpacity 
                    style={style.addButton}
                    onPress={AddCurrentItem}
                >
                        <Icon name="add-to-list" style={style.buttonIcon}></Icon>
                        <Text style={style.buttonText} >ADD ITEM</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}




const style = StyleSheet.create({

    textInput: {
        borderWidth: 2,
        borderColor: "rgb(150, 150, 150)"
    },

    addButton: {
        height: 50,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 20,
        // Flexbox positioning
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgb(100, 200, 100)",
        justifyContent: "center",
        alignItems: "center",
    },

    buttonIcon: {
        color: "rgb(255, 255, 255)",
        fontSize:  22,
        marginHorizontal: 5
    },

    buttonText: {
        color: "rgb(255, 255, 255)",
        fontSize:  20
    }
})



export default AddItem
// react core
import React, {useState, useRef, useEffect} from "react"
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Alert,
	SafeAreaView,
	KeyboardAvoidingView,
	NativeModules,
	LayoutAnimation,
	Platform,
	UIManager
    } from "react-native"
// Third party
import AsyncStorage from "@react-native-community/async-storage"
import "react-native-get-random-values" // This makes hee uuid library compatible with react native
import { v4 as uuidv4 } from 'uuid';
// components
import Header from "./components/Header.js"
import ListItem from "./components/ListItem.js"
import AddItem from "./components/AddItem.js"

// Boilerplate for using layoutanimation
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
	    UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const App = () =>{  
	return (
    <View style={style.appContainer}>
        <Header title="Shopping List"/>
        <List 
            deleteAnimation={deleteAnimation} 
            addItemAnimation={addItemAnimation}
        />
    </View>
	)
}

// Layoutanimations. See react native core documentation for format
const deleteAnimation = {
    duration: 700,
    update: {
        type: "spring",
        springDamping: 0.4,
        property: "scaleXY"
    },
    delete: {
        type: "spring",
        springDamping: 0.4,
        property: "scaleXY"
    }
}
const addItemAnimation = {
    duration: 100,
    create: {
        type: "easeOut",
        property: "scaleXY"
    }
}

const List = (props) => {  
    // state hooks
    const [items, setItems] = useState([])
    const [shouldSaveItems, setShouldSaveItems] = useState(false) // Don't save items until the user changes them  
    const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false)
    // Setup hook
    useSetup( async () => { 
        const storedItems = await fetchLocalStorage("shopping-list-items")
        setItems(storedItems)
    })  
    // Reference hook
    const flatListRef = useRef(null)

    const deleteItem = (id) => {
        const newItems = items.filter( (item) => item.id != id)
        LayoutAnimation.configureNext(props.deleteAnimation)
        setItems(newItems)
        setShouldSaveItems(true)
    }
        
    const addNewItem = (text) => {
        LayoutAnimation.configureNext(props.addItemAnimation)
        if(text){
            setItems([...items, {id: uuidv4(), name: text}])
            setShouldScrollToEnd(true)
            setShouldSaveItems(true)
        }
    } 
    
    const onListItemsChange = () => {
        if(shouldScrollToEnd){
            flatListRef.current.scrollToEnd()
            setShouldScrollToEnd(false)
        }
        if(shouldSaveItems){
            saveLocalStorage("shopping-list-items", items) 
            setShouldSaveItems(false)
        }
    }

    return (
        <>
            <AddItem 
            style = {style.addItem}
            onAddItemPress = {addNewItem}	
            />
            <KeyboardAvoidingView style={style.listItemsContainer}>
                <FlatList 
                ref={flatListRef}
                data={items}
                style={style.listItems}
                keyExtractor={ item => item.id.toString() + item.name}
                renderItem={ data => {
                    const itemNumber = data.index + 1
                    const itemText = itemNumber.toString() + ".      " + data.item.name
                    return (
                    <ListItem 
                        title={itemText}
                        itemId={data.item.id}
                        onDeleteItem={deleteItem}
                    />
                    )}}
                onContentSizeChange={(params) => onListItemsChange(params)}
                />
            </KeyboardAvoidingView>
        </>
    )
}

// Custom hook that will run the callback exactly once -- similar to a class construtcor
const useSetup = (callBack) => {
    const [hasBeenCalled, sethasBeenCalled] = useState(false)
    if(hasBeenCalled) return
    callBack()
    sethasBeenCalled(true)
}

const saveLocalStorage = async (storageKey, value) => {
  try{
    await AsyncStorage.setItem(storageKey, JSON.stringify(value))
  }
  catch(e){
    console.log(e)
  }
}

const fetchLocalStorage =  async (storageKey) => {
  try{
    const value = await AsyncStorage.getItem(storageKey)  
    return value == null ? [] : JSON.parse(value)  
  }
  catch(e){
    console.log(e)
    return []
  }
}

const style = StyleSheet.create({
	appContainer: {
		flex: 1
	},

	addItem: {
		marginHorizontal: 30,
		marginVertical: 10,

	},

	listItemsContainer: {
		flex: 1
	},
	
	listItems: {
		flexGrow: 1
	}
})

export default App
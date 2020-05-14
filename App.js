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
import AsyncStorage from "@react-native-community/async-storage"

import Header from "./components/Header.js"
import ListItem from "./components/ListItem.js"

import "react-native-get-random-values" // This makes hee uuid library compatible with react native
import { v4 as uuidv4 } from 'uuid';
import AddItem from "./components/AddItem.js"

// Boilerplate for using layoutanimation
if (Platform.OS === 'android') {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
	  UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Custom hook that will run the callback exactly once 
const useSetup = (callBack) => {
  const [hasBeenCalled, sethasBeenCalled] = useState(false)
  if(hasBeenCalled) return
  callBack()
  sethasBeenCalled(true)
}


const App = () =>{

  const [items, setItems] = useState([])
  useSetup( async () => { 
    const storedItems = await fetchLocalStorage("shopping-list-items")
    setItems(storedItems)
  })  

  const [shouldSaveItems, setShouldSaveItems] = useState(false) // Don't save items until the user changes them
  
	const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false)
	const flatListRef = useRef(null)

	const deleteItem = (id) => {
		const newItems = items.filter( (item) => item.id != id)
		LayoutAnimation.configureNext({
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
		})
    setItems(newItems)
    setShouldSaveItems(true)
	}
	
	const addNewItem = (text) => {
		LayoutAnimation.configureNext({
			duration: 100,
			create: {
				type: "easeOut",
				property: "scaleXY"
			}
		})
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
		<View style={style.appContainer}>
			<Header title="Shopping List"/>
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
		</View>
	)
}

const saveLocalStorage = async (storageKey, value) => {
  try{
    await AsyncStorage.setItem(storageKey, JSON.stringify(value))
    console.log("saved", value)
  }
  catch(e){
    console.log(e)
  }
}

const fetchLocalStorage =  async (storageKey) => {
  // console.log("fetching....")
  try{
    const value = await AsyncStorage.getItem(storageKey)
    // console.log("Retrieved: ", JSON.parse(value))    
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
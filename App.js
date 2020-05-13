import React, {useState, useRef} from "react"

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

const App = () =>{

	const [items, setItems] = useState([])

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
			setItems([
				...items, 
				{
					id: uuidv4(),  
					name: text
				}
			])
			setShouldScrollToEnd(true)
		}
		else{
			// Alert.alert("Error", "Cannot add an empty item to the shopping list")
		}
	} 

	const onListItemsChange = () => {
		if(shouldScrollToEnd){
			flatListRef.current.scrollToEnd()
			setShouldScrollToEnd(false)
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
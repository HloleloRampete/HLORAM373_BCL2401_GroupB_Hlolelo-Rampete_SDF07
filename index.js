import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-20fd6-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")  // database reference 

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// adding items to the shopping list
addButtonEl.addEventListener("click", function() {  // listening for clicks with an event listener to add items in the input field to the DOM
    let inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue)   // // push fuction adds item from inputFieldEl to shopping list database
    clearInputFieldEl()
})

// Updating items in realtime in the database. Fetched 'onValue' to call its function
onValue(shoppingListInDB, function(snapshot) {  // onValue functions gives us a snapshot in realtime when the database updates
    if (snapshot.exists()) {            // used an 'if' statement to check if 'shoppingListInDB' is true or false. For if it false, it should log out 'no items' message.
        let itemsArray = Object.entries(snapshot.val())  // converting the snapshot.val() to an Array with itemsArray variable.
        clearShoppingListEl()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemToShoppingListEl(currentItem)  // appends items to the shopping list element for each iteration
    
        }
    } else {
        shoppingListEl.innerHTML = "Anything missing in the Kitchen?"
    }

}) 

// clearing Shopping list function to clear the array list I created from the snapshot before the for loop appends an item
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// clearing the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// adding  and removing itmes from the input field to HTML
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")  // creating a list element so that I can add an event listner to it later
    newEl.textContent = itemValue  // showing item name/value in the new list element
    newEl.addEventListener("click", function() {  // added event listner to remove item from Database
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)   // fetched remove function to remove shopping items using their ID
    })
    shoppingListEl.append(newEl)  // appending newEl to the shopping list HTML element 

}
"use strict"

//variables hold elements based on a query selector
var coffeeDiv = document.querySelector('#coffees');
var roastSelection = document.querySelector('#roast-selection');
var addCoffeeButton = document.querySelector('#add-submit');
var addRoast = document.querySelector('#add-roast-selection');
var newCoffee = document.querySelector('#add-coffee');
var searchCoffee = document.querySelector("#search");
var stagedItem = document.querySelector("#staged-item");
var editCoffee = document.querySelector("#edit-coffee");
var editRoastSelection = document.querySelector("#edit-roast-selection");

//creates elements, and returns group of elements
function renderCoffee(coffee) {

    let div = document.createElement("div");
    div.classList.add("coffee");

    let heading = document.createElement("h3");
    heading.innerText = coffee.name;

    let p = document.createElement("p");
    p.innerText = coffee.roast;

    let edit = document.createElement("div");
    edit.innerHTML = '<i class="far fa-edit"></i>';
    edit.style.display = "none";

    div.addEventListener("mouseenter", function( event ) {
         edit.style.display = "inline-block";
    });

    div.addEventListener("click", function( event ) {
        stagedItem.innerText = div.innerText;

        let text = stagedItem.innerText.replace(/(\r\n|\n|\r)/gm," ");
        let array = text.split("  ");

        editCoffee.value = array[0];
        editRoastSelection.value = array[1];

    });

    div.addEventListener("mouseleave", function( event ) {
        edit.style.display = "none";
    });


    div.appendChild(heading);
    div.appendChild(p);
    div.appendChild(edit);

    return div;
}

function editItem() {

}

function deleteItem() {
    let text = stagedItem.innerText.replace(/(\r\n|\n|\r)/gm," ");
    let array = text.split("  ");

    for (let index in coffees) {

        if (coffees[index].name === array[0]) {
            //delete the item
            coffees.splice(index, 1);
        }
    }

    localStorage.setItem("coffees", JSON.stringify(coffees));
    stagedItem.innerText = '';

    updateCoffees();
}


//loops through the array of coffees, calling renderCoffee on each one
//returns a string containing html
function renderCoffees(coffees) {

        coffeeDiv.innerHTML = '';

        for(var i = 0; i < coffees.length; i++) {
            let child = renderCoffee(coffees[i]);
            coffeeDiv.appendChild(child);
        }
}

//triggered on events to update the screen based on user input
function updateCoffees(e) {
    if (e) {
        e.preventDefault(); // don't submit the form, we just want to update the data
    }
    var selectedRoast = roastSelection.value;
    var filteredCoffees = [];
    coffees.forEach(function(coffee) {

        //looks to include coffees with the correct roast and search string filter
        if ((coffee.roast === selectedRoast || selectedRoast === "All") && hasCoffee(coffee)) {
            filteredCoffees.push(coffee);
        }
    });

    //updates the screen based on user input
    renderCoffees(filteredCoffees);
}

//gets data from localStorage if it exists, otherwises assigns it the default array
let coffees = function() {
    if (localStorage.getItem("coffees") !== null) {
        //JSON.parse used to change item back into an object
        return JSON.parse(localStorage.getItem("coffees"));
    }

    return [
        {id: 1, name: 'Light City', roast: 'light'},
        {id: 2, name: 'Half City', roast: 'light'},
        {id: 3, name: 'Cinnamon', roast: 'light'},
        {id: 4, name: 'City', roast: 'medium'},
        {id: 5, name: 'American', roast: 'medium'},
        {id: 6, name: 'Breakfast', roast: 'medium'},
        {id: 7, name: 'High', roast: 'dark'},
        {id: 8, name: 'Continental', roast: 'dark'},
        {id: 9, name: 'New Orleans', roast: 'dark'},
        {id: 10, name: 'European', roast: 'dark'},
        {id: 11, name: 'Espresso', roast: 'dark'},
        {id: 12, name: 'Viennese', roast: 'dark'},
        {id: 13, name: 'Italian', roast: 'dark'},
        {id: 14, name: 'French', roast: 'dark'},
    ];

}();


//initializes page on load
renderCoffees(coffees);

//handles events to update filters, which updates the screen
addCoffeeButton.addEventListener('click', addCoffee);
searchCoffee.addEventListener('keyup', updateCoffees);
roastSelection.addEventListener('change', updateCoffees);
editRoastSelection.addEventListener('change', updateEdit);

function updateEdit(){
    let text = stagedItem.innerText.replace(/(\r\n|\n|\r)/gm," ");
    let array = text.split("  ");

    array[1] = editRoastSelection.value;

    stagedItem.innerText = array.join("  ");
}

//returns whether user-inputted text matches and part of a coffee name; case-insensitive
function hasCoffee(coffee){

    var coffeeName = searchCoffee.value.toLowerCase();
    return(coffee.name.toLowerCase().indexOf(coffeeName) !== -1);

}

//updates the screen
function addCoffee(e){
    e.preventDefault()

    var coffeeName = newCoffee.value;
    var newRoast = addRoast.value;
    var updatedCoffee = {
        id: coffees.length + 1,
        name: coffeeName,
        roast: newRoast
    }

    coffees.push(updatedCoffee);

    if(localStorage) {
        //JSON.stringify used as you can only use localStorage with strings
        localStorage.setItem("coffees", JSON.stringify(coffees));
    }

    updateCoffees(e);
}


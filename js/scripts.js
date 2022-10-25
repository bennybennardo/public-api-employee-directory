const gallery = document.getElementById('gallery');
const body = document.body;
const cards = new Array;
const employeeArray = new Array;
const dataUrl = 'https://randomuser.me/api/?results=12'
const employeeNumberRegex = /^\d+-employee$/
let employeeNumber = 0

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

fetch(dataUrl)
    .then( response => response.json())
    .then( data => createEmployeeArray(data.results))
    .then( selectCards )


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------


//This function receives an array-like object that contains employee data objects.
//It maps over the object and pushes each employee object onto a proper array.
function createEmployeeArray(data) {
    data.map( employee => {
        employeeArray.push(employee)
    })
};


//This function receives an array of employee objects. For each object in the array, 
//an HTML card is created and pushed onto an array. These HTML cards are then inserted
//into the DOM.
function createCard(array) {
    const card = [];
    for ( let i = 0; i < array.length; i++) {
        card.push(`
        <div class="card" id="${i}-employee">
            <div class="card-img-container">
              <img class="card-img" src="${array[i].picture.large}" alt="profile picture">
            </div>
            <div class="card-info-continer">
                <h3 id="name" class="card-name cap">${array[i].name.first} ${array[i].name.last}</h3>
                <p class="card-text">${array[i].email}</p>
                <p class="card-text cap">${array[i].location.city}, ${array[i].location.state}</p>
            </div>
        </div>`)
    };
    gallery.insertAdjacentHTML('beforeend', card.join(''));
}

//This function calls the createCard() function to print cards to the page.
//It then attaches an event listener to each card that will call the 
//createModal() function on the card and redefine the employeeNumber variable
//with the numerical value of that card. 
function selectCards() {

    createCard(employeeArray)

    let allCards = (document.querySelectorAll('.card'))
    allCards.forEach(card => {
        cards.push(card)
    });

    cards.forEach(card => {
        card.addEventListener('click', e => {
            employeeNumber = getEmployeeNumber(card)
            createModal(card)
        })
    })

}

//This function gets the employee number from the id of each card printed 
//to the page with createCard() and parses it into a numeral.
function getEmployeeNumber(card) {
    return parseInt(card.id);
}

//This function receives one of the HTML cards printed to the page with createCard().
//If there is not already a modal overlayed onto the screen, it will use the getEmployeeNumber()
//function to parse the employee number of the selected card. It will then modalHTML() on that
//employee number and use insertModal() and modalButtons() to insert those overlay elements 
//onto the screen. 

//ERROR: Something in this function is redefining the employee number to always be the value of the 
//originally clicked card. 

function createModal(card) {

    console.log(employeeNumber)
    const modal = modalHTML(employeeNumber);

    insertModal(modal)
    modalButtons(employeeNumber)

}


//This function receives the numerical value of a selected card and returns an HTML modal containing
//that card's information. 
function modalHTML(employeeNumber) {

    const arrayIndex = employeeArray[employeeNumber];
    const HTML = `
    <div class="modal-container" id="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${arrayIndex.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${arrayIndex.name.first} ${arrayIndex.name.last}</h3>
                <p class="modal-text">${arrayIndex.email}</p>
                <p class="modal-text cap">${arrayIndex.location.city}</p>
                <hr>
                <p class="modal-text">${formatPhone(arrayIndex.phone)}</p>
                <p class="modal-text">${arrayIndex.location.street.number} ${arrayIndex.location.street.name}, ${arrayIndex.location.city}, ${arrayIndex.location.state}</p>
                <p class="modal-text">Birthday: ${formatBirthday(arrayIndex.dob.date)}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`

    return HTML
}

//This function receives the employee number of the displayed modal and adds 'PREV' and
//'NEXT' buttons onto the modal overlay. The event listeners on each of these buttons 
//will generate a new modal with the information of employee card of the previous or 
//following employee number. 

//ERROR: The 'PREV' button does not work, likely due to an error with createModal().
function modalButtons(employeeNumber) {
    // const employeeCard = document.getElementById(`${employeeNumber}-employee`)
    // console.log(employeeCard)
    const closeButton = document.getElementById('modal-close-btn');
    const domModal = document.getElementById('modal-container');
    const prevButton = document.getElementById('modal-prev');
    const nextButton = document.getElementById('modal-next');

    closeButton.addEventListener('click', () => domModal.remove());

    prevButton.addEventListener('click', () => {
        console.log(employeeNumber)
        employeeNumber -= 1;
        console.log(employeeNumber)
        let prevEmployee = document.getElementById(`${employeeNumber}-employee`)

        createModal(prevEmployee)
    })

    nextButton.addEventListener('click', () => console.log('next'))

}

//This function receives modal HTML and prints it to the page's body. 
function insertModal(modal) {
    let container = document.getElementById('modal-container')

    if (container) {
        container.remove()
    }

    body.insertAdjacentHTML('beforeend', modal)
}

//This function formats the birthday section of a displayed modal. 
function formatBirthday(dob) {
    const birthday = new Date(dob)
    return birthday.toLocaleDateString()
}

//This function formats the phone number section of a displayed modal. 
//There are numerous regex to account for the varying length of international
//phone numbers. 
function formatPhone(number) {
    const plainNumber = number.replace(/\D/g, '')
    let regex = ''

    if (plainNumber.length === 11) {
        regex = /^\D*(\d{4})\D*(\d{3})\D*(\d{4})\D*$/
    } else if (plainNumber.length === 10) {
        regex = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/   
    } else if (plainNumber.length === 9) {
        regex = /^\D*(\d{2})\D*(\d{3})\D*(\d{4})\D*$/
    } else if (plainNumber.length === 8) {
        regex = /^\D*(\d)\D*(\d{3})\D*(\d{4})\D*$/
    }

    const formattedNumber = plainNumber.replace(regex, '($1) $2-$3')
    return formattedNumber
}
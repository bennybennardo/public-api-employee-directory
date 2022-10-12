const gallery = document.getElementById('gallery');
const body = document.body;
const cards = new Array;
const employeeArray = new Array;
const dataUrl = 'https://randomuser.me/api/?results=12'
const employeeNumberRegex = /^\d+-employee$/

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

function createEmployeeArray(data) {
    data.map( employee => {
        employeeArray.push(employee)
    })
};

function createCard(array) {
    const card = [];
    for ( let i = 0; i < array.length; i++) {
        card.push(`
        <div class="card ${i}-employee">
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

function selectCards() {

    createCard(employeeArray)

    let allCards = (document.querySelectorAll('.card'))
    allCards.forEach(element => {
        cards.push(element)

    });

    cards.forEach(card => {
        card.addEventListener('click', e => {
            createModal(card)
        })
    })

}

function createModal(card) {

    let cardClasses = card.classList;
    let employeeNumberClass = Array.from(cardClasses)
        .find(word => word.includes("-employee"))
    let employeeNumber = parseInt(employeeNumberClass);
    let employee = employeeArray[employeeNumber];

    const modal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${employee.phone}</p>
                    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state}</p>
                    <p class="modal-text">Birthday: ${employee.dob.date}</p>
                </div>
            </div>`

    body.insertAdjacentHTML('beforeend', modal)

}
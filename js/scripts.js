const gallery = document.getElementById('gallery');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

fetch('https://randomuser.me/api/?results=12')
    .then( response => response.json())
    .then( data => createCard(data.results))

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function createCard(data) {
    const card = data.map( employee => `
        <div class="card">
            <div class="card-img-container">
              <img class="card-img" src="${employee.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-continer">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>
        `).join('')
    gallery.insertAdjacentHTML('beforeend', card)
}
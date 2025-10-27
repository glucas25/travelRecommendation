// Variable global para almacenar los datos
let travelData = null;

// Cargar datos del JSON al iniciar la página
async function loadTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        travelData = await response.json();
        console.log('Travel data loaded successfully:', travelData);
    } catch (error) {
        console.error('Error loading travel data:', error);
        alert('Error loading travel data. Please make sure travel_recommendation_api.json exists in the same folder.');
    }
}

// Función de búsqueda
function searchDestinations() {
    if (!travelData) {
        alert('Travel data is still loading. Please try again in a moment.');
        return;
    }

    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsGrid = document.getElementById('resultsGrid');
    
    if (!searchTerm) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <h3>Please enter a search term</h3>
                <p>Try searching for "beach", "temple", or a country name.</p>
            </div>
        `;
        return;
    }

    let results = [];

    // Buscar playas
    if (searchTerm.includes('beach') || searchTerm.includes('beaches')) {
        results = results.concat(travelData.beaches);
    }

    // Buscar templos
    if (searchTerm.includes('temple') || searchTerm.includes('temples')) {
        results = results.concat(travelData.temples);
    }

    // Buscar países y ciudades
    travelData.countries.forEach(country => {
        if (country.name.toLowerCase().includes(searchTerm) || 
            searchTerm.includes('country') || 
            searchTerm.includes('countries')) {
            results = results.concat(country.cities);
        }
    });

    displayResults(results, searchTerm);
}

// Función para mostrar resultados
function displayResults(results, searchTerm) {
    const resultsGrid = document.getElementById('resultsGrid');
    
    if (results.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <h3>No results found for "${searchTerm}"</h3>
                <p>Try searching for "beach", "temple", "Australia", "Japan", or "Brazil".</p>
            </div>
        `;
        return;
    }

    resultsGrid.innerHTML = results.map(item => `
        <div class="result-card">
            <img src="${item.imageUrl}" 
                 alt="${item.name}" 
                 class="result-image" 
                 onerror="this.src='https://via.placeholder.com/500x300?text=${encodeURIComponent(item.name)}'">
            <div class="result-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <a href="#" class="visit-btn" onclick="event.preventDefault(); visitDestination('${item.name}')">Visit</a>
            </div>
        </div>
    `).join('');
}

// Función para visitar destino
function visitDestination(name) {
    alert(`Booking feature for "${name}" coming soon!`);
}

// Función para resetear búsqueda
function resetSearch() {
    document.getElementById('searchInput').value = '';
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = `
        <div class="no-results">
            <h3>Start your search!</h3>
            <p>Enter keywords like "beach", "temple", or country names to discover amazing destinations.</p>
        </div>
    `;
}

// Función para cambiar secciones
function showSection(section) {
    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('about-section').classList.add('hidden');
    document.getElementById('contact-section').classList.add('hidden');
    
    if (section === 'home') {
        document.getElementById('home-section').classList.remove('hidden');
    } else if (section === 'about') {
        document.getElementById('about-section').classList.remove('hidden');
    } else if (section === 'contact') {
        document.getElementById('contact-section').classList.remove('hidden');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para manejar el envío del formulario de contacto
function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
    event.target.reset();
}

// Event listener para la tecla Enter en el campo de búsqueda
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos al iniciar
    loadTravelData();
    
    // Agregar event listener para Enter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchDestinations();
            }
        });
    }
});
// DOM Elements
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const resultsContainer = document.querySelector('#searchResults');
const loadingElement = document.querySelector('#loading');

// Event Listeners
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        showMessage('Vă rugăm introduceți un termen de căutare');
        return;
    }

    showLoading(true);
    clearResults();

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Eroare de rețea');
        
        const data = await response.json();
        
        if (data.docs.length === 0) {
            showMessage('Nu au fost găsite rezultate');
            return;
        }

        displayResults(data.docs);
    } catch (error) {
        showMessage('A apărut o eroare. Vă rugăm încercați din nou.');
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
}

function displayResults(books) {
    books.slice(0, 10).forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book-card';
        
        const coverUrl = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : 'https://via.placeholder.com/200x300.png?text=No+Cover';

        bookElement.innerHTML = `
            <img src="${coverUrl}" alt="Coperta carte" onerror="this.src='https://via.placeholder.com/200x300.png?text=No+Cover'">
            <h3>${book.title}</h3>
            <p>Autor: ${book.author_name ? book.author_name.join(', ') : 'Necunoscut'}</p>
            <p>An: ${book.first_publish_year || 'Necunoscut'}</p>
        `;

        resultsContainer.appendChild(bookElement);
    });
}

function clearResults() {
    resultsContainer.innerHTML = '';
}

function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;
    resultsContainer.appendChild(messageElement);
}

function showLoading(show) {
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

// Initial setup
showLoading(false);
clearResults();

//teste
console.log("Script încărcat cu succes.");

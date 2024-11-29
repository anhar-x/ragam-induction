// API Base URL
const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

// Check if user is logged in
function checkAuth() {
    const userInfo = document.getElementById('userInfo');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookForm = document.getElementById('bookForm');

    if (token) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        if (bookForm) bookForm.style.display = 'block';
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        if (bookForm) bookForm.style.display = 'none';
    }
}

// Load books
async function loadBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        const data = await response.json();
        const booksContainer = document.getElementById('booksContainer');
        
        booksContainer.innerHTML = data.data.map(book => `
            <div class="book-card">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.published_year}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Available:</strong> ${book.available_copies}</p>
                ${token ? `
                    <button onclick="deleteBook('${book._id}')">Delete</button>
                    <button onclick="editBook('${book._id}')">Edit</button>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Load books if on index page
    if (document.getElementById('booksContainer')) {
        loadBooks();
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            try {
                const response = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.get('email'),
                        password: formData.get('password')
                    })
                });
                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            try {
                const response = await fetch(`${API_URL}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        password: formData.get('password'),
                        membership_type: formData.get('membership_type')
                    })
                });
                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Registration error:', error);
            }
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.reload();
        });
    }
});
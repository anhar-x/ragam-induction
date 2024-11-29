// API Base URL (fix port number)
const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// Add loading and error message helpers
function showMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;
    document.querySelector('.container').insertBefore(messageDiv, document.querySelector('.container').firstChild);
    setTimeout(() => messageDiv.remove(), 3000);
}

function setLoading(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Loading...' : button.dataset.originalText;
}

// Check if user is logged in
function checkAuth() {
    const userInfo = document.getElementById('userInfo');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookForm = document.getElementById('bookForm');

    // Only proceed if we're on a page with these elements
    if (!userInfo || !loginBtn || !logoutBtn) {
        console.log('Not on a page with auth elements');
        return;
    }

    if (token) {
        console.log('Token found:', token);
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        if (bookForm) {
            bookForm.style.display = 'block';
        }
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', payload);
            userInfo.textContent = `Welcome, ${payload.id ? 'User' : 'Guest'}`;
        } catch (error) {
            console.error('Token decode error:', error);
            userInfo.textContent = 'Welcome, User';
        }
    } else {
        console.log('No token found');
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        if (bookForm) {
            bookForm.style.display = 'none';
        }
        userInfo.textContent = 'Guest';
    }
}

// Load books
async function loadBooks() {
    try {
        const booksContainer = document.getElementById('booksContainer');
        booksContainer.innerHTML = '<p>Loading books...</p>';
        
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/books`, { headers });
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to load books');
        }
        
        booksContainer.innerHTML = data.data.map(book => `
            <div class="book-card">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.published_year}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Available:</strong> ${book.available_copies}</p>
                ${token ? `
                    <div class="book-actions">
                        <button onclick="deleteBook('${book._id}')" class="delete-btn">Delete</button>
                        <button onclick="editBook('${book._id}')" class="edit-btn">Edit</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading books:', error);
        showMessage(error.message, true);
        booksContainer.innerHTML = '<p>Error loading books. Please try again.</p>';
    }
}

// Delete book
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to delete book');
        }
        
        showMessage('Book deleted successfully');
        loadBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
        showMessage(error.message, true);
    }
}

// Edit book
async function editBook(id) {
    // For simplicity, we'll just prompt for new values
    const newTitle = prompt('Enter new title:');
    if (!newTitle) return;
    
    try {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: newTitle })
        });
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to update book');
        }
        
        showMessage('Book updated successfully');
        loadBooks();
    } catch (error) {
        console.error('Error updating book:', error);
        showMessage(error.message, true);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Save original button text
    document.querySelectorAll('button').forEach(button => {
        button.dataset.originalText = button.textContent;
    });
    
    // Load books if on index page
    if (document.getElementById('booksContainer')) {
        loadBooks();
    }

    // Add Book Form
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = addBookForm.querySelector('button[type="submit"]');
            setLoading(submitBtn, true);
            
            try {
                const formData = new FormData(addBookForm);
                const response = await fetch(`${API_URL}/books`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message || 'Failed to add book');
                }
                
                showMessage('Book added successfully');
                addBookForm.reset();
                loadBooks();
            } catch (error) {
                console.error('Error adding book:', error);
                showMessage(error.message, true);
            } finally {
                setLoading(submitBtn, false);
            }
        });
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            setLoading(submitBtn, true);
            
            try {
                const formData = new FormData(loginForm);
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
                console.log('Login response:', data); // Debug log
                
                if (!data.token) {
                    throw new Error(data.message || 'No token received');
                }
                
                localStorage.setItem('token', data.token);
                showMessage('Login successful! Redirecting...');
                
                // Add a small delay before redirect to show the success message
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
            } catch (error) {
                console.error('Login error:', error);
                showMessage(error.message || 'Login failed. Please try again.', true);
            } finally {
                setLoading(submitBtn, false);
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            setLoading(submitBtn, true);
            
            try {
                const formData = new FormData(registerForm);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    membership_type: formData.get('membership_type')
                };
                
                console.log('Sending registration data:', userData);
                
                const response = await fetch(`${API_URL}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                
                const data = await response.json();
                console.log('Registration response:', data);
                
                if (!data.success && !data.token) {
                    throw new Error(data.message || 'Registration failed');
                }
                
                showMessage('Registration successful! Redirecting...');
                localStorage.setItem('token', data.token);
                
                // Add delay before redirect to show success message
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } catch (error) {
                console.error('Registration error:', error);
                showMessage(error.message || 'Registration failed. Please try again.', true);
            } finally {
                setLoading(submitBtn, false);
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

// Add this function to verify token validity
function isValidToken(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationDate = new Date(payload.exp * 1000);
        return expirationDate > new Date();
    } catch {
        return false;
    }
}
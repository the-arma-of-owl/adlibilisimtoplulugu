// Admin credentials are handled server-side

// State
let isLoggedIn = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    initializeLogin();
    initializeDashboard();
});

function checkLoginStatus() {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (loggedIn) {
        isLoggedIn = true;
        showDashboard();
    } else {
        showLogin();
    }
}

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('adminLoggedIn', 'true');
                isLoggedIn = true;
                showDashboard();
                loadUsers();
            } else {
                errorDiv.textContent = data.error || 'Hatalı kullanıcı adı veya şifre';
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            errorDiv.textContent = 'Sunucu hatası. Lütfen tekrar deneyin.';
            errorDiv.classList.remove('hidden');
        }
    });
}

function initializeDashboard() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        isLoggedIn = false;
        showLogin();
    });
    
    // Quick add form
    const quickAddForm = document.getElementById('quickAddForm');
    if (quickAddForm) {
        quickAddForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('testUserName').value.trim();
            const field = document.getElementById('testUserField').value;
            
            if (!name || !field) {
                alert('Lütfen tüm alanları doldurun');
                return;
            }
            
            try {
                const response = await fetch('/api/admin/add-test-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, field })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Clear form
                    document.getElementById('testUserName').value = '';
                    document.getElementById('testUserField').value = '';
                    
                    // Reload users
                    loadUsers();
                } else {
                    alert('Kullanıcı eklenirken hata oluştu: ' + (data.error || 'Bilinmeyen hata'));
                }
            } catch (error) {
                alert('Sunucu hatası. Lütfen tekrar deneyin.');
            }
        });
    }
}

function showLogin() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    if (isLoggedIn) {
        loadUsers();
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        
        if (data.users) {
            displayUsers(data.users);
            updateStats(data.users);
        }
    } catch (error) {
        // Error loading users
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #888;">Henüz kullanıcı bulunmuyor</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        const statusClass = user.approved ? 'status-approved' : 'status-pending';
        const statusText = user.approved ? 'Onaylı' : 'Beklemede';
        
        const date = new Date(user.timestamp);
        const formattedDate = date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const testBadge = user.isTestUser ? '<span class="test-user-badge">⚠️ Test için eklendi</span>' : '';
        
        row.innerHTML = `
            <td>${escapeHtml(user.name)} ${testBadge}</td>
            <td><span class="field-badge">${escapeHtml(user.field)}</span></td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-approve" 
                            onclick="approveUser('${user.id}')" 
                            ${user.approved ? 'disabled' : ''}>
                        Onayla
                    </button>
                    <button class="btn-action btn-delete" 
                            onclick="deleteUser('${user.id}')">
                        Sil
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function updateStats(users) {
    const total = users.length;
    const approved = users.filter(u => u.approved).length;
    const pending = total - approved;
    
    document.getElementById('totalUsers').textContent = total;
    document.getElementById('approvedUsers').textContent = approved;
    document.getElementById('pendingUsers').textContent = pending;
}

async function approveUser(userId) {
    try {
        const response = await fetch(`/api/admin/approve/${userId}`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadUsers();
        } else {
            alert('Onaylama işlemi başarısız oldu.');
        }
    } catch (error) {
        alert('Sunucu hatası. Lütfen tekrar deneyin.');
    }
}

async function deleteUser(userId) {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/delete/${userId}`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadUsers();
        } else {
            alert('Silme işlemi başarısız oldu.');
        }
    } catch (error) {
        alert('Sunucu hatası. Lütfen tekrar deneyin.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available for onclick handlers
window.approveUser = approveUser;
window.deleteUser = deleteUser;


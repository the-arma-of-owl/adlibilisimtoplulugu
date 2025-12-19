// Field mapping
const fieldMap = {
    'Digital Forensics': 0,
    'Offensive Security': 1,
    'Defensive Security': 2,
    'Network Security': 3,
    'Sosyal Mühendislik': 4,
    'Cyber Threat Intelligence': 5
};

// State
let currentMode = null; // 'individual' or 'combined'
let currentSection = 0; // For individual mode
let namePositions = new Map();
let refreshInterval = null; // Store interval to clear it later

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeSelection();
});

function initializeSelection() {
    const selectionBtns = document.querySelectorAll('.selection-btn');
    
    if (selectionBtns.length === 0) {
        setTimeout(initializeSelection, 300);
        return;
    }
    
    selectionBtns.forEach((btn) => {
        const mode = btn.getAttribute('data-mode');
        
        // Simple click handler
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (mode) {
                startMode(mode);
            }
        };
    });
}

function startMode(mode) {
    currentMode = mode;
    
    const selectionScreen = document.getElementById('selectionScreen');
    if (selectionScreen) {
        selectionScreen.classList.add('hidden');
    }
    
    // Clear any existing interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
    
    if (mode === 'individual') {
        const combinedMode = document.getElementById('combinedMode');
        const individualMode = document.getElementById('individualMode');
        const individualNav = document.getElementById('individualNav');
        
        if (combinedMode) combinedMode.classList.add('hidden');
        if (individualMode) individualMode.classList.remove('hidden');
        if (individualNav) individualNav.classList.remove('hidden');
        
        currentSection = 0;
        showIndividualSection(0);
        initializeIndividualNav();
    } else {
        const individualMode = document.getElementById('individualMode');
        const individualNav = document.getElementById('individualNav');
        const combinedMode = document.getElementById('combinedMode');
        
        if (individualMode) individualMode.classList.add('hidden');
        if (individualNav) individualNav.classList.add('hidden');
        if (combinedMode) combinedMode.classList.remove('hidden');
    }
    
    // Clear existing name positions when switching modes
    namePositions.clear();
    
    // Load users immediately
    loadUsers();
    // Then refresh every 5 seconds
    refreshInterval = setInterval(loadUsers, 5000);
}

function initializeIndividualNav() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach((btn, index) => {
        btn.onclick = function() {
            const sectionIndex = parseInt(this.getAttribute('data-section'));
            showIndividualSection(sectionIndex);
        };
    });
}

function showIndividualSection(sectionIndex) {
    currentSection = sectionIndex;
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        if (index === sectionIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Hide all individual sections
    for (let i = 0; i < 6; i++) {
        const section = document.getElementById(`section-${i}-individual`);
        if (section) {
            section.classList.add('hidden');
        }
    }
    
    // Show current section
    const currentSectionEl = document.getElementById(`section-${sectionIndex}-individual`);
    if (currentSectionEl) {
        currentSectionEl.classList.remove('hidden');
    }
    
    // Reload users for this section
    loadUsers();
}

async function loadUsers() {
    try {
        const response = await fetch('/api/codefest/users');
        const data = await response.json();
        
        if (data.users) {
            updateUsers(data.users);
        }
    } catch (error) {
        // Error loading users
    }
}

function updateUsers(users) {
    if (currentMode === 'individual') {
        // Show only current section
        const sectionUsers = users.filter(u => {
            const userFieldIndex = fieldMap[u.field];
            return userFieldIndex !== undefined && userFieldIndex === currentSection;
        });
        updateSection(currentSection, sectionUsers);
    } else {
        // Show all sections
        for (let fieldIndex = 0; fieldIndex < 6; fieldIndex++) {
            const sectionUsers = users.filter(u => {
                const userFieldIndex = fieldMap[u.field];
                return userFieldIndex !== undefined && userFieldIndex === fieldIndex;
            });
            updateSection(fieldIndex, sectionUsers);
        }
    }
}

function updateSection(fieldIndex, sectionUsers) {
    // Get the correct container based on mode
    let container;
    if (currentMode === 'individual') {
        container = document.getElementById(`container-${fieldIndex}-individual`);
    } else {
        container = document.getElementById(`container-${fieldIndex}`);
    }
    if (!container) {
        return;
    }
    
    const existingUsers = Array.from(container.querySelectorAll('.name-tag')).map(el => el.dataset.userId);
    const newUserIds = sectionUsers.map(u => u.id);
    
    // Remove users that are no longer in the list
    existingUsers.forEach(userId => {
        if (!newUserIds.includes(userId)) {
            const element = container.querySelector(`[data-user-id="${userId}"]`);
            if (element) {
                element.remove();
            }
            namePositions.delete(userId);
        }
    });
    
    // Add or update existing users
    sectionUsers.forEach((user) => {
        let nameTag = container.querySelector(`[data-user-id="${user.id}"]`);
        
        if (!nameTag) {
            nameTag = createNameTag(user, container);
            container.appendChild(nameTag);
        }
    });
}

// Helper function to check if position overlaps with existing tags
function isPositionOverlapping(x, y, tagWidth, tagHeight, existingPositions, minDistance) {
    for (let [userId, pos] of existingPositions) {
        const dx = x - pos.x;
        const dy = y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
            return true;
        }
    }
    return false;
}

// Helper function to find a non-overlapping position - MORE RANDOM DISTRIBUTION
function findNonOverlappingPosition(containerWidth, containerHeight, tagWidth, tagHeight, existingPositions, maxAttempts = 100) {
    const minDistance = Math.max(tagWidth, tagHeight) * 1.2; // Slightly less distance for better distribution
    const padding = 20;
    
    // Create a grid of possible positions for better distribution
    const gridCols = Math.floor(containerWidth / (tagWidth + minDistance));
    const gridRows = Math.floor(containerHeight / (tagHeight + minDistance));
    
    // Try random positions across the entire container (not just center)
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        let x, y;
        
        // More random distribution - use different strategies
        if (attempt < maxAttempts * 0.3) {
            // First 30%: Completely random across entire area
            x = padding + Math.random() * (containerWidth - tagWidth - padding * 2);
            y = padding + Math.random() * (containerHeight - tagHeight - padding * 2);
        } else if (attempt < maxAttempts * 0.6) {
            // Next 30%: Random but avoid exact center
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;
            const avoidRadius = Math.min(containerWidth, containerHeight) * 0.2;
            do {
                x = padding + Math.random() * (containerWidth - tagWidth - padding * 2);
                y = padding + Math.random() * (containerHeight - tagHeight - padding * 2);
            } while (Math.abs(x - centerX) < avoidRadius && Math.abs(y - centerY) < avoidRadius);
        } else if (attempt < maxAttempts * 0.8) {
            // Next 20%: Grid-based random
            const col = Math.floor(Math.random() * gridCols);
            const row = Math.floor(Math.random() * gridRows);
            x = padding + col * (tagWidth + minDistance) + Math.random() * tagWidth * 0.3;
            y = padding + row * (tagHeight + minDistance) + Math.random() * tagHeight * 0.3;
        } else {
            // Last 20%: Edge areas (corners and edges)
            const side = Math.floor(Math.random() * 4);
            if (side === 0) { // Top
                x = padding + Math.random() * (containerWidth - tagWidth - padding * 2);
                y = padding + Math.random() * (containerHeight * 0.2);
            } else if (side === 1) { // Right
                x = containerWidth - tagWidth - padding - Math.random() * (containerWidth * 0.2);
                y = padding + Math.random() * (containerHeight - tagHeight - padding * 2);
            } else if (side === 2) { // Bottom
                x = padding + Math.random() * (containerWidth - tagWidth - padding * 2);
                y = containerHeight - tagHeight - padding - Math.random() * (containerHeight * 0.2);
            } else { // Left
                x = padding + Math.random() * (containerWidth * 0.2);
                y = padding + Math.random() * (containerHeight - tagHeight - padding * 2);
            }
        }
        
        // Clamp to bounds
        x = Math.max(padding, Math.min(x, containerWidth - tagWidth - padding));
        y = Math.max(padding, Math.min(y, containerHeight - tagHeight - padding));
        
        // Check if this position overlaps
        if (!isPositionOverlapping(x, y, tagWidth, tagHeight, existingPositions, minDistance)) {
            return { x, y };
        }
    }
    
    // If all attempts failed, return a random position anyway
    return {
        x: padding + Math.random() * (containerWidth - tagWidth - padding * 2),
        y: padding + Math.random() * (containerHeight - tagHeight - padding * 2)
    };
}

function createNameTag(user, container) {
    const nameTag = document.createElement('div');
    nameTag.className = 'name-tag';
    nameTag.textContent = user.name;
    nameTag.dataset.userId = user.id;
    nameTag.dataset.field = user.field; // Add field for color styling
    
    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width - 20;
    const containerHeight = containerRect.height - 20;
    const tagWidth = 180; // Increased for larger font
    const tagHeight = 60; // Increased for larger padding
    
    // Get or create initial position
    let position = namePositions.get(user.id);
    if (!position) {
        // Get all existing positions in this container
        const existingPositions = new Map();
        const existingTags = container.querySelectorAll('.name-tag');
        existingTags.forEach(tag => {
            const existingUserId = tag.dataset.userId;
            const existingPos = namePositions.get(existingUserId);
            if (existingPos) {
                existingPositions.set(existingUserId, existingPos);
            }
        });
        
        // Find a non-overlapping position with better random distribution
        const startPos = findNonOverlappingPosition(
            containerWidth, 
            containerHeight, 
            tagWidth, 
            tagHeight, 
            existingPositions
        );
        
        position = {
            x: startPos.x,
            y: startPos.y,
            // Random direction for movement
            directionX: Math.random() > 0.5 ? 1 : -1,
            directionY: Math.random() > 0.5 ? 1 : -1,
            speedX: 0.3 + Math.random() * 0.4, // 0.3 to 0.7
            speedY: 0.3 + Math.random() * 0.4,
            // Glow animation
            glowPhase: Math.random() * Math.PI * 2,
            glowSpeed: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
            lastUpdate: Date.now()
        };
        namePositions.set(user.id, position);
    }
    
    // Set initial position
    nameTag.style.left = position.x + 'px';
    nameTag.style.top = position.y + 'px';
    
    // Start floating animation
    animateNameTag(nameTag, user.id, container, containerWidth, containerHeight);
    
    return nameTag;
}

function animateNameTag(nameTag, userId, container, maxWidth, maxHeight) {
    const tagWidth = 180; // Increased for larger font
    const tagHeight = 60; // Increased for larger padding
    const padding = 20; // Padding from edges
    let lastTime = Date.now();
    
    function animate(currentTime) {
        if (!nameTag.parentElement) return;
        
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        let position = namePositions.get(userId);
        if (!position) return;
        
        // Update position - smooth horizontal and vertical movement
        position.x += position.directionX * position.speedX * deltaTime * 30;
        position.y += position.directionY * position.speedY * deltaTime * 30;
        
        // Bounce off edges (with padding)
        if (position.x <= padding) {
            position.x = padding;
            position.directionX = 1;
        } else if (position.x >= maxWidth - tagWidth - padding) {
            position.x = maxWidth - tagWidth - padding;
            position.directionX = -1;
        }
        
        if (position.y <= padding) {
            position.y = padding;
            position.directionY = 1;
        } else if (position.y >= maxHeight - tagHeight - padding) {
            position.y = maxHeight - tagHeight - padding;
            position.directionY = -1;
        }
        
        // Update glow animation - subtle for projection readability
        position.glowPhase += position.glowSpeed * deltaTime;
        const glowIntensity = 0.85 + Math.sin(position.glowPhase) * 0.15; // 0.85 to 1.0 (less variation for better readability)
        
        // Update DOM
        nameTag.style.left = position.x + 'px';
        nameTag.style.top = position.y + 'px';
        nameTag.style.opacity = glowIntensity; // Keep high opacity for projection
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate positions for all name tags
        for (let fieldIndex = 0; fieldIndex < 6; fieldIndex++) {
            let container;
            if (currentMode === 'individual') {
                container = document.getElementById(`container-${fieldIndex}-individual`);
            } else {
                container = document.getElementById(`container-${fieldIndex}`);
            }
            if (!container) continue;
            
            const containerRect = container.getBoundingClientRect();
            const containerWidth = containerRect.width - 20;
            const containerHeight = containerRect.height - 20;
            
            const nameTags = container.querySelectorAll('.name-tag');
            nameTags.forEach(nameTag => {
                const userId = nameTag.dataset.userId;
                const position = namePositions.get(userId);
                if (position) {
                    // Clamp position to new boundaries
                    position.x = Math.min(position.x, containerWidth - 180);
                    position.y = Math.min(position.y, containerHeight - 60);
                    position.x = Math.max(20, position.x);
                    position.y = Math.max(20, position.y);
                }
            });
        }
    }, 250);
});

// ===== DATA STRUCTURES =====

// Stack for navigation history
class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }
}

// Queue for notifications
class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    front() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }
}

// Linked List for user activity tracking
class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    add(data) {
        const node = new ListNode(data);
        if (!this.head) {
            this.head = node;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.size++;
    }

    remove(data) {
        let current = this.head;
        let previous = null;

        while (current) {
            if (current.data === data) {
                if (previous) {
                    previous.next = current.next;
                } else {
                    this.head = current.next;
                }
                this.size--;
                return true;
            }
            previous = current;
            current = current.next;
        }
        return false;
    }

    toArray() {
        const array = [];
        let current = this.head;
        while (current) {
            array.push(current.data);
            current = current.next;
        }
        return array;
    }
}

// ===== APPLICATION INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Date Display
    updateDateDisplay();
    
    // Initialize Theme
    initTheme();
    
    // Initialize Navigation
    initNavigation();
    
    // Initialize Notifications
    initNotifications();
    
    // Initialize Search
    initSearch();
    
    // Initialize Mobile Menu
    initMobileMenu();
    
    // Initialize User Profile Dropdown
    initUserProfile();
    
    // Initialize Active Page Highlighting
    highlightActivePage();
});

// ===== DATE DISPLAY =====
function updateDateDisplay() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.querySelector('span').textContent = 
            now.toLocaleDateString('en-US', options);
    }
}

// ===== THEME MANAGEMENT =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Apply new theme
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Show notification
        showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`);
        
        // Animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
}

// ===== IMPROVED DROPDOWN NAVIGATION =====
function initNavigation() {
    // Handle dropdown toggles
    const dropdownHeaders = document.querySelectorAll('.dropdown-header');
    
    dropdownHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.nav-dropdown');
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            const chevron = dropdown.querySelector('.dropdown-chevron');
            
            // Check if this dropdown is already open
            const isAlreadyOpen = dropdownMenu.classList.contains('show');
            
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                }
            });
            
            document.querySelectorAll('.dropdown-chevron').forEach(chev => {
                if (chev !== chevron) {
                    chev.style.transform = '';
                }
            });
            
            document.querySelectorAll('.dropdown-header').forEach(hdr => {
                if (hdr !== header) {
                    hdr.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            if (!isAlreadyOpen) {
                dropdownMenu.classList.add('show');
                chevron.style.transform = 'rotate(180deg)';
                this.classList.add('active');
            } else {
                dropdownMenu.classList.remove('show');
                chevron.style.transform = '';
                this.classList.remove('active');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
            
            document.querySelectorAll('.dropdown-chevron').forEach(chevron => {
                chevron.style.transform = '';
            });
            
            document.querySelectorAll('.dropdown-header').forEach(header => {
                header.classList.remove('active');
            });
        }
    });
    
    // Handle active states
    highlightActivePage();
}

// ===== NOTIFICATION SYSTEM =====
function initNotifications() {
    // Initialize notification queue
    const notificationQueue = new Queue();
    
    // Add sample notifications
    notificationQueue.enqueue({ 
        id: 1, 
        message: 'New event: Alumni Reunion 2024',
        type: 'event'
    });
    notificationQueue.enqueue({ 
        id: 2, 
        message: 'Survey: Alumni Feedback 2024',
        type: 'survey'
    });
    notificationQueue.enqueue({ 
        id: 3, 
        message: 'Reminder: Complete your profile',
        type: 'reminder'
    });
    
    // Initialize user activities list
    const userActivities = new LinkedList();
    userActivities.add({
        action: 'Login',
        page: 'Dashboard',
        timestamp: new Date()
    });
    
    // Notification bell click handler
    const notificationBell = document.querySelector('.notification-bell');
    const notificationCount = document.querySelector('.notification-count');
    
    function updateNotificationCount() {
        if (notificationCount) {
            notificationCount.textContent = notificationQueue.size();
            
            if (notificationQueue.isEmpty()) {
                notificationCount.style.display = 'none';
            } else {
                notificationCount.style.display = 'flex';
            }
        }
    }
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            const nextNotification = notificationQueue.dequeue();
            if (nextNotification) {
                showNotificationModal(nextNotification);
                updateNotificationCount();
                userActivities.add({
                    action: 'Viewed Notification',
                    notification: nextNotification.message,
                    timestamp: new Date()
                });
            } else {
                showToast('No new notifications');
            }
            
            // Animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    // Initialize notification count
    updateNotificationCount();
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (!searchInput) return;
    
    // Search history using Stack
    const searchHistory = new Stack();
    
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = '';
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                // Add to search history
                searchHistory.push({
                    term: searchTerm,
                    timestamp: new Date()
                });
                
                // Show search results
                showToast(`Searching for: "${searchTerm}"`);
                
                // Clear input
                setTimeout(() => {
                    this.value = '';
                }, 500);
            }
        }
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!mobileMenuToggle || !sidebar) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mobileMenuToggle.innerHTML = sidebar.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
        
        // Animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// ===== USER PROFILE =====
function initUserProfile() {
    const userProfile = document.querySelector('.user-profile');
    
    if (!userProfile) return;
    
    userProfile.addEventListener('click', function(e) {
        e.stopPropagation();
        showProfileDropdown();
        
        // Animation
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
}

// ===== UTILITY FUNCTIONS =====
function highlightActivePage() {
    // Get current page from URL
    const currentPath = window.location.pathname;
    let currentPage = currentPath.split('/').pop();
    
    // Default to index.html if no page specified
    if (!currentPage || currentPage === '') {
        currentPage = 'index.html';
    }
    
    // Remove active class from all items
    document.querySelectorAll('.nav-item, .dropdown-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current page
    const activeLinks = document.querySelectorAll(`[href*="${currentPage}"], [href="index.html"]`);
    
    activeLinks.forEach(link => {
        if (link.href === window.location.href || 
            (currentPage === 'index.html' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
            
            // If it's in a dropdown, also activate the dropdown
            const dropdown = link.closest('.nav-dropdown');
            if (dropdown) {
                dropdown.querySelector('.dropdown-header').classList.add('active');
                dropdown.querySelector('.dropdown-menu').classList.add('show');
                dropdown.querySelector('.dropdown-chevron').style.transform = 'rotate(180deg)';
            }
        }
    });
}

function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    const toastStyle = `
        .custom-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--card-bg);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 10px;
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 12px var(--shadow-color);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            animation: toastSlideIn 0.3s ease;
        }
        
        @keyframes toastSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes toastSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .custom-toast .toast-content i {
            color: var(--primary-color);
        }
    `;
    
    // Add style tag if not exists
    let styleTag = document.getElementById('toast-styles');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'toast-styles';
        styleTag.textContent = toastStyle;
        document.head.appendChild(styleTag);
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function showNotificationModal(notification) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5><i class="fas fa-bell"></i> Notification</h5>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p>${notification.message}</p>
                <small>Just now</small>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary mark-read">Mark as Read</button>
                <button class="btn btn-secondary close-modal">Close</button>
            </div>
        </div>
    `;
    
    // Add styles
    const modalStyle = `
        .notification-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9998;
            animation: fadeIn 0.3s ease;
        }
        
        .notification-modal .modal-content {
            background: var(--card-bg);
            padding: 20px;
            border-radius: 10px;
            max-width: 400px;
            width: 90%;
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 20px var(--shadow-color);
        }
        
        .notification-modal .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .notification-modal .modal-header h5 {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0;
        }
        
        .notification-modal .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-secondary);
        }
        
        .notification-modal .modal-body {
            margin-bottom: 20px;
        }
        
        .notification-modal .modal-body p {
            margin-bottom: 10px;
        }
        
        .notification-modal .modal-body small {
            color: var(--text-secondary);
            font-size: 12px;
        }
        
        .notification-modal .modal-footer {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    // Add style tag if not exists
    let modalStyleTag = document.getElementById('modal-styles');
    if (!modalStyleTag) {
        modalStyleTag = document.createElement('style');
        modalStyleTag.id = 'modal-styles';
        modalStyleTag.textContent = modalStyle;
        document.head.appendChild(modalStyleTag);
    }
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.mark-read').addEventListener('click', () => {
        showToast('Notification marked as read');
        modal.remove();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showProfileDropdown() {
    // Remove existing dropdown
    const existingDropdown = document.querySelector('.profile-dropdown');
    if (existingDropdown) existingDropdown.remove();
    
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown';
    dropdown.innerHTML = `
        <a href="#" class="profile-link"><i class="fas fa-user"></i> My Profile</a>
        <a href="#" class="profile-link"><i class="fas fa-cog"></i> Account Settings</a>
        <a href="#" class="profile-link"><i class="fas fa-sign-out-alt"></i> Logout</a>
    `;
    
    // Position it below the profile
    const profile = document.querySelector('.user-profile');
    const rect = profile.getBoundingClientRect();
    
    // Add styles
    const dropdownStyle = `
        .profile-dropdown {
            position: fixed;
            top: ${rect.bottom + 10}px;
            right: ${window.innerWidth - rect.right}px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            box-shadow: 0 4px 20px var(--shadow-color);
            width: 200px;
            z-index: 9999;
            animation: fadeIn 0.2s ease;
            overflow: hidden;
        }
        
        .profile-dropdown .profile-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            color: var(--text-primary);
            text-decoration: none;
            transition: all 0.2s;
            border-bottom: 1px solid var(--border-color);
        }
        
        .profile-dropdown .profile-link:hover {
            background: var(--hover-bg);
            color: var(--primary-color);
        }
        
        .profile-dropdown .profile-link:last-child {
            border-bottom: none;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    
    // Add style tag if not exists
    let dropdownStyleTag = document.getElementById('dropdown-styles');
    if (!dropdownStyleTag) {
        dropdownStyleTag = document.createElement('style');
        dropdownStyleTag.id = 'dropdown-styles';
        dropdownStyleTag.textContent = dropdownStyle;
        document.head.appendChild(dropdownStyleTag);
    }
    
    document.body.appendChild(dropdown);
    
    // Add click handlers
    dropdown.querySelectorAll('.profile-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showToast(`${this.textContent.trim()} clicked`);
            dropdown.remove();
        });
    });
    
    // Close dropdown when clicking outside
    const closeDropdown = function(e) {
        if (!dropdown.contains(e.target) && !profile.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeDropdown);
    }, 10);
}

// ===== PAGE-SPECIFIC FUNCTIONS =====
// These functions can be called from individual page files

function initDonationTable() {
    const tableRows = document.querySelectorAll('.donation-table tbody tr');
    if (tableRows.length === 0) return;
    
    // Add hover effects
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

function initEventRegistration() {
    const registerButtons = document.querySelectorAll('.register-event-btn');
    if (registerButtons.length === 0) return;
    
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventName = this.closest('tr').querySelector('td:first-child').textContent;
            showToast(`Registered for: ${eventName}`);
            this.disabled = true;
            this.textContent = 'Registered';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
        });
    });
}

// Export functions for use in page files
window.App = {
    showToast,
    initDonationTable,
    initEventRegistration
};
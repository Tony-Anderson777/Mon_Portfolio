// script.js

// Function to navigate between pages (sections)
function navigateTo(page) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('selected'));

    // Show the selected page
    const selectedPage = document.getElementById(page);
    if (selectedPage) {
        selectedPage.classList.add('selected');
    } else {
        console.error('Page not found: ' + page);
    }

    // Use History API to update the URL without reloading
    window.history.pushState({ page: page }, '', `#${page}`);
}

// Event listener for the back button (to handle browser navigation)
window.onpopstate = function(event) {
    if (event.state && event.state.page) {
        navigateTo(event.state.page);
    }
};

// Initialize page based on the URL (handle direct access to a specific section)
window.onload = function() {
    const page = window.location.hash.replace('#', '') || 'home'; // Default to 'home' page
    navigateTo(page);
};


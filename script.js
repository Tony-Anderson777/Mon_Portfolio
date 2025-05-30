// script.js

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
        // Fallback to home if page not found, or handle error appropriately
        document.getElementById('home').classList.add('selected');
        window.history.pushState({ page: 'home' }, '', `#home`); // Update history for fallback
    }

    // Update active state in navigation
    const navLinks = document.querySelectorAll('nav ul li a.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${page}`) {
            link.classList.add('active');
        }
    });

    // Use History API to update the URL without reloading
    // Only push state if the page is valid and different from current state (to avoid cluttering history)
    if (selectedPage && (window.history.state == null || window.history.state.page !== page)) {
        window.history.pushState({ page: page }, '', `#${page}`);
    }
}

// Event listener for the back/forward button (to handle browser navigation)
window.onpopstate = function(event) {
    if (event.state && event.state.page) {
        navigateTo(event.state.page);
    } else {
        // If no state, might be initial load or navigating to a non-tracked hash
        const initialPage = window.location.hash.replace('#', '') || 'home';
        navigateTo(initialPage);
    }
};

// Initialize page based on the URL (handle direct access to a specific section)
window.onload = function() {
    const page = window.location.hash.replace('#', '') || 'home'; // Default to 'home' page
    navigateTo(page);
};


document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission HTML normale

    const myForm = event.target;
    const formData = new FormData(myForm);

    // NOUVELLE VERSION AJAX (CORRECTE POUR LES FICHIERS)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const myForm = event.target;
        const formData = new FormData(myForm); // FormData gère automatiquement les fichiers

        fetch("/", { // Ou myForm.action si vous avez défini une action
            method: "POST",
            // PAS D'EN-TÊTE Content-Type ICI, le navigateur s'en charge
            body: formData, // Envoyez directement l'objet FormData
        })
        .then(response => {
            if (response.ok) {
                alert("Message envoyé avec succès ! Merci de m'avoir contacté.");
                myForm.reset();
            } else {
                // Gérer les erreurs de réponse (ex: Netlify renvoie une erreur)
                response.json().then(data => {
                    if (data && data.error) {
                        alert("Erreur de la part du serveur : " + data.error);
                    } else {
                        alert("Erreur lors de l'envoi du message. Code: " + response.status);
                    }
                }).catch(() => {
                    alert("Erreur lors de l'envoi du message. Code: " + response.status);
                });
            }
        })
        .catch((error) => {
            console.error("Erreur réseau lors de l'envoi du message:", error);
            alert("Erreur réseau lors de l'envoi du message. Veuillez vérifier votre connexion.");
        });
    });
}
});
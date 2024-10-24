// contact-us.js

// Initialize Google Map
function initContactMap() {
    // Store Location Coordinates
    const storeLocation = { lat: -1.292066, lng: 36.821945 }; // Example: Nairobi, Kenya

    const map = new google.maps.Map(document.getElementById("contact-map"), {
        zoom: 15,
        center: storeLocation,
    });

    // Marker for the Store
    const marker = new google.maps.Marker({
        position: storeLocation,
        map: map,
        title: "Guava Electronics Store",
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
        }
    });

    // Info Window for the Marker
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div>
                <h5>Guava Electronics Store</h5>
                <p>123 Main Street, Nairobi, Kenya</p>
                <p><strong>Phone:</strong> +254710599234</p>
                <p><strong>Email:</strong> <a href="mailto:info@guava.co.ke">info@guava.co.ke</a></p>
            </div>
        `
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });
}

// Function to handle Contact Form Submission
function handleContactForm(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Basic Validation
    if (name === "" || email === "" || subject === "" || message === "") {
        alert("Please fill out all fields.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Simulate Form Submission
    // In a real-world scenario, you would send this data to your server via AJAX or a form submission
    console.log("Contact Form Submission:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Subject:", subject);
    console.log("Message:", message);

    // Display Success Message
    alert("Thank you for contacting us! We will get back to you shortly.");

    // Reset the Form
    document.getElementById('contact-form').reset();
}

// Function to validate email using regex
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}

// Initialize the Contact Us Page
function initializeContactUsPage() {
    initContactMap();

    // Add Event Listener to Contact Form
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleContactForm);
}

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', initializeContactUsPage);

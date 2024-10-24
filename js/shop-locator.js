// shop-locator.js

// Sample Store Data
const stores = [
    {
        id: 1,
        name: "Guava Electronics - Nairobi",
        address: "123 Main Street, Nairobi, Kenya",
        phone: "+254710599234",
        email: "nairobi@guava.co.ke",
        hours: "Mon-Fri: 9:00 AM - 6:00 PM",
        lat: -1.292066,
        lng: 36.821945
    },
    {
        id: 2,
        name: "Guava Electronics - Mombasa",
        address: "456 Beach Road, Mombasa, Kenya",
        phone: "+254703849399",
        email: "mombasa@guava.co.ke",
        hours: "Mon-Sat: 10:00 AM - 7:00 PM",
        lat: -4.043477,
        lng: 39.668206
    },
    {
        id: 3,
        name: "Guava Electronics - Kisumu",
        address: "789 Lake View Avenue, Kisumu, Kenya",
        phone: "+254700112233",
        email: "kisumu@guava.co.ke",
        hours: "Mon-Fri: 9:00 AM - 6:00 PM",
        lat: -0.091702,
        lng: 34.768047
    },
    {
        id: 4,
        name: "Guava Electronics - Eldoret",
        address: "321 High Street, Eldoret, Kenya",
        phone: "+254701445566",
        email: "eldoret@guava.co.ke",
        hours: "Mon-Sat: 10:00 AM - 7:00 PM",
        lat: 0.514311,
        lng: 35.269789
    },
    // Add more stores as needed
];

// Initialize Google Map
let map;
const markers = [];

function initMap() {
    // Center the map at the geographical center of Kenya
    const kenyaCenter = { lat: -0.023559, lng: 37.906193 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: kenyaCenter,
    });

    // Add markers for each store
    stores.forEach(store => {
        const marker = new google.maps.Marker({
            position: { lat: store.lat, lng: store.lng },
            map: map,
            title: store.name,
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        });

        // Info Window for each marker
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <h5>${store.name}</h5>
                    <p><strong>Address:</strong> ${store.address}</p>
                    <p><strong>Phone:</strong> ${store.phone}</p>
                    <p><strong>Email:</strong> <a href="mailto:${store.email}">${store.email}</a></p>
                    <p><strong>Hours:</strong> ${store.hours}</p>
                </div>
            `
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    });
}

// Render Store List
function renderStoreList(filteredStores) {
    const storeListContainer = document.getElementById('store-list');
    storeListContainer.innerHTML = '';

    if (filteredStores.length === 0) {
        storeListContainer.innerHTML = `
            <p class="text-center">No stores found matching your search criteria.</p>
        `;
        return;
    }

    filteredStores.forEach(store => {
        const storeItem = document.createElement('div');
        storeItem.classList.add('store-item');

        storeItem.innerHTML = `
            <h5>${store.name}</h5>
            <p><strong>Address:</strong> ${store.address}</p>
            <p><strong>Phone:</strong> ${store.phone}</p>
            <p><strong>Email:</strong> <a href="mailto:${store.email}">${store.email}</a></p>
            <p><strong>Hours:</strong> ${store.hours}</p>
            <button class="btn btn-sm btn-primary" onclick="focusOnStore(${store.id})"><i class="bi bi-geo-alt-fill"></i> View on Map</button>
        `;

        storeListContainer.appendChild(storeItem);
    });
}

// Focus on a specific store on the map
function focusOnStore(storeId) {
    const store = stores.find(s => s.id === storeId);
    if (store) {
        map.setZoom(14);
        map.setCenter({ lat: store.lat, lng: store.lng });

        // Find the corresponding marker and trigger a click to open the info window
        const marker = markers.find(m => m.getTitle() === store.name);
        if (marker) {
            google.maps.event.trigger(marker, 'click');
        }
    }
}

// Handle Store Search
function handleStoreSearch() {
    const query = document.getElementById('store-search').value.trim().toLowerCase();
    if (query === '') {
        renderStoreList(stores);
        resetMarkers();
        return;
    }

    const filteredStores = stores.filter(store => {
        return store.name.toLowerCase().includes(query) ||
            store.address.toLowerCase().includes(query) ||
            store.phone.toLowerCase().includes(query) ||
            store.email.toLowerCase().includes(query);
    });

    renderStoreList(filteredStores);
    updateMarkers(filteredStores);
}

// Update Map Markers based on Filtered Stores
function updateMarkers(filteredStores) {
    // Hide all markers
    markers.forEach(marker => marker.setMap(null));

    // Show only filtered markers
    filteredStores.forEach(store => {
        const marker = markers.find(m => m.getTitle() === store.name);
        if (marker) {
            marker.setMap(map);
        }
    });
}

// Reset Markers to show all stores
function resetMarkers() {
    markers.forEach(marker => marker.setMap(map));
}

// Initialize Store Locator Page
function initializeStoreLocator() {
    initMap();
    renderStoreList(stores);

    // Event Listener for Search Input
    const searchInput = document.getElementById('store-search');
    searchInput.addEventListener('input', handleStoreSearch);
}

// Initialize the Store Locator on Page Load
document.addEventListener('DOMContentLoaded', initializeStoreLocator);

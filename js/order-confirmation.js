// order-confirmation.js

// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to load users from Local Storage
function loadUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Function to get the currently logged-in user
function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
}

// Function to display order confirmation details
function displayOrderConfirmation() {
    const orderNumber = getQueryParam('orderNumber');
    if (!orderNumber) {
        alert("No order number provided.");
        window.location.href = 'index.html';
        return;
    }

    const user = getLoggedInUser();
    if (!user) {
        alert("No user is logged in.");
        window.location.href = 'index.html';
        return;
    }

    // Find the order in user's order history
    const order = user.orders.find(o => o.orderNumber === orderNumber);
    if (!order) {
        alert("Order not found.");
        window.location.href = 'index.html';
        return;
    }

    // Populate order confirmation details
    document.getElementById('confirmation-order-number').innerText = order.orderNumber;
    document.getElementById('confirmation-order-date').innerText = order.orderDate;

    const orderItemsContainer = document.getElementById('confirmation-order-items');
    orderItemsContainer.innerHTML = '';

    order.items.forEach(item => {
        const tr = document.createElement('tr');

        // Product Image
        const tdImage = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        tdImage.appendChild(img);
        tr.appendChild(tdImage);

        // Product Name
        const tdName = document.createElement('td');
        tdName.innerText = item.name;
        tr.appendChild(tdName);

        // Quantity
        const tdQuantity = document.createElement('td');
        tdQuantity.innerText = item.quantity;
        tr.appendChild(tdQuantity);

        // Price
        const tdPrice = document.createElement('td');
        tdPrice.innerText = `KSh ${item.price.toLocaleString()}.00`;
        tr.appendChild(tdPrice);

        // Subtotal
        const tdSubtotal = document.createElement('td');
        tdSubtotal.innerText = `KSh ${item.subtotal.toLocaleString()}.00`;
        tr.appendChild(tdSubtotal);

        orderItemsContainer.appendChild(tr);
    });

    document.getElementById('confirmation-order-total').innerText = `${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Initialize the Order Confirmation Page on Load
document.addEventListener('DOMContentLoaded', function () {
    displayOrderConfirmation();
});

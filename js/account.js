// account.js

// Utility Functions

// Function to load users from Local Storage
function loadUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Function to save users to Local Storage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to get the currently logged-in user
function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
}

// Function to set the logged-in user
function setLoggedInUser(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
}

// Function to clear the logged-in user
function clearLoggedInUser() {
    localStorage.removeItem('loggedInUser');
}

// Function to handle user registration
function handleRegistration(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const phone = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Input Validation
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password should be at least 6 characters long.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!validatePhone(phone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    const users = loadUsers();

    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("An account with this email already exists.");
        return;
    }

    // Create new user object
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password, // Note: In production, passwords should be hashed
        orders: [],
        addresses: [],
        paymentMethods: [],
        wishlist: [],
        settings: {
            newsletter: 'subscribed',
            notifications: 'all'
        }
    };

    // Save to users array
    users.push(newUser);
    saveUsers(users);

    alert("Registration successful! Please login.");

    // Switch to Login tab
    const loginTab = new bootstrap.Tab(document.querySelector('#login-tab'));
    loginTab.show();

    // Reset registration form
    document.getElementById('register-form').reset();
}

// Function to handle user login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const users = loadUsers();

    // Find user with matching email and password
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        setLoggedInUser(user);
        alert("Login successful!");
        renderUserInterface();
    } else {
        alert("Invalid email or password.");
    }

    // Reset login form
    document.getElementById('login-form').reset();
}

// Function to handle profile updates
function handleProfileUpdate(event) {
    event.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim().toLowerCase();
    const phone = document.getElementById('profile-phone').value.trim();
    const password = document.getElementById('profile-password').value;
    const confirmPassword = document.getElementById('profile-confirm-password').value;

    // Input Validation
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (phone && !validatePhone(phone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    if (password) {
        if (password.length < 6) {
            alert("Password should be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
    }

    const users = loadUsers();
    const user = getLoggedInUser();

    // Check if the new email is already taken by another user
    const emailTaken = users.some(u => u.email === email && u.id !== user.id);
    if (emailTaken) {
        alert("This email is already in use by another account.");
        return;
    }

    // Update user details
    const updatedUser = { ...user, name, email, phone };
    if (password) {
        updatedUser.password = password;
    }
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    saveUsers(updatedUsers);
    setLoggedInUser(updatedUser);

    alert("Profile updated successfully!");

    // Re-render the interface to reflect changes
    renderUserInterface();
}

// Function to handle logout
function handleLogout() {
    clearLoggedInUser();
    alert("Logged out successfully!");
    // Reload the page to reset the state
    location.reload();
}

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Function to validate phone number format (simple validation)
function validatePhone(phone) {
    const re = /^\+?\d{7,15}$/;
    return re.test(phone);
}

// Function to render user interface after login
function renderUserInterface() {
    const user = getLoggedInUser();
    if (user) {
        // Hide login/register forms
        document.getElementById('auth-section').style.display = 'none';
        // Show account sections
        document.getElementById('account-section').style.display = 'block';

        // Populate profile information
        document.getElementById('profile-name').value = user.name;
        document.getElementById('profile-email').value = user.email;
        document.getElementById('profile-phone').value = user.phone;

        // Populate order history
        renderOrderHistory(user);

        // Populate address book
        renderAddressBook(user);

        // Populate payment methods
        renderPaymentMethods(user);

        // Populate wishlist
        renderWishlist(user);

        // Populate account settings
        renderAccountSettings(user);
    } else {
        // Show login/register forms
        document.getElementById('auth-section').style.display = 'block';
        // Hide account sections
        document.getElementById('account-section').style.display = 'none';
    }
}

// Function to render order history
function renderOrderHistory(user) {
    const orderHistoryTbody = document.getElementById('order-history');
    orderHistoryTbody.innerHTML = '';

    if (user.orders.length === 0) {
        orderHistoryTbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">You have no orders.</td>
            </tr>
        `;
        return;
    }

    user.orders.forEach(order => {
        const tr = document.createElement('tr');

        const tdOrderNumber = document.createElement('td');
        tdOrderNumber.innerText = `#${order.orderNumber}`;
        tr.appendChild(tdOrderNumber);

        const tdDate = document.createElement('td');
        tdDate.innerText = order.orderDate;
        tr.appendChild(tdDate);

        const tdTotal = document.createElement('td');
        tdTotal.innerText = `KSh ${order.total.toLocaleString()}.00`;
        tr.appendChild(tdTotal);

        const tdStatus = document.createElement('td');
        tdStatus.innerText = order.status;
        tr.appendChild(tdStatus);

        const tdDetails = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.classList.add('btn', 'btn-sm', 'btn-info');
        detailsButton.innerHTML = `<i class="bi bi-eye"></i> View`;
        detailsButton.addEventListener('click', () => {
            displayOrderDetails(order);
        });
        tdDetails.appendChild(detailsButton);
        tr.appendChild(tdDetails);

        orderHistoryTbody.appendChild(tr);
    });
}

// Function to display order details in a modal
function displayOrderDetails(order) {
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    const modalBody = document.querySelector('#orderDetailsModal .modal-body');

    modalBody.innerHTML = `
        <p><strong>Order Number:</strong> #${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${order.orderDate}</p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <hr>
        <h5>Items Ordered</h5>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead class="table-light">
                    <tr>
                        <th>Product</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td><img src="${item.image}" alt="${item.name}" style="width: 60px;"></td>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>KSh ${item.price.toLocaleString()}.00</td>
                            <td>KSh ${item.subtotal.toLocaleString()}.00</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="text-end">
            <h5>Total: KSh ${order.total.toLocaleString()}.00</h5>
        </div>
    `;

    modal.show();
}

// Function to render address book
function renderAddressBook(user) {
    const addressBookTbody = document.getElementById('address-book');
    addressBookTbody.innerHTML = '';

    if (user.addresses.length === 0) {
        addressBookTbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">You have no saved addresses.</td>
            </tr>
        `;
        return;
    }

    user.addresses.forEach(address => {
        const tr = document.createElement('tr');

        const tdAddress = document.createElement('td');
        tdAddress.innerText = address.details;
        tr.appendChild(tdAddress);

        const tdType = document.createElement('td');
        tdType.innerText = address.type;
        tr.appendChild(tdType);

        const tdActions = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
        editButton.innerHTML = `<i class="bi bi-pencil-square"></i> Edit`;
        editButton.addEventListener('click', () => {
            openEditAddressModal(address.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
        deleteButton.innerHTML = `<i class="bi bi-trash-fill"></i> Delete`;
        deleteButton.addEventListener('click', () => {
            deleteAddress(address.id);
        });

        tdActions.appendChild(editButton);
        tdActions.appendChild(deleteButton);
        tr.appendChild(tdActions);

        addressBookTbody.appendChild(tr);
    });
}

// Function to open edit address modal
function openEditAddressModal(addressId) {
    const user = getLoggedInUser();
    const address = user.addresses.find(addr => addr.id === addressId);
    if (!address) return;

    // Populate the add address modal with existing data
    document.getElementById('addAddressModalLabel').innerText = 'Edit Address';
    document.getElementById('address-type').value = address.type;
    document.getElementById('address-details').value = address.details;

    // Change form submission to update address
    const addAddressForm = document.getElementById('add-address-form');
    addAddressForm.removeEventListener('submit', handleAddAddress);
    addAddressForm.addEventListener('submit', function updateAddress(event) {
        event.preventDefault();
        const type = document.getElementById('address-type').value;
        const details = document.getElementById('address-details').value.trim();

        if (type === "" || details === "") {
            alert("Please fill out all fields.");
            return;
        }

        // Update address in user object
        const updatedUser = { ...user };
        const addrIndex = updatedUser.addresses.findIndex(addr => addr.id === addressId);
        if (addrIndex !== -1) {
            updatedUser.addresses[addrIndex].type = type;
            updatedUser.addresses[addrIndex].details = details;
            saveUsers(loadUsers().map(u => u.id === updatedUser.id ? updatedUser : u));
            setLoggedInUser(updatedUser);
            alert("Address updated successfully!");
            renderUserInterface();
            // Reset modal
            addAddressForm.removeEventListener('submit', updateAddress);
            addAddressForm.addEventListener('submit', handleAddAddress);
            const modal = bootstrap.Modal.getInstance(document.getElementById('addAddressModal'));
            modal.hide();
        }
    });

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('addAddressModal'));
    modal.show();
}

// Function to handle adding a new address
function handleAddAddress(event) {
    event.preventDefault();
    const type = document.getElementById('address-type').value;
    const details = document.getElementById('address-details').value.trim();

    if (type === "" || details === "") {
        alert("Please fill out all fields.");
        return;
    }

    const user = getLoggedInUser();
    const newAddress = {
        id: Date.now(),
        type,
        details
    };

    user.addresses.push(newAddress);
    const users = loadUsers();
    const updatedUsers = users.map(u => u.id === user.id ? u : u);
    saveUsers(updatedUsers);
    setLoggedInUser(user);

    alert("Address added successfully!");
    renderUserInterface();

    // Reset and hide the modal
    document.getElementById('add-address-form').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addAddressModal'));
    modal.hide();
}

// Function to delete an address
function deleteAddress(addressId) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    const user = getLoggedInUser();
    user.addresses = user.addresses.filter(addr => addr.id !== addressId);
    const users = loadUsers();
    const updatedUsers = users.map(u => u.id === user.id ? u : u);
    saveUsers(updatedUsers);
    setLoggedInUser(user);

    alert("Address deleted successfully!");
    renderUserInterface();
}

// Function to render payment methods
function renderPaymentMethods(user) {
    const paymentMethodsTbody = document.getElementById('payment-methods');
    paymentMethodsTbody.innerHTML = '';

    if (user.paymentMethods.length === 0) {
        paymentMethodsTbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">You have no saved payment methods.</td>
            </tr>
        `;
        return;
    }

    user.paymentMethods.forEach(method => {
        const tr = document.createElement('tr');

        const tdType = document.createElement('td');
        tdType.innerText = method.type;
        tr.appendChild(tdType);

        const tdDetails = document.createElement('td');
        tdDetails.innerText = method.details;
        tr.appendChild(tdDetails);

        const tdActions = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
        editButton.innerHTML = `<i class="bi bi-pencil-square"></i> Edit`;
        editButton.addEventListener('click', () => {
            openEditPaymentModal(method.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
        deleteButton.innerHTML = `<i class="bi bi-trash-fill"></i> Delete`;
        deleteButton.addEventListener('click', () => {
            deletePaymentMethod(method.id);
        });

        tdActions.appendChild(editButton);
        tdActions.appendChild(deleteButton);
        tr.appendChild(tdActions);

        paymentMethodsTbody.appendChild(tr);
    });
}

// Function to open edit payment method modal
function openEditPaymentModal(paymentId) {
    const user = getLoggedInUser();
    const payment = user.paymentMethods.find(pm => pm.id === paymentId);
    if (!payment) return;

    // Populate the add payment modal with existing data
    document.getElementById('addPaymentModalLabel').innerText = 'Edit Payment Method';
    document.getElementById('payment-type').value = payment.type;
    document.getElementById('payment-details').value = payment.details;

    // Change form submission to update payment method
    const addPaymentForm = document.getElementById('add-payment-form');
    addPaymentForm.removeEventListener('submit', handleAddPayment);
    addPaymentForm.addEventListener('submit', function updatePayment(event) {
        event.preventDefault();
        const type = document.getElementById('payment-type').value;
        const details = document.getElementById('payment-details').value.trim();

        if (type === "" || details === "") {
            alert("Please fill out all fields.");
            return;
        }

        // Update payment method in user object
        const updatedUser = { ...user };
        const pmIndex = updatedUser.paymentMethods.findIndex(pm => pm.id === paymentId);
        if (pmIndex !== -1) {
            updatedUser.paymentMethods[pmIndex].type = type;
            updatedUser.paymentMethods[pmIndex].details = details;
            saveUsers(loadUsers().map(u => u.id === updatedUser.id ? updatedUser : u));
            setLoggedInUser(updatedUser);
            alert("Payment method updated successfully!");
            renderUserInterface();
            // Reset modal
            addPaymentForm.removeEventListener('submit', updatePayment);
            addPaymentForm.addEventListener('submit', handleAddPayment);
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPaymentModal'));
            modal.hide();
        }
    });

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('addPaymentModal'));
    modal.show();
}

// Function to handle adding a new payment method
function handleAddPayment(event) {
    event.preventDefault();
    const type = document.getElementById('payment-type').value;
    const details = document.getElementById('payment-details').value.trim();

    if (type === "" || details === "") {
        alert("Please fill out all fields.");
        return;
    }

    const user = getLoggedInUser();
    const newPayment = {
        id: Date.now(),
        type,
        details
    };

    user.paymentMethods.push(newPayment);
    const users = loadUsers();
    const updatedUsers = users.map(u => u.id === user.id ? u : u);
    saveUsers(updatedUsers);
    setLoggedInUser(user);

    alert("Payment method added successfully!");
    renderUserInterface();

    // Reset and hide the modal
    document.getElementById('add-payment-form').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPaymentModal'));
    modal.hide();
}

// Function to delete a payment method
function deletePaymentMethod(paymentId) {
    if (!confirm("Are you sure you want to delete this payment method?")) return;

    const user = getLoggedInUser();
    user.paymentMethods = user.paymentMethods.filter(pm => pm.id !== paymentId);
    const users = loadUsers();
    const updatedUsers = users.map(u => u.id === user.id ? u : u);
    saveUsers(updatedUsers);
    setLoggedInUser(user);

    alert("Payment method deleted successfully!");
    renderUserInterface();
}

// Function to render wishlist
function renderWishlist(user) {
    const wishlistTbody = document.getElementById('wishlist-items');
    wishlistTbody.innerHTML = '';

    if (user.wishlist.length === 0) {
        wishlistTbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">Your wishlist is empty.</td>
            </tr>
        `;
        return;
    }

    user.wishlist.forEach(productId => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const tr = document.createElement('tr');

        const tdImage = document.createElement('td');
        const img = document.createElement('img');
        img.src = product.images[0];
        img.alt = product.name;
        img.style.width = '60px';
        tdImage.appendChild(img);
        tr.appendChild(tdImage);

        const tdName = document.createElement('td');
        tdName.innerText = product.name;
        tdName.classList.add('product-name');
        tr.appendChild(tdName);

        const tdPrice = document.createElement('td');
        tdPrice.innerText = `KSh ${product.currentPrice.toLocaleString()}.00`;
        tr.appendChild(tdPrice);

        const tdActions = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.classList.add('btn', 'btn-sm', 'btn-danger');
        removeButton.innerHTML = `<i class="bi bi-trash-fill"></i> Remove`;
        removeButton.addEventListener('click', () => {
            removeFromWishlist(productId);
        });
        tdActions.appendChild(removeButton);
        tr.appendChild(tdActions);

        wishlistTbody.appendChild(tr);
    });
}

// Function to add to wishlist (can be called from product pages)
function addToWishlist(productId) {
    const user = getLoggedInUser();
    if (!user) {
        alert("Please login to add items to your wishlist.");
        return;
    }

    if (user.wishlist.includes(productId)) {
        alert("This product is already in your wishlist.");
        return;
    }

    user.wishlist.push(productId);
    const users = loadUsers();
    const updatedUsers = users.map(u => u.id === user.id ? u : u);
    saveUsers(updatedUsers);
    setLoggedInUser(user);

    alert("Product added to your wishlist!");
    renderUserInterface();
}

// Function to remove from wishlist
function removeFromWishlist(productId) {
    const user = getLoggedInUser();
    user.wishlist = user.wishlist.filter(id => id !== productId);
    const users = loadUsers();
    const updatedUsers = users.map(u => u.id === user.id ? u : u);
    saveUsers(updatedUsers);
    setLoggedInUser(user);

    alert("Product removed from your wishlist!");
    renderUserInterface();
}

// Function to render account settings
function renderAccountSettings(user) {
    document.getElementById('newsletter-subscription').value = user.settings.newsletter;
    document.getElementById('notification-preferences').value = user.settings.notifications;
}

// Function to handle account settings update
function handleAccountSettingsUpdate(event) {
    event.preventDefault();
    const newsletter = document.getElementById('newsletter-subscription').value;
    const notifications = document.getElementById('notification-preferences').value;

    const user = getLoggedInUser();
    user.settings.newsletter = newsletter;
    user.settings.notifications = notifications;

    const users = loadUsers();
    const updatedUsers = users.map(u => u.id === user.id ? u : u);
    saveUsers(updatedUsers);
    setLoggedInUser(user);

    alert("Account settings updated successfully!");
    renderUserInterface();
}

// Function to populate mock orders for the user (for demonstration purposes)
function populateMockOrders(user) {
    // Check if the user already has orders
    if (user.orders.length > 0) return;

    // Sample mock orders
    const mockOrders = [
        {
            orderNumber: "ORD1001",
            orderDate: "October 10, 2024",
            shippingAddress: user.addresses.length > 0 ? user.addresses[0].details : "Nairobi, Kenya",
            paymentMethod: user.paymentMethods.length > 0 ? user.paymentMethods[0].details : "Credit Card",
            items: [
                {
                    name: "HP LaserJet Pro MFP M227fdw",
                    image: "./images/IMG-20241007-WA0017.jpg",
                    quantity: 1,
                    price: 32000,
                    subtotal: 32000
                },
                {
                    name: "Epson EcoTank L3150",
                    image: "./images/IMG-20241007-WA0018.jpg",
                    quantity: 2,
                    price: 21250,
                    subtotal: 42500
                }
            ],
            total: 74500,
            status: "Delivered",
            estimatedDelivery: "October 15, 2024"
        },
        {
            orderNumber: "ORD1002",
            orderDate: "September 25, 2024",
            shippingAddress: user.addresses.length > 0 ? user.addresses[0].details : "Nairobi, Kenya",
            paymentMethod: user.paymentMethods.length > 0 ? user.paymentMethods[0].details : "PayPal",
            items: [
                {
                    name: "Canon PIXMA MG3620",
                    image: "./images/IMG-20241007-WA0019.jpg",
                    quantity: 1,
                    price: 15000,
                    subtotal: 15000
                }
            ],
            total: 15000,
            status: "Shipped",
            estimatedDelivery: "October 2, 2024"
        }
    ];

    user.orders = mockOrders;
    const users = loadUsers();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    saveUsers(updatedUsers);
    setLoggedInUser(user);
}

// Function to initialize the account page
function initializeAccountPage() {
    const user = getLoggedInUser();
    if (user) {
        populateMockOrders(user); // Populate mock orders if none exist
        renderUserInterface();
    } else {
        renderUserInterface();
    }
}

// Event Listeners
document.getElementById('register-form').addEventListener('submit', handleRegistration);
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('update-profile-form').addEventListener('submit', handleProfileUpdate);
document.getElementById('account-settings-form').addEventListener('submit', handleAccountSettingsUpdate);
document.getElementById('add-address-button').addEventListener('click', () => {
    // Reset the add address form
    document.getElementById('add-address-form').reset();
    document.getElementById('addAddressModalLabel').innerText = 'Add New Address';
});
document.getElementById('add-payment-button').addEventListener('click', () => {
    // Reset the add payment form
    document.getElementById('add-payment-form').reset();
    document.getElementById('addPaymentModalLabel').innerText = 'Add New Payment Method';
});
document.getElementById('add-address-form').addEventListener('submit', handleAddAddress);
document.getElementById('add-payment-form').addEventListener('submit', handleAddPayment);
document.getElementById('logout-button').addEventListener('click', handleLogout);

// Initialize Account Page on Load
document.addEventListener('DOMContentLoaded', initializeAccountPage);

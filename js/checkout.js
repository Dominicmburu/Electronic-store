// checkout.js

// Function to load cart from Local Storage
function loadCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Function to save cart to Local Storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to render cart items in the checkout page
function renderCheckoutCart() {
    const cartItemsContainer = document.getElementById('checkout-cart-items');
    const cart = loadCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Your cart is empty.</td>
            </tr>
        `;
        document.getElementById('checkout-final-total').innerText = '0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const product = products[item.id];
        if (product) {
            const subtotal = product.currentPrice * item.quantity;
            total += subtotal;

            const tr = document.createElement('tr');

            // Product Image
            const tdImage = document.createElement('td');
            const img = document.createElement('img');
            img.src = product.images[0];
            img.alt = product.name;
            tdImage.appendChild(img);
            tr.appendChild(tdImage);

            // Product Name
            const tdName = document.createElement('td');
            tdName.innerText = product.name;
            tr.appendChild(tdName);

            // Price
            const tdPrice = document.createElement('td');
            tdPrice.innerText = `KSh ${product.currentPrice.toLocaleString()}.00`;
            tr.appendChild(tdPrice);

            // Quantity
            const tdQuantity = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.value = item.quantity;
            input.classList.add('form-control', 'quantity-input');
            input.style.width = '80px';
            input.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (newQuantity < 1) {
                    e.target.value = 1;
                    return;
                }
                updateCartItemQuantity(item.id, newQuantity);
            });
            tdQuantity.appendChild(input);
            tr.appendChild(tdQuantity);

            // Subtotal
            const tdSubtotal = document.createElement('td');
            tdSubtotal.innerText = `KSh ${subtotal.toLocaleString()}.00`;
            tr.appendChild(tdSubtotal);

            cartItemsContainer.appendChild(tr);
        }
    });

    // Display total
    document.getElementById('checkout-cart-total').innerText = `${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('checkout-final-total').innerText = `${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Function to update cart item quantity
function updateCartItemQuantity(id, quantity) {
    let cart = loadCart();
    cart = cart.map(item => {
        if (item.id === id) {
            return { ...item, quantity };
        }
        return item;
    });
    saveCart(cart);
    renderCheckoutCart();
    updateCartIconTotal();
}

// Function to update cart icon total
function updateCartIconTotal() {
    const cart = loadCart();
    let total = 0;
    cart.forEach(item => {
        const product = products[item.id];
        if (product) {
            total += product.currentPrice * item.quantity;
        }
    });

    const cartButton = document.querySelector('.cart a');
    if (cartButton) {
        cartButton.innerHTML = `<i class="bi bi-cart-fill"></i> KSh ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
}

// Function to handle payment method selection
function handlePaymentMethodChange() {
    const paymentMethod = document.getElementById('payment-method').value;
    const creditCardDetails = document.getElementById('credit-card-details');
    const paypalDetails = document.getElementById('paypal-details');

    if (paymentMethod === 'credit-card') {
        creditCardDetails.style.display = 'block';
        paypalDetails.style.display = 'none';
    } else if (paymentMethod === 'paypal') {
        creditCardDetails.style.display = 'none';
        paypalDetails.style.display = 'block';
    } else {
        creditCardDetails.style.display = 'none';
        paypalDetails.style.display = 'none';
    }
}

// Function to calculate final total (including shipping and taxes if needed)
function calculateFinalTotal() {
    // For simplicity, assuming total is same as cart total
    // You can add shipping costs and taxes here
    const cartTotal = parseFloat(document.getElementById('checkout-cart-total').innerText.replace(/,/g, ''));
    document.getElementById('checkout-final-total').innerText = cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Function to handle checkout form submission
function handleCheckoutForm(event) {
    event.preventDefault();

    const cart = loadCart();
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Collect Shipping Information
    const shippingName = document.getElementById('shipping-name').value.trim();
    const shippingAddress = document.getElementById('shipping-address').value.trim();
    const shippingCity = document.getElementById('shipping-city').value.trim();
    const shippingState = document.getElementById('shipping-state').value.trim();
    const shippingZip = document.getElementById('shipping-zip').value.trim();
    const shippingPhone = document.getElementById('shipping-phone').value.trim();

    // Check if billing address is same as shipping
    const sameAsShipping = document.getElementById('same-as-shipping').checked;
    let billingName, billingAddress, billingCity, billingState, billingZip;

    if (!sameAsShipping) {
        billingName = document.getElementById('billing-name').value.trim();
        billingAddress = document.getElementById('billing-address').value.trim();
        billingCity = document.getElementById('billing-city').value.trim();
        billingState = document.getElementById('billing-state').value.trim();
        billingZip = document.getElementById('billing-zip').value.trim();
    } else {
        billingName = shippingName;
        billingAddress = shippingAddress;
        billingCity = shippingCity;
        billingState = shippingState;
        billingZip = shippingZip;
    }

    // Collect Payment Information
    const paymentMethod = document.getElementById('payment-method').value;
    let paymentDetails = {};

    if (paymentMethod === 'credit-card') {
        const cardNumber = document.getElementById('card-number').value.trim();
        const cardHolder = document.getElementById('card-holder').value.trim();
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCVV = document.getElementById('card-cvv').value.trim();

        // Basic Validation
        if (cardNumber === "" || cardHolder === "" || cardExpiry === "" || cardCVV === "") {
            alert("Please fill out all credit card details.");
            return;
        }

        paymentDetails = {
            method: 'Credit/Debit Card',
            cardNumber,
            cardHolder,
            cardExpiry,
            cardCVV
        };
    } else if (paymentMethod === 'paypal') {
        paymentDetails = {
            method: 'PayPal'
            // Additional PayPal integration can be added here
        };
    } else {
        alert("Please select a payment method.");
        return;
    }

    // Create Order Object
    const order = {
        orderNumber: generateOrderNumber(),
        orderDate: new Date().toLocaleDateString(),
        shippingAddress: {
            name: shippingName,
            address: shippingAddress,
            city: shippingCity,
            state: shippingState,
            zip: shippingZip,
            phone: shippingPhone
        },
        billingAddress: {
            name: billingName,
            address: billingAddress,
            city: billingCity,
            state: billingState,
            zip: billingZip
        },
        paymentMethod: paymentDetails.method,
        paymentDetails: paymentDetails.method === 'Credit/Debit Card' ? {
            cardHolder: paymentDetails.cardHolder,
            cardNumber: maskCardNumber(paymentDetails.cardNumber),
            cardExpiry: paymentDetails.cardExpiry
        } : {},
        items: [],
        total: parseFloat(document.getElementById('checkout-final-total').innerText.replace(/,/g, '')),
        status: 'Processing'
    };

    // Populate Items
    cart.forEach(item => {
        const product = products[item.id];
        if (product) {
            order.items.push({
                name: product.name,
                image: product.images[0],
                quantity: item.quantity,
                price: product.currentPrice,
                subtotal: product.currentPrice * item.quantity
            });
        }
    });

    // Save Order to User's Order History (if user is logged in)
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
        const users = loadUsers();
        const userIndex = users.findIndex(user => user.id === loggedInUser.id);
        if (userIndex !== -1) {
            if (!users[userIndex].orders) {
                users[userIndex].orders = [];
            }
            users[userIndex].orders.push(order);
            saveUsers(users);
            setLoggedInUser(users[userIndex]);
        }
    }

    // Simulate Order Processing
    alert(`Thank you for your purchase! Your order #${order.orderNumber} has been placed successfully.`);

    // Clear Cart
    saveCart([]);
    renderCartIconTotal();

    // Redirect to Order Confirmation Page or Reload
    window.location.href = `order-confirmation.html?orderNumber=${order.orderNumber}`;
}

// Function to generate a unique order number
function generateOrderNumber() {
    return 'ORD' + Date.now();
}

// Function to mask card number for security
function maskCardNumber(cardNumber) {
    return cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4);
}

// Function to handle payment method selection
function initializePaymentMethodSelection() {
    const paymentMethodSelect = document.getElementById('payment-method');
    paymentMethodSelect.addEventListener('change', handlePaymentMethodChange);
    handlePaymentMethodChange(); // Initialize on page load
}

// Function to handle order confirmation
function initializeCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', handleCheckoutForm);
}

// Initialize the Checkout Page on Load
document.addEventListener('DOMContentLoaded', function () {
    renderCheckoutCart();
    initializePaymentMethodSelection();
    initializeCheckoutForm();
});

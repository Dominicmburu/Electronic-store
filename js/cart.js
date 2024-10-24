// cart.js

// Function to load cart from Local Storage
function loadCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Function to save cart to Local Storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = loadCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Your cart is empty.</td>
            </tr>
        `;
        updateCartSummary();
        return;
    }

    cart.forEach(item => {
        const product = products[item.id];
        if (product) {
            const subtotal = product.currentPrice * item.quantity;

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
            input.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (newQuantity < 1) {
                    e.target.value = 1;
                    return;
                }
                updateQuantity(item.id, newQuantity);
            });
            tdQuantity.appendChild(input);
            tr.appendChild(tdQuantity);

            // Subtotal
            const tdSubtotal = document.createElement('td');
            tdSubtotal.innerText = `KSh ${subtotal.toLocaleString()}.00`;
            tr.appendChild(tdSubtotal);

            // Remove
            const tdRemove = document.createElement('td');
            const removeBtn = document.createElement('i');
            removeBtn.classList.add('fas', 'fa-trash-alt', 'remove-item');
            removeBtn.title = 'Remove Item';
            removeBtn.addEventListener('click', () => {
                removeItem(item.id);
            });
            tdRemove.appendChild(removeBtn);
            tr.appendChild(tdRemove);

            cartItemsContainer.appendChild(tr);
        }
    });

    updateCartSummary();
}

// Function to update item quantity
function updateQuantity(id, quantity) {
    let cart = loadCart();
    cart = cart.map(item => {
        if (item.id === id) {
            return { ...item, quantity };
        }
        return item;
    });
    saveCart(cart);
    renderCart();
}

// Function to remove item from cart
function removeItem(id) {
    let cart = loadCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
}

// Function to calculate and update cart summary
function updateCartSummary() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');

    const cart = loadCart();
    let subtotal = 0;
    cart.forEach(item => {
        const product = products[item.id];
        if (product) {
            subtotal += product.currentPrice * item.quantity;
        }
    });

    const tax = subtotal * 0.18; // Assuming 18% tax
    const total = subtotal + tax;

    subtotalElement.innerText = subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    taxElement.innerText = tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    totalElement.innerText = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Update cart icon total
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

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function () {
    renderCart();

    // Example: Handle Checkout Button Click
    const checkoutButton = document.querySelector('.cart-summary a.btn-primary');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Implement your checkout logic here
            alert('Proceeding to checkout...');
        });
    }
});

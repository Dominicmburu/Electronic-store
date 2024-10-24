// tracking.js

// Mock Order Data
const mockOrders = {
    "123456": {
        orderNumber: "123456",
        orderDate: "October 24, 2024",
        customerName: "John Doe",
        shippingAddress: "123 Main Street, Nairobi, Kenya",
        paymentMethod: "Credit Card",
        items: [
            {
                name: "HP LaserJet Pro MFP M227fdw",
                quantity: 1,
                price: 32000,
                subtotal: 32000
            },
            {
                name: "Epson EcoTank L3150",
                quantity: 2,
                price: 21250,
                subtotal: 42500
            }
        ],
        total: 74500,
        status: "Processing",
        estimatedDelivery: "October 30, 2024"
    },
    "654321": {
        orderNumber: "654321",
        orderDate: "October 15, 2024",
        customerName: "Jane Smith",
        shippingAddress: "456 Elm Street, Mombasa, Kenya",
        paymentMethod: "PayPal",
        items: [
            {
                name: "Canon PIXMA MG3620",
                quantity: 1,
                price: 15000,
                subtotal: 15000
            }
        ],
        total: 15000,
        status: "Shipped",
        estimatedDelivery: "October 22, 2024"
    },
    // Add more mock orders as needed
};

// Function to handle form submission
document.getElementById('track-order-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const orderNumber = document.getElementById('order-number').value.trim();
    const orderEmail = document.getElementById('order-email').value.trim();

    if (orderNumber === "" || orderEmail === "") {
        alert("Please enter both Order Number and Email Address.");
        return;
    }

    // Simulate API call with a timeout
    setTimeout(() => {
        const order = mockOrders[orderNumber];
        if (order) {
            displayOrderStatus(order);
        } else {
            alert("No order found with the provided Order Number and Email Address.");
        }
    }, 1000); // Simulate network delay
});

// Function to display order status
function displayOrderStatus(order) {
    const orderStatusDiv = document.getElementById('order-status');
    orderStatusDiv.style.display = 'block';

    // Update Progress Bar
    const progressDivs = document.querySelectorAll('.order-progress div');
    progressDivs.forEach(div => {
        div.classList.remove('completed', 'current', 'pending');
    });

    switch (order.status) {
        case "Processing":
            progressDivs[0].classList.add('completed');
            progressDivs[1].classList.add('current');
            progressDivs[2].classList.add('pending');
            progressDivs[3].classList.add('pending');
            break;
        case "Shipped":
            progressDivs[0].classList.add('completed');
            progressDivs[1].classList.add('completed');
            progressDivs[2].classList.add('current');
            progressDivs[3].classList.add('pending');
            break;
        case "Delivered":
            progressDivs.forEach(div => div.classList.add('completed'));
            break;
        default:
            progressDivs.forEach(div => div.classList.add('pending'));
    }

    // Populate Order Details
    document.getElementById('detail-order-number').innerText = `#${order.orderNumber}`;
    document.getElementById('detail-order-date').innerText = order.orderDate;
    document.getElementById('detail-customer-name').innerText = order.customerName;
    document.getElementById('detail-shipping-address').innerText = order.shippingAddress;
    document.getElementById('detail-payment-method').innerText = order.paymentMethod;

    // Populate Order Items
    const orderItemsTbody = document.getElementById('order-items');
    orderItemsTbody.innerHTML = ''; // Clear existing items

    order.items.forEach(item => {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.innerText = item.name;
        tr.appendChild(tdName);

        const tdQuantity = document.createElement('td');
        tdQuantity.innerText = item.quantity;
        tr.appendChild(tdQuantity);

        const tdPrice = document.createElement('td');
        tdPrice.innerText = `KSh ${item.price.toLocaleString()}.00`;
        tr.appendChild(tdPrice);

        const tdSubtotal = document.createElement('td');
        tdSubtotal.innerText = `KSh ${item.subtotal.toLocaleString()}.00`;
        tr.appendChild(tdSubtotal);

        orderItemsTbody.appendChild(tr);
    });

    // Populate Order Total
    document.getElementById('order-total').innerText = `${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Optionally, you can add estimated delivery date or other details
}

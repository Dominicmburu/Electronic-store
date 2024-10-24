// products.js

const products = {
    1: {
        id: 1,
        name: "HP LaserJet Pro MFP M227fdw",
        oldPrice: 40000,
        currentPrice: 32000,
        discount: "20%",
        stock: "In Stock",
        description: "The HP LaserJet Pro MFP M227fdw is a versatile all-in-one printer that offers printing, scanning, copying, and faxing capabilities. Designed for small to medium-sized businesses, it provides fast and reliable performance with wireless connectivity options.",
        specifications: {
            "Print Technology": "Laser",
            "Print Speed": "Up to 28 ppm",
            "First Page Out": "8.5 seconds",
            "Monthly Duty Cycle": "Up to 80,000 pages",
            "Connectivity": "Wi-Fi, Ethernet, USB",
            "Dimensions": "16.1 x 15.2 x 11.3 inches",
            "Weight": "32 lbs"
        },
        images: [
            "./images/IMG-20241007-WA0017.jpg",
            "./images/IMG-20241007-WA0017.jpg",
            "./images/IMG-20241007-WA0017.jpg"
        ],
        reviews: [
            {
                name: "John Doe",
                date: "2 days ago",
                rating: 5,
                comment: "Excellent printer! Fast and reliable with great print quality. Highly recommend for small offices."
            },
            {
                name: "Jane Smith",
                date: "1 week ago",
                rating: 4.5,
                comment: "Good performance but a bit noisy. Overall satisfied with the purchase."
            }
            // Add more reviews as needed
        ],
        relatedProducts: [2, 3, 4] // IDs of related products
    },
    2: {
        id: 2,
        name: "Epson EcoTank L3150 Wi-Fi All-in-One Ink Tank Printer",
        oldPrice: 25000,
        currentPrice: 21250,
        discount: "15%",
        stock: "In Stock",
        description: "The Epson EcoTank L3150 offers cost-effective printing with its high-capacity ink tanks. Perfect for home and office use, it provides wireless connectivity and versatile functionality.",
        specifications: {
            "Print Technology": "Inkjet",
            "Print Speed": "Up to 10 ppm (Black)",
            "First Page Out": "9.5 seconds",
            "Monthly Duty Cycle": "Up to 15,000 pages",
            "Connectivity": "Wi-Fi, USB",
            "Dimensions": "14.4 x 11.2 x 8.1 inches",
            "Weight": "19 lbs"
        },
        images: [
            "./images/IMG-20241007-WA0018.jpg",
            "./images/IMG-20241007-WA0018.jpg",
            "./images/IMG-20241007-WA0018.jpg"
        ],
        reviews: [
            {
                name: "Alice Brown",
                date: "3 days ago",
                rating: 4,
                comment: "Great ink efficiency and easy to set up. The print quality is impressive."
            },
            {
                name: "Bob Johnson",
                date: "5 days ago",
                rating: 4.5,
                comment: "Very economical with ink usage. Perfect for high-volume printing needs."
            }
            // Add more reviews as needed
        ],
        relatedProducts: [1, 3, 5]
    },
    3: {
        id: 3,
        name: "Canon PIXMA MG3620 Wireless All-In-One Printer",
        oldPrice: 20000,
        currentPrice: 15000,
        discount: "25%",
        stock: "In Stock",
        description: "The Canon PIXMA MG3620 is a compact and versatile all-in-one printer that offers wireless connectivity, allowing you to print, scan, and copy with ease from your smartphone or tablet.",
        specifications: {
            "Print Technology": "Inkjet",
            "Print Speed": "Up to 10 ppm (Black)",
            "First Page Out": "9 seconds",
            "Monthly Duty Cycle": "Up to 6,000 pages",
            "Connectivity": "Wi-Fi, USB",
            "Dimensions": "14.6 x 10.2 x 7.6 inches",
            "Weight": "12.3 lbs"
        },
        images: [
            "./images/IMG-20241007-WA0019.jpg",
            "./images/IMG-20241007-WA0019.jpg",
            "./images/IMG-20241007-WA0019.jpg"
        ],
        reviews: [
            {
                name: "Charlie Davis",
                date: "1 day ago",
                rating: 5,
                comment: "Compact design fits perfectly in my home office. Excellent print quality."
            },
            {
                name: "Dana Lee",
                date: "4 days ago",
                rating: 4,
                comment: "Easy to connect via Wi-Fi. The scanning feature works flawlessly."
            }
            // Add more reviews as needed
        ],
        relatedProducts: [1, 2, 4]
    },
    4: {
        id: 4,
        name: "Canon SELPHY CP1300 Wireless Compact Photo Printer",
        oldPrice: 18000,
        currentPrice: 12600,
        discount: "30%",
        stock: "In Stock",
        description: "The Canon SELPHY CP1300 is a portable and compact photo printer that delivers high-quality prints directly from your smartphone or camera. Perfect for creating memories on the go.",
        specifications: {
            "Print Technology": "Dye Sublimation",
            "Print Speed": "Up to 47 seconds per print",
            "Print Size": "Up to 4 x 6 inches",
            "Connectivity": "Wi-Fi, USB",
            "Dimensions": "11.6 x 7.7 x 4.3 inches",
            "Weight": "3.3 lbs"
        },
        images: [
            "./images/IMG-20241007-WA0021.jpg",
            "./images/IMG-20241007-WA0021.jpg",
            "./images/IMG-20241007-WA0021.jpg"
        ],
        reviews: [
            {
                name: "Eve Martinez",
                date: "6 days ago",
                rating: 4.5,
                comment: "Produces vibrant and sharp photos. Compact and easy to carry around."
            },
            {
                name: "Frank Wilson",
                date: "2 weeks ago",
                rating: 4,
                comment: "Great for quick photo prints. Battery life is decent."
            }
            // Add more reviews as needed
        ],
        relatedProducts: [1, 2, 3]
    },
    5: {
        id: 5,
        name: "Creality Ender 3 V2 3D Printer",
        oldPrice: 45000,
        currentPrice: 29250,
        discount: "35%",
        stock: "In Stock",
        description: "The Creality Ender 3 V2 is a reliable and affordable 3D printer suitable for both beginners and professionals. It features a glass bed, silent motherboard, and a user-friendly interface for seamless 3D printing.",
        specifications: {
            "Print Technology": "FDM",
            "Build Volume": "220 x 220 x 250 mm",
            "Print Speed": "Up to 180 mm/s",
            "Layer Resolution": "0.1 - 0.4 mm",
            "Connectivity": "USB, SD Card",
            "Dimensions": "19.7 x 16.5 x 14 inches",
            "Weight": "32 lbs"
        },
        images: [
            "./images/IMG-20241007-WA0023.jpg",
            "./images/IMG-20241007-WA0024.jpg",
            "./images/IMG-20241007-WA0025.jpg"
        ],
        reviews: [
            {
                name: "Grace Kim",
                date: "1 day ago",
                rating: 5,
                comment: "Excellent 3D printer for the price. Great print quality and easy assembly."
            },
            {
                name: "Henry Clark",
                date: "3 days ago",
                rating: 4.5,
                comment: "Smooth printing experience with minimal issues. Highly recommended."
            }
            // Add more reviews as needed
        ],
        relatedProducts: [1, 2, 3]
    }
    // Add more products as needed
};

DROP DATABASE IF EXISTS clothing_shop;

CREATE DATABASE clothing_shop;

USE clothing_shop;

-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- CATEGORIES
-- =========================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- PRODUCTS
-- =========================================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0,
    category_id INT,
    image VARCHAR(500),
    size VARCHAR(255),
    color VARCHAR(255),
    stock INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- =========================================
-- CART
-- =========================================

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================
-- CART ITEMS
-- =========================================

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    size VARCHAR(20),
    color VARCHAR(50),

    FOREIGN KEY (cart_id)
        REFERENCES cart(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- =========================================
-- ORDERS
-- =========================================

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT NOT NULL,
    phone VARCHAR(20),
    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
    status ENUM(
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
    ) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================
-- ORDER ITEMS
-- =========================================

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200),
    price DECIMAL(10,2),
    quantity INT,
    size VARCHAR(20),
    color VARCHAR(50),

    FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

-- =========================================
-- CATEGORIES
-- =========================================

INSERT INTO categories
(name, description, image)
VALUES
(
    'Men',
    'Modern clothing for men',
    'https://images.unsplash.com/photo-1516826957135-700dedea698c'
),
(
    'Women',
    'Trendy clothing for women',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b'
),
(
    'T-Shirts',
    'Comfortable and stylish t-shirts',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'
),
(
    'Jeans',
    'Premium denim collection',
    'https://images.unsplash.com/photo-1542272604-787c3835535d'
),
(
    'Jackets',
    'Stylish jackets for every season',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5'
),
(
    'Dresses',
    'Beautiful dresses for women',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8'
),
(
    'Hoodies',
    'Comfortable hoodies',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7'
),
(
    'Accessories',
    'Fashion accessories',
    'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561'
);

-- =========================================
-- PRODUCTS
-- =========================================

INSERT INTO products
(name, description, price, discount, category_id, image, size, color, stock, rating, featured)
VALUES

(
    'Premium Oversized T-Shirt',
    'Premium cotton oversized t-shirt with a comfortable modern fit.',
    1499,
    10,
    3,
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    'S,M,L,XL,XXL',
    'Black,White,Gray',
    50,
    4.8,
    TRUE
),

(
    'Classic Blue Jeans',
    'Classic slim-fit blue jeans made with premium denim.',
    2499,
    15,
    4,
    'https://images.unsplash.com/photo-1542272604-787c3835535d',
    '28,30,32,34,36',
    'Blue,Dark Blue',
    35,
    4.7,
    TRUE
),

(
    'Urban Denim Jacket',
    'Stylish denim jacket perfect for casual outfits.',
    3299,
    20,
    5,
    'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    'S,M,L,XL',
    'Blue,Black',
    25,
    4.6,
    TRUE
),

(
    'Premium Black Hoodie',
    'Warm premium hoodie with a clean minimal design.',
    2199,
    10,
    7,
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    'S,M,L,XL,XXL',
    'Black,Gray',
    40,
    4.9,
    TRUE
),

(
    'Women Casual Dress',
    'Elegant casual dress suitable for everyday fashion.',
    2799,
    15,
    6,
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
    'S,M,L,XL',
    'Black,Red,White',
    30,
    4.7,
    TRUE
),

(
    'Women Fashion Outfit',
    'Modern fashion outfit designed for a stylish look.',
    3199,
    10,
    2,
    'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    'S,M,L,XL',
    'Black,White,Pink',
    20,
    4.6,
    FALSE
),

(
    'Men Casual Shirt',
    'Premium casual shirt for everyday wear.',
    1899,
    5,
    1,
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
    'S,M,L,XL,XXL',
    'White,Blue,Black',
    45,
    4.5,
    TRUE
),

(
    'Classic Fashion Cap',
    'Minimal fashion cap with adjustable strap.',
    899,
    10,
    8,
    'https://images.unsplash.com/photo-1521369909029-2afed882baee',
    'Free Size',
    'Black,White,Blue',
    60,
    4.4,
    FALSE
);
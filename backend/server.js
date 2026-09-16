const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));


// ==========================================
// DATABASE CONNECTION
// ==========================================

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("❌ MySQL connection failed:");
        console.log(err.message);
    } else {
        console.log("✅ MySQL connected successfully");
    }
});


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// ==========================================
// PRODUCTS
// ==========================================

// Get all products
app.get("/api/products", (req, res) => {

    const sql = `
        SELECT 
            products.*,
            categories.name AS category_name
        FROM products
        LEFT JOIN categories
        ON products.category_id = categories.id
        ORDER BY products.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});


// Get single product
app.get("/api/products/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT 
            products.*,
            categories.name AS category_name
        FROM products
        LEFT JOIN categories
        ON products.category_id = categories.id
        WHERE products.id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(results[0]);
    });
});


// Add product
app.post("/api/products", (req, res) => {

    const {
        name,
        description,
        price,
        discount,
        category_id,
        image,
        size,
        color,
        stock,
        featured
    } = req.body;

    const sql = `
        INSERT INTO products
        (
            name,
            description,
            price,
            discount,
            category_id,
            image,
            size,
            color,
            stock,
            featured
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            description,
            price,
            discount || 0,
            category_id,
            image,
            size,
            color,
            stock || 0,
            featured || false
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Product added successfully",
                id: result.insertId
            });
        }
    );
});


// Update product
app.put("/api/products/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        description,
        price,
        discount,
        category_id,
        image,
        size,
        color,
        stock,
        featured
    } = req.body;

    const sql = `
        UPDATE products
        SET
            name = ?,
            description = ?,
            price = ?,
            discount = ?,
            category_id = ?,
            image = ?,
            size = ?,
            color = ?,
            stock = ?,
            featured = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            description,
            price,
            discount || 0,
            category_id,
            image,
            size,
            color,
            stock,
            featured || false,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Product updated successfully"
            });
        }
    );
});


// Delete product
app.delete("/api/products/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM products WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Product deleted successfully"
            });
        }
    );
});


// ==========================================
// CATEGORIES
// ==========================================

app.get("/api/categories", (req, res) => {

    db.query(
        "SELECT * FROM categories ORDER BY name",
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(results);
        }
    );
});


// ==========================================
// REGISTER
// ==========================================

app.post("/api/register", (req, res) => {

    const {
        name,
        email,
        password,
        phone,
        address
    } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    const sql = `
        INSERT INTO users
        (name, email, password, phone, address)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            email,
            password,
            phone || "",
            address || ""
        ],
        (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        message: "Email already registered"
                    });
                }

                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Registration successful",
                userId: result.insertId
            });
        }
    );
});


// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    const sql = `
        SELECT id, name, email, phone, address, role
        FROM users
        WHERE email = ?
        AND password = ?
    `;

    db.query(
        sql,
        [email, password],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            res.json({
                message: "Login successful",
                user: results[0]
            });
        }
    );
});


// ==========================================
// USER PROFILE
// ==========================================

app.get("/api/users/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        `
        SELECT id, name, email, phone, address, role
        FROM users
        WHERE id = ?
        `,
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json(results[0]);
        }
    );
});


// ==========================================
// UPDATE PROFILE
// ==========================================

app.put("/api/users/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        phone,
        address
    } = req.body;

    db.query(
        `
        UPDATE users
        SET name = ?, phone = ?, address = ?
        WHERE id = ?
        `,
        [name, phone, address, id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Profile updated successfully"
            });
        }
    );
});


// ==========================================
// CREATE ORDER
// ==========================================

app.post("/api/orders", (req, res) => {

    const {
        user_id,
        total_amount,
        shipping_address,
        phone,
        payment_method,
        items
    } = req.body;

    if (!user_id || !total_amount || !shipping_address || !items) {
        return res.status(400).json({
            message: "Missing order information"
        });
    }

    const orderSql = `
        INSERT INTO orders
        (
            user_id,
            total_amount,
            shipping_address,
            phone,
            payment_method
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        orderSql,
        [
            user_id,
            total_amount,
            shipping_address,
            phone,
            payment_method || "Cash on Delivery"
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            const orderId = result.insertId;

            const itemSql = `
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    product_name,
                    price,
                    quantity,
                    size,
                    color
                )
                VALUES ?
            `;

            const values = items.map(item => [
                orderId,
                item.product_id,
                item.product_name,
                item.price,
                item.quantity,
                item.size || "",
                item.color || ""
            ]);

            db.query(
                itemSql,
                [values],
                (itemErr) => {

                    if (itemErr) {
                        return res.status(500).json({
                            error: itemErr.message
                        });
                    }

                    // Reduce stock
                    items.forEach(item => {

                        db.query(
                            `
                            UPDATE products
                            SET stock = stock - ?
                            WHERE id = ?
                            `,
                            [
                                item.quantity,
                                item.product_id
                            ]
                        );

                    });

                    res.json({
                        message: "Order placed successfully",
                        orderId
                    });
                }
            );
        }
    );
});


// ==========================================
// GET USER ORDERS
// ==========================================

app.get("/api/orders/user/:userId", (req, res) => {

    const userId = req.params.userId;

    db.query(
        `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(results);
        }
    );
});


// ==========================================
// GET ORDER ITEMS
// ==========================================

app.get("/api/orders/:id", (req, res) => {

    const orderId = req.params.id;

    db.query(
        `
        SELECT *
        FROM order_items
        WHERE order_id = ?
        `,
        [orderId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(results);
        }
    );
});


// ==========================================
// ADMIN - ALL ORDERS
// ==========================================

app.get("/api/admin/orders", (req, res) => {

    const sql = `
        SELECT
            orders.*,
            users.name AS customer_name,
            users.email AS customer_email
        FROM orders
        JOIN users
        ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});


// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================

app.put("/api/admin/orders/:id", (req, res) => {

    const id = req.params.id;

    const {
        status
    } = req.body;

    db.query(
        `
        UPDATE orders
        SET status = ?
        WHERE id = ?
        `,
        [status, id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Order status updated"
            });
        }
    );
});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("");
    console.log("================================");
    console.log("   CLOTHING SHOP SERVER");
    console.log("================================");
    console.log(`Server: http://localhost:${PORT}`);
    console.log("================================");
    console.log("");

});
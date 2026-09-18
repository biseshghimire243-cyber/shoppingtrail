const API_URL = "/api";


// ==========================================
// GLOBAL
// ==========================================

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch(`${API_URL}/products`);

        products = await response.json();

        displayFeaturedProducts();
        displayProducts();

        updateCartCount();

    } catch (error) {

        console.log("Failed to load products:", error);

    }
}


// ==========================================
// FEATURED PRODUCTS
// ==========================================

function displayFeaturedProducts() {

    const container =
        document.getElementById("featured-products");

    if (!container) return;

    const featured =
        products.filter(product => product.featured);

    container.innerHTML =
        featured.map(createProductCard).join("");
}


// ==========================================
// ALL PRODUCTS
// ==========================================

function displayProducts(list = products) {

    const container =
        document.getElementById("product-list");

    if (!container) return;

    if (list.length === 0) {

        container.innerHTML =
            "<p>No products found.</p>";

        return;
    }

    container.innerHTML =
        list.map(createProductCard).join("");
}


// ==========================================
// PRODUCT CARD
// ==========================================

function createProductCard(product) {

    const discountedPrice =
        product.price -
        (product.price * product.discount / 100);

    return `
        <div class="product-card">

            <div class="product-image">

                ${
                    product.discount > 0
                    ? `<span class="product-badge">
                        ${product.discount}% OFF
                       </span>`
                    : ""
                }

                <a href="product-details.html?id=${product.id}">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >
                </a>

            </div>

            <div class="product-info">

                <div class="product-category">
                    ${product.category_name || ""}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="rating">
                    ⭐ ${product.rating || "0"}
                </div>

                <div class="price">
                    Rs. ${discountedPrice.toFixed(0)}

                    ${
                        product.discount > 0
                        ? `<span class="old-price">
                            Rs. ${product.price}
                           </span>`
                        : ""
                    }
                </div>

                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

            </div>

        </div>
    `;
}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId, size = "", color = "") {

    const product =
        products.find(p => p.id == productId);

    if (!product) return;

    const existing =
        cart.find(
            item =>
                item.id == productId &&
                item.size == size &&
                item.color == color
        );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price:
                product.price -
                (product.price * product.discount / 100),

            image: product.image,

            quantity: 1,

            size: size,

            color: color

        });

    }

    saveCart();

    alert("Product added to cart 🛒");
}


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    document
        .querySelectorAll(".cart-count")
        .forEach(element => {

            element.textContent = count;

        });
}


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    const container =
        document.getElementById("cart-items");

    if (!container) return;

    if (cart.length === 0) {

        container.innerHTML = `
            <div style="text-align:center;padding:50px;">
                <h2>Your cart is empty</h2>
                <br>
                <a href="products.html">
                    <button class="checkout-btn">
                        Continue Shopping
                    </button>
                </a>
            </div>
        `;

        updateCartTotal();

        return;
    }

    container.innerHTML =
        cart.map((item, index) => `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div>
                    <h3>${item.name}</h3>

                    ${
                        item.size
                        ? `<p>Size: ${item.size}</p>`
                        : ""
                    }

                    ${
                        item.color
                        ? `<p>Color: ${item.color}</p>`
                        : ""
                    }

                    <p>Rs. ${item.price.toFixed(0)}</p>
                </div>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </div>

                <strong>
                    Rs. ${(item.price * item.quantity).toFixed(0)}
                </strong>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>

        `).join("");

    updateCartTotal();
}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();

    displayCart();
}


// ==========================================
// REMOVE CART ITEM
// ==========================================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    displayCart();
}


// ==========================================
// CART TOTAL
// ==========================================

function updateCartTotal() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

    const element =
        document.getElementById("cart-total");

    if (element) {

        element.textContent =
            `Rs. ${subtotal.toFixed(0)}`;

    }
}


// ==========================================
// SEARCH
// ==========================================

function searchProducts() {

    const input =
        document.getElementById("search");

    if (!input) return;

    const keyword =
        input.value.toLowerCase();

    const filtered =
        products.filter(product =>
            product.name
                .toLowerCase()
                .includes(keyword)
        );

    displayProducts(filtered);
}


// ==========================================
// CATEGORY FILTER
// ==========================================

function filterCategory(category) {

    if (category === "all") {

        displayProducts(products);

        return;
    }

    const filtered =
        products.filter(
            product =>
                product.category_name === category
        );

    displayProducts(filtered);
}


// ==========================================
// PRODUCT DETAILS
// ==========================================

async function loadProductDetails() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id = params.get("id");

    if (!id) return;

    try {

        const response =
            await fetch(
                `${API_URL}/products/${id}`
            );

        const product =
            await response.json();

        const container =
            document.getElementById(
                "product-details"
            );

        if (!container) return;

        const discountedPrice =
            product.price -
            (
                product.price *
                product.discount /
                100
            );

        const sizes =
            product.size
                ? product.size.split(",")
                : [];

        const colors =
            product.color
                ? product.color.split(",")
                : [];

        container.innerHTML = `

            <div>

                <img
                    class="product-main-image"
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>

            <div class="details-info">

                <div class="product-category">
                    ${product.category_name}
                </div>

                <h1>${product.name}</h1>

                <div class="rating">
                    ⭐ ${product.rating}
                </div>

                <div class="details-price">

                    Rs. ${discountedPrice.toFixed(0)}

                    ${
                        product.discount > 0
                        ? `<span class="old-price">
                            Rs. ${product.price}
                           </span>`
                        : ""
                    }

                </div>

                <p class="details-description">
                    ${product.description}
                </p>

                <div>

                    <div class="option-title">
                        Select Size
                    </div>

                    <div class="option-buttons">

                        ${
                            sizes.map(
                                size =>
                                `<button
                                    onclick="selectSize(this)"
                                >
                                    ${size}
                                </button>`
                            ).join("")
                        }

                    </div>

                </div>

                <div>

                    <div class="option-title">
                        Select Color
                    </div>

                    <div class="option-buttons">

                        ${
                            colors.map(
                                color =>
                                `<button
                                    onclick="selectColor(this)"
                                >
                                    ${color}
                                </button>`
                            ).join("")
                        }

                    </div>

                </div>

                <p>
                    Stock: ${product.stock}
                </p>

                <button
                    class="add-cart"
                    onclick="addProductFromDetails(${product.id})"
                >
                    Add to Cart
                </button>

            </div>

        `;

    } catch (error) {

        console.log(error);

    }
}


let selectedSize = "";
let selectedColor = "";


function selectSize(button) {

    document
        .querySelectorAll(".option-buttons button")
        .forEach(btn => {

            if (
                btn.parentElement ===
                button.parentElement
            ) {

                btn.classList.remove("active");

            }

        });

    button.classList.add("active");

    selectedSize =
        button.textContent.trim();
}


function selectColor(button) {

    button
        .parentElement
        .querySelectorAll("button")
        .forEach(btn =>
            btn.classList.remove("active")
        );

    button.classList.add("active");

    selectedColor =
        button.textContent.trim();
}


function addProductFromDetails(productId) {

    addToCart(
        productId,
        selectedSize,
        selectedColor
    );
}


// ==========================================
// REGISTER
// ==========================================

async function registerUser(event) {

    event.preventDefault();

    const form =
        event.target;

    const data = {

        name:
            form.name.value,

        email:
            form.email.value,

        password:
            form.password.value,

        phone:
            form.phone.value,

        address:
            form.address.value

    };

    try {

        const response =
            await fetch(
                `${API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );

        const result =
            await response.json();

        alert(result.message);

        if (response.ok) {

            window.location.href =
                "login.html";

        }

    } catch (error) {

        alert("Registration failed");

    }
}


// ==========================================
// LOGIN
// ==========================================

async function loginUser(event) {

    event.preventDefault();

    const form =
        event.target;

    const data = {

        email:
            form.email.value,

        password:
            form.password.value

    };

    try {

        const response =
            await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            alert(result.message);

            return;
        }

        localStorage.setItem(
            "user",
            JSON.stringify(result.user)
        );

        alert("Login successful");

        window.location.href =
            "index.html";

    } catch (error) {

        alert("Login failed");

    }
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("user");

    window.location.href =
        "index.html";
}


// ==========================================
// CHECKOUT
// ==========================================

async function placeOrder(event) {

    event.preventDefault();

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    if (!user) {

        alert("Please login first");

        window.location.href =
            "login.html";

        return;
    }

    if (cart.length === 0) {

        alert("Your cart is empty");

        return;
    }

    const form =
        event.target;

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );

    const data = {

        user_id:
            user.id,

        total_amount:
            total,

        shipping_address:
            form.address.value,

        phone:
            form.phone.value,

        payment_method:
            form.payment_method.value,

        items:
            cart.map(item => ({

                product_id:
                    item.id,

                product_name:
                    item.name,

                price:
                    item.price,

                quantity:
                    item.quantity,

                size:
                    item.size,

                color:
                    item.color

            }))

    };

    try {

        const response =
            await fetch(
                `${API_URL}/orders`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            alert(result.message || result.error);

            return;
        }

        cart = [];

        saveCart();

        alert(
            `Order placed successfully! Order #${result.orderId}`
        );

        window.location.href =
            "orders.html";

    } catch (error) {

        alert("Failed to place order");

    }
}


// ==========================================
// LOAD ORDERS
// ==========================================

async function loadOrders() {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const container =
        document.getElementById("orders");

    if (!container) return;

    if (!user) {

        container.innerHTML = `
            <h2>Please login to see your orders.</h2>
        `;

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/orders/user/${user.id}`
            );

        const orders =
            await response.json();

        if (orders.length === 0) {

            container.innerHTML = `
                <div class="order-card">
                    <h2>No orders yet.</h2>
                </div>
            `;

            return;
        }

        container.innerHTML =
            orders.map(order => `

                <div class="order-card">

                    <div class="order-header">

                        <strong>
                            Order #${order.id}
                        </strong>

                        <span class="status">
                            ${order.status}
                        </span>

                    </div>

                    <p>
                        Date:
                        ${new Date(
                            order.created_at
                        ).toLocaleDateString()}
                    </p>

                    <p>
                        Total:
                        Rs. ${order.total_amount}
                    </p>

                    <p>
                        Payment:
                        ${order.payment_method}
                    </p>

                </div>

            `).join("");

    } catch (error) {

        console.log(error);

    }
}


// ==========================================
// PROFILE
// ==========================================

function loadProfile() {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    if (!user) return;

    const name =
        document.getElementById("profile-name");

    const email =
        document.getElementById("profile-email");

    const phone =
        document.getElementById("profile-phone");

    const address =
        document.getElementById("profile-address");

    if (name)
        name.value = user.name || "";

    if (email)
        email.value = user.email || "";

    if (phone)
        phone.value = user.phone || "";

    if (address)
        address.value =
            user.address || "";
}


// ==========================================
// CONTACT FORM
// ==========================================

const contactForm =
    document.getElementById("contactForm");

const contactMessage =
    document.getElementById("contactMessage");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            if (contactMessage) {

                contactMessage.textContent =
                    "Thank you! Your message has been received.";

                contactMessage.classList.add("show");

            }

            contactForm.reset();

        }
    );

}


// ==========================================
// NEWSLETTER
// ==========================================

const newsletterForm =
    document.querySelector(".newsletter-form");


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            alert(
                "Thank you for subscribing to WearHouse! 📩"
            );

            newsletterForm.reset();

        }
    );

}


// ==========================================
// CHATBOT
// ==========================================

const chatbotButton =
    document.getElementById("chatbotButton");

const chatbot =
    document.getElementById("chatbot");

const closeChatbot =
    document.getElementById("closeChatbot");

const chatbotMessages =
    document.getElementById("chatbotMessages");

const chatbotInput =
    document.getElementById("chatbotInput");

const chatbotSend =
    document.getElementById("chatbotSend");


// ==========================================
// OPEN CHATBOT
// ==========================================

if (chatbotButton && chatbot) {

    chatbotButton.addEventListener(
        "click",
        function() {

            chatbot.classList.add("active");

            if (chatbotInput) {
                chatbotInput.focus();
            }

            if (
                chatbotMessages &&
                chatbotMessages.children.length === 0
            ) {

                addBotMessage(
                    "Hi 👋 How can I help you?"
                );

            }

        }
    );

}


// ==========================================
// CLOSE CHATBOT
// ==========================================

if (closeChatbot && chatbot) {

    closeChatbot.addEventListener(
        "click",
        function() {

            chatbot.classList.remove("active");

        }
    );

}


// ==========================================
// ADD BOT MESSAGE
// ==========================================

function addBotMessage(message) {

    if (!chatbotMessages) return;

    const div =
        document.createElement("div");

    div.className =
        "chat-message bot-message";

    div.textContent =
        message;

    chatbotMessages.appendChild(div);

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;
}


// ==========================================
// ADD USER MESSAGE
// ==========================================

function addUserMessage(message) {

    if (!chatbotMessages) return;

    const div =
        document.createElement("div");

    div.className =
        "chat-message user-message";

    div.textContent =
        message;

    chatbotMessages.appendChild(div);

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;
}


// ==========================================
// CHATBOT RESPONSE
// ==========================================

function getChatbotResponse(message) {

    const text =
        message.toLowerCase().trim();


    // GREETING

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey") ||
        text.includes("namaste")
    ) {

        return "Hello 👋 Welcome to WearHouse! How can I help you today?";

    }


    // PRODUCTS

    if (
        text.includes("product") ||
        text.includes("clothes") ||
        text.includes("dress") ||
        text.includes("shirt") ||
        text.includes("jeans") ||
        text.includes("jacket")
    ) {

        return "Sure! 👕 You can explore all our available products from the Shop page.";

    }


    // PRICE

    if (
        text.includes("price") ||
        text.includes("cost") ||
        text.includes("cheap")
    ) {

        return "You can check the latest product prices directly on our Shop and product details pages. 🛍️";

    }


    // CART

    if (
        text.includes("cart") ||
        text.includes("buy") ||
        text.includes("purchase")
    ) {

        return "🛒 You can add products to your cart and review them from the Cart page before checkout.";

    }


    // ORDER

    if (
        text.includes("order") ||
        text.includes("track") ||
        text.includes("ordered")
    ) {

        return "📦 You can check your orders from the Orders page after logging into your WearHouse account.";

    }


    // DELIVERY

    if (
        text.includes("delivery") ||
        text.includes("shipping") ||
        text.includes("deliver")
    ) {

        return "🚚 WearHouse provides delivery services. You can contact our support team for delivery-related questions.";

    }


    // RETURN

    if (
        text.includes("return") ||
        text.includes("exchange") ||
        text.includes("refund")
    ) {

        return "🔄 For returns, exchanges, or refunds, please contact our WearHouse support team.";

    }


    // LOGIN

    if (
        text.includes("login") ||
        text.includes("log in") ||
        text.includes("account")
    ) {

        return "👤 You can log in or create a new account from the Account section.";

    }


    // CONTACT

    if (
        text.includes("contact") ||
        text.includes("support") ||
        text.includes("help")
    ) {

        return "💬 You can contact WearHouse through the Contact Us section on our homepage.";

    }


    // PAYMENT

    if (
        text.includes("payment") ||
        text.includes("pay") ||
        text.includes("cash")
    ) {

        return "💳 Available payment methods are shown during checkout.";

    }


    // THANK YOU

    if (
        text.includes("thank") ||
        text.includes("thanks")
    ) {

        return "You're welcome! 😊 I'm always happy to help.";

    }


    // BYE

    if (
        text.includes("bye") ||
        text.includes("goodbye")
    ) {

        return "Goodbye 👋 Thanks for visiting WearHouse!";

    }


    // DEFAULT

    return "I'm here to help with products, prices, cart, orders, delivery, returns, payments, and general WearHouse questions. 😊";

}


// ==========================================
// SEND CHAT MESSAGE
// ==========================================

function sendChatMessage() {

    if (!chatbotInput) return;

    const message =
        chatbotInput.value.trim();

    if (!message) return;


    // SHOW USER MESSAGE

    addUserMessage(message);


    // CLEAR INPUT

    chatbotInput.value = "";


    // BOT THINKING

    setTimeout(
        function() {

            const response =
                getChatbotResponse(message);

            addBotMessage(response);

        },
        500
    );

}


// ==========================================
// SEND BUTTON
// ==========================================

if (chatbotSend) {

    chatbotSend.addEventListener(
        "click",
        sendChatMessage
    );

}


// ==========================================
// ENTER KEY
// ==========================================

if (chatbotInput) {

    chatbotInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendChatMessage();

            }

        }
    );

}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProducts();

        displayCart();

        loadProductDetails();

        loadOrders();

        loadProfile();

        updateCartCount();

    }
);
// ==========================================
// PROMOTION POPUP
// ==========================================

const promoOverlay =
    document.getElementById("promoOverlay");

const promoClose =
    document.getElementById("promoClose");


if (promoOverlay) {

    // Show popup when homepage loads
    if (
        window.location.pathname.endsWith("/") ||
        window.location.pathname.endsWith("index.html")
    ) {

        setTimeout(
            function() {

                promoOverlay.classList.add("active");

            },
            700
        );

    }

}


// ==========================================
// CLOSE POPUP
// ==========================================

if (promoClose) {

    promoClose.addEventListener(
        "click",
        function() {

            promoOverlay.classList.remove("active");

        }
    );

}


// ==========================================
// CLOSE WHEN CLICKING OUTSIDE
// ==========================================

if (promoOverlay) {

    promoOverlay.addEventListener(
        "click",
        function(event) {

            if (event.target === promoOverlay) {

                promoOverlay.classList.remove("active");

            }

        }
    );

}
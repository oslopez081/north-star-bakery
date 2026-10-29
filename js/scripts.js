/* ==========================================================================
   NORTH STAR BAKERY - TOUCHSTONE 4 JAVASCRIPT
   ========================================================================== */

// Data Structure 1: Array of Product Objects (Advanced Rubric Criterion)
const bakeryProducts = [
    { id: 1, name: "Classic Country Sourdough", category: "bread", price: 8.50, desc: "Naturally fermented for 24 hours." },
    { id: 2, name: "Rustic French Baguette", category: "bread", price: 4.50, desc: "Crispy crust with light interior." },
    { id: 3, name: "Butter Croissant", category: "pastry", price: 4.00, desc: "Flaky European-style butter layers." },
    { id: 4, name: "Pain au Chocolat", category: "pastry", price: 4.75, desc: "Rich dark chocolate wrapped in pastry." }
];

// Data Structure 2: Array tracking selected pre-order items
let selectedCartItems = [];

/* --------------------------------------------------------------------------
   FEATURE 1: DYNAMIC PRODUCT RENDERING & FILTERING
   -------------------------------------------------------------------------- */
function renderProducts(categoryFilter = "all") {
    const container = document.getElementById("product-list-container");
    if (!container) return; // Exit if not on products.html

    container.innerHTML = ""; // Clear existing list

    const filtered = categoryFilter === "all"
        ? bakeryProducts
        : bakeryProducts.filter(item => item.category === categoryFilter);

    filtered.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <button onclick="toggleCartItem(${product.id})">
                ${selectedCartItems.includes(product.id) ? "Remove from Pre-Order" : "Add to Pre-Order"}
            </button>
        `;
        container.appendChild(card);
    });

    updateOrderTotal();
}

function filterMenuCategory(category) {
    renderProducts(category);
}

function toggleCartItem(productId) {
    const index = selectedCartItems.indexOf(productId);
    if (index === -1) {
        selectedCartItems.push(productId);
    } else {
        selectedCartItems.splice(index, 1);
    }

    // Save selected order array to localStorage
    localStorage.setItem("bakeryCart", JSON.stringify(selectedCartItems));
    renderProducts();
}

function updateOrderTotal() {
    const totalElement = document.getElementById("total-price");
    if (!totalElement) return;

    const total = selectedCartItems.reduce((sum, id) => {
        const item = bakeryProducts.find(p => p.id === id);
        return sum + (item ? item.price : 0);
    }, 0);

    totalElement.textContent = total.toFixed(2);
}

/* --------------------------------------------------------------------------
   FEATURE 2: PERSISTENCE - LOAD SAVED STORAGE ON PAGE LOAD
   -------------------------------------------------------------------------- */
function loadSavedOrderData() {
    const savedCart = localStorage.getItem("bakeryCart");
    if (savedCart) {
        selectedCartItems = JSON.parse(savedCart);
    }

    // Auto-fill form draft if saved on contact page
    const savedName = localStorage.getItem("draftFullName");
    const nameInput = document.getElementById("full-name");
    if (savedName && nameInput) {
        nameInput.value = savedName;
    }
}

/* --------------------------------------------------------------------------
   FEATURE 3: CUSTOM CLIENT-SIDE FORM VALIDATION (`contact.html`)
   -------------------------------------------------------------------------- */
function setupFormValidation() {
    const form = document.querySelector("form");
    if (!form) return;

    // Autosave name draft as user types
    const nameInput = document.getElementById("full-name");
    if (nameInput) {
        nameInput.addEventListener("input", (e) => {
            localStorage.setItem("draftFullName", e.target.value);
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default browser submit

        let isValid = true;
        clearErrors();

        // Validation Check 1: Full Name (Required, Min 2 chars)
        const fullName = document.getElementById("full-name").value.trim();
        if (fullName === "" || fullName.length < 2) {
            showError("full-name-error", "Please enter your full name (at least 2 characters).");
            isValid = false;
        }

        // Validation Check 2: Email Format
        const email = document.getElementById("email-address").value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showError("email-address-error", "Please enter a valid email address (e.g. name@example.com).");
            isValid = false;
        }

        // Validation Check 3: Pickup Date Selected
        const pickupDate = document.getElementById("pickup-date").value;
        if (!pickupDate) {
            showError("pickup-date-error", "Please select a required pickup date.");
            isValid = false;
        }

        if (isValid) {
            alert("Pre-order request validated successfully! Thank you.");
            localStorage.removeItem("draftFullName"); // Clear draft upon success
            form.reset();
        }
    });
}

function showError(elementId, message) {
    const errorSpan = document.getElementById(elementId);
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.color = "#DC3545";
        errorSpan.style.fontSize = "0.875rem";
    }
}

function clearErrors() {
    const errors = document.querySelectorAll(".error-message");
    errors.forEach(span => span.textContent = "");
}

/* --------------------------------------------------------------------------
   INITIALIZATION
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    loadSavedOrderData();
    renderProducts();
    setupFormValidation();

    // Attach event listeners to filter buttons
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterMenuCategory(e.target.getAttribute("data-category"));
        });
    });
});
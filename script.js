// Replace this with your real API Gateway Stage URL
const API_URL = "https://2rwcjcffii.execute-api.us-east-1.amazonaws.com/prod/orders";

// Products to display on the page
const products = [
  { id: "101", name: "Dell Inspiron 15", price: 55000, img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS65_KXiFiDKrhdOIBZYS_L9tbi9zACFFPRSxs-GEQ67zs7D0ARMcXx1r2hOUkXXx56EIEFYoOOaMIj30Cpr8U_F99llG5ssfohEFZsoym5J0jhcFg8BMbMJYW9bCmKX1zF0htlIQ&usqp=CAc" },
  { id: "102", name: "Samsung Galaxy Z Fold 6", price: 149999, img: "https://m.media-amazon.com/images/I/61BgEfmZC8L.jpg" },
  { id: "103", name: "Sony WH-1000XM4", price: 25000, img: "https://m.media-amazon.com/images/I/61UgZSYRllL.jpg" },
  { id: "104", name: "Apple Watch SE", price: 25000, img: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MXM63ref_FV98_VW_34FR+watch-case-44-aluminum-starlight-cell-se_VW_34FR+watch-face-44-aluminum-starlight-se_VW_34FR?wid=752&hei=720&bgc=fafafa&trim=1&fmt=p-jpg&qlt=80&.v=QVR6TmZRU2x1RjZIVW5wdDlyenB5RW5TeWJ6QW43NUFnQ2V4cmRFc1VnWURIZXhSOVNUU1hpL1hkOUNjbEVLTGg2SVo4bXpMTHFJVjN3ZUJNRHZYdVF1Z0RaeFB5LzRxZEliRVE2WkswOWxGRkt5OUoySXA2clR0bnBITC90L2FGeUVTRStFTzh3dFc3MncrSVI0VFYxRVpGM0VTYkFEYWkrVUpmdm5HMEsvZzdYL1dmbHI1ck0vS0dDZmJkTUNtcXlYK1hMV0U1ZW9xcCtlRHF3V3gyUWw1MXVoaC9rQ0tINDRNUEExR2JHRU5mTDhYbjVxRUx5MXNydDUvcjcyYQ" }
];

// Renders the products on the main page
function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ''; // Clear existing content

  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>Rs:${product.price.toLocaleString()}</p>
      <button onclick="addToCart('${product.id}')">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
  });
}

// Adds an item to the shopping cart by calling the API
async function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error("Product not found!");
    return;
  }

  const payload = {
    cartID: `${product.id}-${Date.now()}`,
    productName: product.name,
    price: product.price,
    quantity: 1
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    const message = data.body ? JSON.parse(data.body).message : "Item added!";
    // Display an alert to the user with the success message
    window.alert(message);
    updateCartCount();
    loadDropdown();
  } catch (error) {
    console.error("Error adding to cart:", error);
    // Display an alert for a failure
    window.alert("Failed to add item to cart!");
  }
}

// Toggles the cart dropdown visibility
function toggleCart() {
  const cartDropdown = document.getElementById("cart-dropdown");
  cartDropdown.style.display = cartDropdown.style.display === "block" ? "none" : "block";
  if (cartDropdown.style.display === "block") {
    loadDropdown();
  }
}

// Loads cart items into the dropdown from the API
async function loadDropdown() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const items = JSON.parse(data.body).items || [];

    const dropdownList = document.getElementById("dropdown-items");
    dropdownList.innerHTML = "";
    let total = 0;

    if (items.length === 0) {
      dropdownList.innerHTML = "<li>Your cart is empty</li>";
    } else {
      items.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${item.productName}</span>
          <div>
            <button onclick="changeQty('${item.cartID}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQty('${item.cartID}', ${item.quantity + 1})">+</button>
            <button class="remove-btn" onclick="removeItem('${item.cartID}')">X</button>
          </div>
          <span>Rs.${(item.price * item.quantity).toLocaleString()}</span>
        `;
        dropdownList.appendChild(li);
        total += item.price * item.quantity;
      });
    }
    document.getElementById("dropdown-total").innerText = total.toLocaleString();
    document.getElementById("cart-count").innerText = items.length;

  } catch (error) {
    console.error("Error loading dropdown:", error);
    document.getElementById("dropdown-items").innerHTML = "<li>Failed to load cart.</li>";
  }
}

// Updates an item's quantity in the cart
async function changeQty(cartID, newQty) {
  if (newQty <= 0) {
    return removeItem(cartID);
  }
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartID: cartID, quantity: newQty })
    });
    const data = await response.json();
    console.log(JSON.parse(data.body).message);
    loadDropdown();
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
}

// Removes an item from the cart
async function removeItem(cartID) {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartID: cartID })
    });
    const data = await response.json();
    console.log(JSON.parse(data.body).message);
    loadDropdown();
    updateCartCount();
  } catch (error) {
    console.error("Error removing item:", error);
  }
}

// Updates the cart count displayed in the header
async function updateCartCount() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const items = JSON.parse(data.body).items || [];
    document.getElementById("cart-count").innerText = items.length;
  } catch (error) {
    console.error("Error updating cart count:", error);
  }
}

// Initial function calls when the page loads
window.onload = function() {
  renderProducts();
  updateCartCount();
};

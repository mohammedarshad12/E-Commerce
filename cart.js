// Replace this with your real API Gateway Stage URL
const API_URL = "https://2rwcjcffii.execute-api.us-east-1.amazonaws.com/prod/orders"; // Replace with your API Gateway URL

function fetchCart() {
  fetch(API_URL, { mode: "cors" })
    .then(response => response.json())
    .then(data => {
      let parsedBody;
      try {
        parsedBody = JSON.parse(data.body);
      } catch (error) {
        console.error("Error parsing cart response:", error, data);
        window.alert("Unexpected response format!");
        return;
      }

      const cartContainer = document.getElementById("cart-items");
      cartContainer.innerHTML = "";

      if (!Array.isArray(parsedBody.items) || parsedBody.items.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty!</p>";
        return;
      }

      parsedBody.items.forEach(item => {
        let li = document.createElement("li");
        li.innerHTML = `
          ${item.productName} - Rs.${item.price} 
          <button onclick="removeFromCart('${item.cartID}')">Remove</button>
        `;
        cartContainer.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Error fetching cart:", error);
      window.alert("Failed to load cart items!");
    });
}

function removeFromCart(cartID) {
  fetch(API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartID: cartID }),
    mode: "cors"
  })
  .then(response => response.json())
  .then(data => {
    const parsedBody = JSON.parse(data.body);
    if (parsedBody.message === "Item removed from cart") {
      window.alert("Item removed!");
      fetchCart();
    } else {
      window.alert("Failed to remove item.");
    }
  })
  .catch(error => {
    console.error("Error removing item:", error);
    window.alert("Error removing item!");
  });
}

// Load cart on page load
window.onload = fetchCart;

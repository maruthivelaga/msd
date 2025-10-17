const API_URL = window.location.origin + "/products";

const form = document.getElementById("productForm");
const tableBody = document.querySelector("#productTable tbody");
const showAllBtn = document.getElementById("showAllBtn");
const showInStockBtn = document.getElementById("showInStockBtn");

async function fetchProducts(instockOnly = false) {
  const url = instockOnly ? `${API_URL}/instock` : API_URL;
  const res = await fetch(url);
  const data = await res.json();
  renderTable(data);
}

function renderTable(products) {
  tableBody.innerHTML = "";
  products.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.inStock ? "✅" : "❌"}</td>
      <td>
        <button onclick="editProduct(${p.id})">Edit</button>
        <button onclick="deleteProduct(${p.id})" style="background:red">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const inStock = document.getElementById("inStock").checked;

  const payload = { name, price, inStock };
  let method = "POST";
  let url = API_URL;

  if (id) {
    method = "PUT";
    url = `${API_URL}/${id}`;
  }

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    form.reset();
    document.getElementById("productId").value = "";
    fetchProducts();
  } else {
    alert("Error saving product");
  }
});

async function editProduct(id) {
  const res = await fetch(`${API_URL}`);
  const data = await res.json();
  const product = data.find(p => p.id === id);

  if (product) {
    document.getElementById("productId").value = product.id;
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("inStock").checked = product.inStock;
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchProducts();
}

showAllBtn.addEventListener("click", () => fetchProducts(false));
showInStockBtn.addEventListener("click", () => fetchProducts(true));

// Initial load
fetchProducts();
    
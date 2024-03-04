// views\index.js
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts(); // Load products on page load
});

function fetchProducts() {
  // Fetch all products from the server and populate the table
  fetch('/products')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(products => displayProducts(products))
    .catch(error => console.error('Error fetching products:', error.message));
}

function displayProducts(products) {
  // Clear existing table content
  const table = document.getElementById('productTable');
  table.innerHTML = '';

  // Add table headers
  const headerRow = table.insertRow(0);
  const headers = ['Name', 'Cost Price', 'Selling Price', 'Inventory', 'Action'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.appendChild(document.createTextNode(headerText));
    headerRow.appendChild(header);
  });

  // Add product data
  products.forEach(product => {
    const row = table.insertRow(-1);
    const { name, cost_price, selling_price, inventory } = product;
    const data = [name, cost_price, selling_price, inventory];

    data.forEach(cellData => {
      const cell = row.insertCell();
      cell.appendChild(document.createTextNode(cellData));
    });

    // Add Edit and Delete buttons to the action column
    const actionCell = row.insertCell();
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editProduct(product.id));
    actionCell.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteProduct(product.id));
    actionCell.appendChild(deleteButton);
  });
}


function addProduct() {
  // Get values from the form
  const name = document.getElementById('name').value;
  const costPrice = document.getElementById('costPrice').value;
  const sellingPrice = document.getElementById('sellingPrice').value;
  const inventory = document.getElementById('inventory').value;

  console.log('Values:', name, costPrice, sellingPrice, inventory);

  // Check if any of the values are empty
  if (!name || !costPrice || !sellingPrice || !inventory) {
    console.log('Invalid data: All fields are required');
    return;
  }

  // Send a POST request to add the product
  fetch('/products/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      costPrice: costPrice,
      sellingPrice: sellingPrice,
      inventory: inventory,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Product added successfully');
        fetchProducts(); // Refresh product list
      } else {
        console.error('Failed to add product:', data.error);
        // Display the error message to the user
        alert(data.error);
      }
    })
    .catch(error => console.error('Error adding product:', error));
}


function searchProducts() {
  // Get the input value
  const searchInput = document.getElementById('searchInput').value.toLowerCase();

  // Fetch all products from the server
  fetch('/products')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(products => {
      // Filter products based on the search input
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchInput)
      );

      // Display the filtered products
      displayProducts(filteredProducts);
    })
    .catch(error => console.error('Error fetching and filtering products:', error.message));
}

function editProduct(productId) {
  console.log('Fetching product details for edit. Product ID:', productId);

  // Fetch the product data based on the productId
  fetch(`/products/${productId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(product => {
      console.log('Received product details for edit:', product);

      if (product && product.success && product.product) {
        const { name, cost_price, selling_price, inventory } = product.product;

        // Populate the form fields with the product data
        document.getElementById('name').value = name;
        document.getElementById('costPrice').value = cost_price;
        document.getElementById('sellingPrice').value = selling_price;
        document.getElementById('inventory').value = inventory;

        // Update the form button to act as an 'Update' button
        const addButton = document.querySelector('#addProductForm button');
        addButton.textContent = 'Update Product';

        // Add an event listener to handle the update
        addButton.onclick = () => updateProduct(productId);
      } else {
        console.error('Error fetching product details for edit:', product.error || 'Unknown error');
      }
    })
    .catch(error => console.error('Error fetching product details for edit:', error));
}

function updateProduct(productId) {
  // Get values from the form
  const name = document.getElementById('name').value;
  const costPrice = document.getElementById('costPrice').value;
  const sellingPrice = document.getElementById('sellingPrice').value;
  const inventory = document.getElementById('inventory').value;

  // Send a PUT request to update the product
  fetch(`/products/update/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      costPrice: costPrice,
      sellingPrice: sellingPrice,
      inventory: inventory,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Product updated successfully');
        // Reset the form and button after update
        resetForm();
        fetchProducts(); // Refresh product list
      } else {
        console.error('Failed to update product');
      }
    })
    .catch(error => console.error('Error updating product:', error));
}

function deleteProduct(productId) {
  // Confirm deletion with the user
  const confirmation = confirm('Are you sure you want to delete this product?');
  if (!confirmation) {
    return;
  }

  // Send a DELETE request to delete the product
  fetch(`/products/delete/${productId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Product deleted successfully');
        fetchProducts(); // Refresh product list
      } else {
        console.error('Failed to delete product');
      }
    })
    .catch(error => console.error('Error deleting product:', error));
}

// Function to reset the form and button to the original state
function resetForm() {
  document.getElementById('addProductForm').reset();
  const addButton = document.querySelector('#addProductForm button');
  addButton.textContent = 'Add Product';
  addButton.onclick = addProduct;
}



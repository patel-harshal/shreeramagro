// Fetch and display products
document.addEventListener('DOMContentLoaded', function() {
    fetch('data/products.json')
      .then(response => response.json())
      .then(data => {
        const products = data.products;
        displayProducts(products);
        setupEventListeners(products);
      })
      .catch(error => console.error('Error loading products:', error));
  });
  
  // Display products in the grid
  function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'col-md-4 col-lg-3 mb-4';
      productCard.innerHTML = `
        <div class="card h-100 product-card">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted">${product.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="price">₹${product.price}</span>
              <span class="badge bg-secondary">${product.size}</span>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <button class="btn btn-sm btn-outline-primary view-details" data-id="${product.id}">
              View Details
            </button>
          </div>
        </div>
      `;
      productGrid.appendChild(productCard);
    });
  }
  
  // Setup event listeners for filtering and viewing details
  function setupEventListeners(products) {
    // Search functionality
    document.getElementById('searchButton').addEventListener('click', function() {
      filterProducts(products);
    });
    
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        filterProducts(products);
      }
    });
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', function() {
      filterProducts(products);
    });
    
    // View details buttons
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('view-details')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        showProductDetails(product);
      }
    });
    
    // Enquire now button in modal
    document.getElementById('enquireNowBtn').addEventListener('click', function() {
      // You can implement enquiry functionality here
      alert('Enquiry about ' + document.getElementById('productModalTitle').textContent);
    });
  }
  
  // Filter products based on search and category
  function filterProducts(products) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                           product.description.toLowerCase().includes(searchTerm);
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });
    
    displayProducts(filtered);
  }
  
  // Show product details in modal
  function showProductDetails(product) {
    document.getElementById('productModalTitle').textContent = product.name;
    
    // Create thumbnails HTML
    let thumbnailsHTML = '';
    [product.image, ...product.thumbnails].forEach((img, index) => {
      thumbnailsHTML += `
        <div class="col-3">
          <img src="${img}" class="img-thumbnail thumbnail ${index === 0 ? 'active' : ''}" 
               alt="Thumbnail ${index + 1}" data-img="${img}">
        </div>
      `;
    });
    
    // Create benefits HTML
    let benefitsHTML = product.benefits.map(benefit => `<li>${benefit}</li>`).join('');
    
    // Set modal content
    document.getElementById('productModalBody').innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="${product.image}" id="mainProductImage" class="img-fluid mb-3">
          <div class="row g-2 mb-3">
            ${thumbnailsHTML}
          </div>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <span class="badge bg-success">${product.rating} ★ (${product.reviews})</span>
            </div>
            <h4 class="text-success">₹${product.price}</h4>
          </div>
          
          <h5>Description</h5>
          <p>${product.fullDescription}</p>
          
          <h5 class="mt-4">Specifications</h5>
          <table class="table table-sm">
            <tr>
              <td width="30%"><strong>Brand</strong></td>
              <td>${product.brand}</td>
            </tr>
            <tr>
              <td><strong>Type</strong></td>
              <td>${product.type}</td>
            </tr>
            <tr>
              <td><strong>Suitable For</strong></td>
              <td>${product.suitableFor}</td>
            </tr>
            <tr>
              <td><strong>Form</strong></td>
              <td>${product.form}</td>
            </tr>
            <tr>
              <td><strong>Size</strong></td>
              <td>${product.size}</td>
            </tr>
          </table>
          
          <h5 class="mt-4">Key Benefits</h5>
          <ul>
            ${benefitsHTML}
          </ul>
          
          <h5 class="mt-4">Usage Instructions</h5>
          <p><strong>Application Rate:</strong> ${product.usage.rate}</p>
          <p><strong>Method:</strong> ${product.usage.method}</p>
        </div>
      </div>
    `;
    
    // Initialize thumbnail click handlers
    document.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.addEventListener('click', function() {
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('mainProductImage').src = this.getAttribute('data-img');
      });
    });
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
    modal.show();
  }
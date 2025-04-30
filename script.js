let users = JSON.parse(localStorage.getItem('users')) || [
    { username: 'master123', password: 'masterpass', role: 'master' }
];
let products = JSON.parse(localStorage.getItem('products')) || [];
let loggedInUser = null;

const loginSection = document.getElementById('login-section');
const masterSupervisorPanel = document.getElementById('master-supervisor-panel');
const affiliatePanel = document.getElementById('affiliate-panel');
const loginButton = document.getElementById('login-button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

// Elementos del formulario de subida de productos
const productNameInput = document.getElementById('product-name');
const productDescriptionInput = document.getElementById('product-description');
const suggestedPriceInput = document.getElementById('suggested-price');
const affiliatePriceInput = document.getElementById('affiliate-price');
const productImagesInput = document.getElementById('product-images');
const publishButton = document.getElementById('publish-button');
const formMessage = document.getElementById('form-message');
const imagesPreviewContainer = document.getElementById('images-preview-container');

// Elementos de la lista de productos (Master/Supervisor)
const productList = document.getElementById('product-list');
const productManagementSection = document.getElementById('product-management');

// Elementos de gestión de usuarios (Master/Supervisor)
const newUserInput = document.getElementById('new-username');
const newPasswordInput = document.getElementById('new-password');
const newUserRole = document.getElementById('new-role');
const createUserButton = document.getElementById('create-user-button');
const userMessage = document.getElementById('user-message');

// Elementos del panel de afiliado
const affiliateProductList = document.getElementById('affiliate-product-list');
const publishedProductsList = document.getElementById('affiliate-published-list');
const notPublishedProductsList = document.getElementById('random-product-list');
const publishedProductsSection = document.getElementById('published-products');


// Funciones de utilidad
/**
 * Muestra un mensaje en la interfaz.
 * @param {string} message - El mensaje a mostrar.
 * @param {HTMLElement} element - El elemento donde mostrar el mensaje.
 * @param {string} color - El color del mensaje (e.g., 'green', 'red').
 */
function showMessage(message, element, color = 'green') {
    element.textContent = message;
    element.style.color = color;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

/**
 * Genera un ID único para cada producto.
 * @returns {string} - Un ID único.
 */
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Guarda los productos en el localStorage.
 */
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

/**
 * Guarda los usuarios en el local storage
 */
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Valida el formulario de inicio de sesión.
 * @returns {boolean} - Indica si el formulario es válido.
 */
function validateLoginForm() {
    if (!usernameInput.value.trim()) {
        loginError.textContent = 'Por favor, ingrese su nombre de usuario.';
        loginError.style.display = 'block';
        return false;
    }
    if (!passwordInput.value.trim()) {
        loginError.textContent = 'Por favor, ingrese su contraseña.';
        loginError.style.display = 'block';
        return false;
    }
    loginError.style.display = 'none';
    return true;
}

/**
 * Realiza el inicio de sesión del usuario.
 */
function login() {
    if (!validateLoginForm()) {
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        loggedInUser = user;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        loginSection.style.display = 'none';
        if (loggedInUser.role === 'master' || loggedInUser.role === 'supervisor') {
            masterSupervisorPanel.style.display = 'block';
            affiliatePanel.style.display = 'none';
            loadProductsForMasterSupervisor();
            if (loggedInUser.role === 'master') {
                userManagementSection.style.display = 'block';
            } else {
                userManagementSection.style.display = 'none';
            }
        } else {
            masterSupervisorPanel.style.display = 'none';
            affiliatePanel.style.display = 'block';
            loadProductsForAffiliate();
        }
        usernameInput.value = '';
        passwordInput.value = '';
    } else {
        loginError.textContent = 'Usuario o contraseña incorrectos.';
        loginError.style.display = 'block';
    }
}

/**
 * Carga los productos en la interfaz para Master y Supervisor.
 */
function loadProductsForMasterSupervisor() {
    productList.innerHTML = '';
    let productsToDisplay = products;
    if (loggedInUser.role === 'supervisor') {
        productsToDisplay = products.filter(p => p.uploadedBy === loggedInUser.username);
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'grid-item';
        productCard.dataset.productId = product.id;

        // Generar HTML para las imágenes
        const imagesHtml = product.images.map(img => `<img src="${img}" alt="Producto" class="w-full h-32 object-cover rounded-md mb-2">`).join('');

        productCard.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
            ${imagesHtml}
            <p class="text-gray-600 mb-1">Precio Sugerido: <span class="font-semibold">${product.suggestedPrice}</span></p>
            <p class="text-gray-600 mb-1">Precio Afiliado: <span class="font-semibold">${product.affiliatePrice}</span></p>
            <p class="text-gray-700 descripcion-producto mb-2">${product.description}</p>
            <div class="flex justify-end gap-2">
                <button class="edit-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm">Editar</button>
                <button class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm">Borrar</button>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

/**
 * Carga los productos para el afiliado
 */
function loadProductsForAffiliate() {
    affiliateProductList.innerHTML = '';
    publishedProductsList.innerHTML = '';
    const userPublishedProducts = JSON.parse(localStorage.getItem(loggedInUser.username + '_published')) || [];
    let notPublishedProducts = [];

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'grid-item';
        productCard.dataset.productId = product.id;

        const imagesHtml = product.images.map(img => `<img src="${img}" alt="Producto" class="w-full h-32 object-cover rounded-md mb-2">`).join('');

        productCard.innerHTML = `
                <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
                ${imagesHtml}
                <p class="text-gray-600 mb-1">Precio Sugerido: <span class="font-semibold">${product.suggestedPrice}</span></p>
                <p class="text-gray-600 mb-1">Precio Afiliado: <span class="font-semibold">${product.affiliatePrice}</span></p>
                <p class="text-gray-700 descripcion-producto mb-2">${product.description}</p>
                <div class="flex gap-2">
                    <button class="copy-description-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm">Copiar Descripción</button>
                    <button class="download-images-button bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm">Descargar Imágenes</button>
                    <button class="publish-product-button bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm">Ya he publicado</button>
                </div>
            `;
        if (userPublishedProducts.includes(product.id)) {
            publishedProductsList.appendChild(productCard);
        } else {
            affiliateProductList.appendChild(productCard);
            notPublishedProducts.push(product);
        }
    });
    notPublishedProductsList.innerHTML = '';
    const shuffledProducts = notPublishedProducts.sort(() => 0.5 - Math.random());
    const randomProducts = shuffledProducts.slice(0, 5);
    randomProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'grid-item';
        productCard.dataset.productId = product.id;

        const imagesHtml = product.images.map(img => `<img src="${img}" alt="Producto" class="w-full h-32 object-cover rounded-md mb-2">`).join('');

        productCard.innerHTML = `
                <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
                ${imagesHtml}
                <p class="text-gray-600 mb-1">Precio Sugerido: <span class="font-semibold">${product.suggestedPrice}</span></p>
                <p class="text-gray-600 mb-1">Precio Afiliado: <span class="font-semibold">${product.affiliatePrice}</span></p>
                <p class="text-gray-700 descripcion-producto mb-2">${product.description}</p>
                <div class="flex gap-2">
                    <button class="copy-description-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm">Copiar Descripción</button>
                    <button class="download-images-button bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm">Descargar Imágenes</button>
                    <button class="publish-product-button bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-sm">Ya he publicado</button>
                </div>
            `;
        notPublishedProductsList.appendChild(productCard);
    });
}

/**
 * Procesa el envío del formulario para subir un nuevo producto.
 */
function handlePublishProduct() {
    const name = productNameInput.value.trim();
    const description = productDescriptionInput.value.trim();
    const suggestedPrice = parseFloat(suggestedPriceInput.value);
    const affiliatePrice = parseFloat(affiliatePriceInput.value);
    const images = Array.from(productImagesInput.files);

    if (!name || !description || isNaN(suggestedPrice) || isNaN(affiliatePrice) || images.length === 0) {
        showMessage('Por favor, complete todos los campos y seleccione al menos una imagen.', formMessage, 'red');
        return;
    }

    const imagePromises = images.map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    Promise.all(imagePromises)
        .then(imageUrls => {
            const newProduct = {
                id: generateId(),
                name: name,
                description: description,
                suggestedPrice: suggestedPrice,
                affiliatePrice: affiliatePrice,
               images: imageUrls,
                uploadedBy: loggedInUser.username,
                published: false
            };

            products.push(newProduct);
            saveProducts();
            showMessage('Artículo publicado con éxito.', formMessage);
            clearProductForm();
            loadProductsForMasterSupervisor();
        })
        .catch(error => {
            showMessage('Error al cargar las imágenes.', formMessage, 'red');
            console.error('Error al cargar imágenes:', error);
        });
}

function clearProductForm() {
    productNameInput.value = '';
    productDescriptionInput.value = '';
    suggestedPriceInput.value = '';
    affiliatePriceInput.value = '';
    productImagesInput.value = '';
    imagesPreviewContainer.innerHTML = '';
}

// Event listeners
loginButton.addEventListener('click', login);
publishButton.addEventListener('click', handlePublishProduct);

// Cargar datos iniciales
const storedUser = localStorage.getItem('loggedInUser');
if (storedUser) {
    loggedInUser = JSON.parse(storedUser);
    loginSection.style.display = 'none';
    if (loggedInUser.role === 'master' || loggedInUser.role === 'supervisor') {
        masterSupervisorPanel.style.display = 'block';
        affiliatePanel.style.display = 'none';
        loadProductsForMasterSupervisor();
        if (loggedInUser.role === 'master') {
            userManagementSection.style.display = 'block';
        }
    } else {
        masterSupervisorPanel.style.display = 'none';
        affiliatePanel.style.display = 'block';
        loadProductsForAffiliate();
    }
} else {
    loginSection.style.display = 'block';
    masterSupervisorPanel.style.display = 'none';
    affiliatePanel.style.display = 'none';
}

Verificar el localStorage en el navegador:Abre la página web en tu navegador.Abre las herramientas de desarrollo del navegador (generalmente presionando F12).Ve a la pestaña "Aplicación" (o "Almacenamiento" en algunos navegadores).En el menú de la izquierda, expande "Almacenamiento Local" y selecciona el dominio de tu página.Verifica si hay una clave llamada "users" y si su valor es un array JSON con el usuario "master123". Si no está, o si el formato es incorrecto, eso podría ser la causa del problema.Agregar más logs de consola:Vamos a agregar algunos console.log() adicionales al código JavaScript para obtener más información sobre lo que está sucediendo. Aquí está el código modificado:let users = JSON.parse(localStorage.getItem('users')) || [
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

    console.log('Intento de inicio de sesión con:', username, password); // NUEVO LOG
    console.log('Usuarios disponibles:', users); // NUEVO LOG

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
    console.log('Función loadProductsForMasterSupervisor llamada'); // NUEVO LOG
    productList.innerHTML = '';
    let productsToDisplay = products;
    if (loggedInUser.role === 'supervisor') {
        productsToDisplay = products.filter(p => p.uploadedBy === loggedInUser.username);
    }

    console.log('Productos a mostrar:', productsToDisplay); // NUEVO LOG

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

    // Agregar event listeners a los botones "Editar" y "Borrar"
    const editButtons = productList.querySelectorAll('.edit-button');
    const deleteButtons = productList.querySelectorAll('.delete-button');

    editButtons.forEach(button => {
        button.addEventListener('click', editProduct);
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteProduct);
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

/**
 * Edita un producto existente.
 * @param {Event} event - El evento del click del botón.
 */
function editProduct(event) {
    const productId = event.target.closest('.grid-item').dataset.productId;
    const productToEdit = products.find(p => p.id === productId);

    if (!productToEdit) {
        showMessage('Producto no encontrado.', formMessage, 'red');
        return;
    }

    // Cargar los datos del producto en el formulario
    productNameInput.value = productToEdit.name;
    productDescriptionInput.value = productToEdit.description;
    suggestedPriceInput.value = productToEdit.suggestedPrice;
    affiliatePriceInput.value = productToEdit.affiliatePrice;
    imagesPreviewContainer.innerHTML = ''; // Limpiar vista previa de imágenes

    // Mostrar las imágenes existentes
    productToEdit.images.forEach(imageUrl => {
        const imgPreview = document.createElement('div');
        imgPreview.className = 'image-preview';
        imgPreview.innerHTML = `<img src="${imageUrl}" alt="Producto">`;
        imagesPreviewContainer.appendChild(imgPreview);
    });

    // Cambiar el texto del botón "Publicar" a "Guardar Cambios"
    publishButton.textContent = 'Guardar Cambios';

    // Eliminar el event listener anterior del botón "Publicar"
    publishButton.removeEventListener('click', handlePublishProduct);

    // Agregar un nuevo event listener para guardar los cambios
    publishButton.addEventListener('click', () => {
        saveChanges(productId);
    });
}

/**
 * Guarda los cambios realizados a un producto editado.
 * @param {string} productId - El ID del producto a guardar.
 */
function saveChanges(productId) {
    const updatedName = productNameInput.value.trim();
    const updatedDescription = productDescriptionInput.value.trim();
    const updatedSuggestedPrice = parseFloat(suggestedPriceInput.value);
    const updatedAffiliatePrice = parseFloat(affiliatePriceInput.value);
    const updatedImages = Array.from(productImagesInput.files);

    if (!updatedName || !updatedDescription || isNaN(updatedSuggestedPrice) || isNaN(updatedAffiliatePrice)) {
        showMessage('Por favor, complete todos los campos.', formMessage, 'red');
        return;
    }

    // Si se seleccionaron nuevas imágenes, procesarlas
    let imagePromises = [];
    if (updatedImages.length > 0) {
        imagePromises = updatedImages.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
    }

    Promise.all(imagePromises)
        .then(newImageUrls => {
            // Actualizar los datos del producto
            const productToUpdateIndex = products.findIndex(p => p.id === productId);
            if (productToUpdateIndex !== -1) {
                products[productToUpdateIndex].name = updatedName;
                products[productToUpdateIndex].description = updatedDescription;
                products[productToUpdateIndex].suggestedPrice = updatedSuggestedPrice;
                products[productToUpdateIndex].affiliatePrice = updatedAffiliatePrice;
                if (newImageUrls.length > 0) {
                    products[productToUpdateIndex].images = newImageUrls; // Usar nuevas imágenes
                }
                saveProducts();
                showMessage('Cambios guardados con éxito.', formMessage);
                clearProductForm();
                // Restaurar el texto y el event listener del botón "Publicar"
                publishButton.textContent = 'Publicar';
                publishButton.removeEventListener('click', () => {
                    saveChanges(productId);
                });
                publishButton.addEventListener('click', handlePublishProduct);
                loadProductsForMasterSupervisor(); // Recargar la lista de productos
            } else {
                showMessage('Producto no encontrado.', formMessage, 'red');
            }
        })
        .catch(error => {
            showMessage('Error al cargar las imágenes.', formMessage, 'red');
            console.error('Error al cargar imágenes:', error);
        });
}

/**
 * Borra un producto.
 * @param {Event} event - El evento del click del botón.
 */
function deleteProduct(event) {
    const productId = event.target.closest('.grid-item').dataset.productId;
    const productToDeleteIndex = products.findIndex(p => p.id === productId);

    if (productToDeleteIndex === -1) {
        showMessage('Producto no encontrado.', formMessage, 'red');
        return;
    }

    products.splice(productToDeleteIndex, 1);
    saveProducts();
    showMessage('Producto eliminado con éxito.', formMessage);
    loadProductsForMasterSupervisor(); // Recargar la lista de productos
}



// Event listeners
loginButton.addEventListener('click', login);
publishButton.addEventListener('click', handlePublishProduct);

// Cargar datos iniciales
const storedUser = localStorage.getItem('loggedInUser');
if (storedUser) {
    loggedInUser = JSON.parse(storedUser);
    console.log('Usuario logueado:', loggedInUser); // NUEVO LOG
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

console.log('Usuarios cargados:', users); // NUEVO LOG
console.log('Productos cargados:', products); // NUEVO LOG


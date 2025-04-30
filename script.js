const users = [
    { username: "master123", password: "masterpass", role: "master" },
    { username: "supervisor123", password: "supervisorpass", role: "supervisor" },
    { username: "affiliate123", password: "affiliatepass", role: "affiliate" },
];

const products = [
    {
        name: "Producto 1",
        description: "Descripción del Producto 1",
        suggestedPrice: 100,
        affiliatePrice: 80,
        images: ["imagen1.jpg", "imagen2.jpg"],
        id: "1",
    },
    {
        name: "Producto 2",
        description: "Descripción del Producto 2",
        suggestedPrice: 200,
        affiliatePrice: 160,
        images: ["imagen3.jpg", "imagen4.jpg"],
        id: "2",
    },
    {
        name: "Producto 3",
        description: "Descripción del Producto 3",
        suggestedPrice: 150,
        affiliatePrice: 120,
        images: ["imagen5.jpg"],
        id: "3",
    },
    {
        name: "Producto 4",
        description: "Descripción del Producto 4",
        suggestedPrice: 250,
        affiliatePrice: 200,
        images: ["imagen6.jpg"],
        id: "4"
    },
    {
        name: "Producto 5",
        description: "Descripción del Producto 5",
        suggestedPrice: 300,
        affiliatePrice: 240,
        images: ["imagen7.jpg"],
        id: "5"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-section");
    const masterSupervisorPanel = document.getElementById("master-supervisor-panel");
    const affiliatePanel = document.getElementById("affiliate-panel");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");
    const loginError = document.getElementById("login-error");
    const userManagementSection = document.getElementById("user-management");
    const productUploadForm = document.getElementById("product-upload-form");
    const newUsernameInput = document.getElementById("new-username");
    const newPasswordInput = document.getElementById("new-password");
    const newRoleSelect = document.getElementById("new-role");
    const createUserButton = document.getElementById("create-user-button");
    const userMessage = document.getElementById("user-message");
    const productListContainer = document.getElementById("product-list");
    const affiliateProductList = document.getElementById("affiliate-product-list");
    const publishButton = document.getElementById("publish-button");
    const productNameInput = document.getElementById("product-name");
    const productDescriptionInput = document.getElementById("product-description");
    const suggestedPriceInput = document.getElementById("suggested-price");
    const affiliatePriceInput = document.getElementById("affiliate-price");
    const productImagesInput = document.getElementById("product-images");
    const formMessage = document.getElementById("form-message");
    const viewUsersButton = document.getElementById("view-users-button");
    const userList = document.getElementById("user-list");
    const logoutButtons = document.querySelectorAll(".logout-button"); // Selecciona todos los botones de logout
    const randomProductList = document.getElementById("random-product-list");
    let loggedInUser = null;
    const MAX_RANDOM_PRODUCTS = 5; // Máximo de productos aleatorios a mostrar
    const publishedProducts = new Set();  // Track published product IDs
    const affiliatePublishedList = document.getElementById("affiliate-published-list");
    const showPublishedProductsButton = document.getElementById("published-products-button"); //Boton NO EXISTE

    // Función para mostrar un mensaje
    function showMessage(element, message, type = "success") {
        element.textContent = message;
        element.style.color = type === "success" ? "green" : "red";
        element.style.display = "block";
        setTimeout(() => {
            element.style.display = "none";
        }, 3000); // El mensaje desaparece después de 3 segundos
    }

    // Función para renderizar la lista de productos
    function renderProductList(container, productsToRender, userRole = null) {
        container.innerHTML = ""; // Limpiar el contenedor antes de renderizar
        productsToRender.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("bg-white", "rounded-lg", "shadow-md", "p-4", "flex", "flex-col", "transition-transform", "hover:scale-105");

            const imageContainer = document.createElement("div");
            imageContainer.classList.add("relative", "w-full", "h-48", "mb-4", "overflow-hidden", "rounded-md");

            // Mostrar la primera imagen o un mensaje si no hay imágenes
            if (product.images && product.images.length > 0) {
                const productImage = document.createElement("img");
                productImage.src = product.images[0]; // Mostrar la primera imagen
                productImage.alt = product.name;
                productImage.classList.add("object-cover", "w-full", "h-full");
                imageContainer.appendChild(productImage);
            } else {
                const noImage = document.createElement("div");
                noImage.classList.add("absolute", "inset-0", "flex", "items-center", "justify-center", "bg-gray-200", "text-gray-500");
                noImage.textContent = "No Image";
                imageContainer.appendChild(noImage);
            }

            const productName = document.createElement("h3");
            productName.classList.add("text-xl", "font-semibold", "text-gray-800", "mb-2");
            productName.textContent = product.name;

            const productDescription = document.createElement("p");
            productDescription.classList.add("text-gray-700", "mb-2", "descripcion-producto");
            productDescription.textContent = product.description;

            const suggestedPrice = document.createElement("p");
            suggestedPrice.classList.add("text-gray-900", "font-bold", "mb-1");
            suggestedPrice.textContent = `Precio Sugerido: $${product.suggestedPrice}`;

            const affiliatePrice = document.createElement("p");
            affiliatePrice.classList.add("text-green-600", "font-semibold", "mb-4");
            affiliatePrice.textContent = `Precio para Afiliado: $${product.affiliatePrice}`;

            productCard.appendChild(imageContainer);
            productCard.appendChild(productName);
            productCard.appendChild(productDescription);
            productCard.appendChild(suggestedPrice);
            productCard.appendChild(affiliatePrice);

            if (userRole === "affiliate") {
                const publishButton = document.createElement("button");
                publishButton.classList.add("bg-indigo-500", "hover:bg-indigo-700", "text-white", "font-bold", "py-2", "px-4", "rounded", "focus:outline-none", "focus:shadow-outline");
                publishButton.textContent = "Publicar";
                publishButton.addEventListener("click", () => {
                    if (!publishedProducts.has(product.id)) {
                        publishedProducts.add(product.id);
                         // Add to published list
                        const listItem = document.createElement("li");
                        listItem.textContent = product.name;
                        affiliatePublishedList.appendChild(listItem);
                        showMessage(formMessage, `Producto "${product.name}" publicado para tus clientes.`, "success");
                       // Aquí puedes agregar lógica para mostrar el producto al cliente del afiliado
                    } else {
                         showMessage(formMessage, `Ya has publicado el producto "${product.name}" anteriormente.`, "error");
                    }
                });
                productCard.appendChild(publishButton);
            }
            container.appendChild(productCard);
        });
    }

    // Función para cargar la lista de productos para master y supervisor
    function loadProductsForMasterSupervisor() {
        const productsToDisplay = products.map(product => ({
            ...product,
            images: product.images // Mantener las imágenes
        }));
        renderProductList(productListContainer, productsToDisplay);
    }

    // Función para cargar la lista de productos para afiliados
    function loadProductsForAffiliates() {
        const productsToDisplay = products.map(product => ({
            ...product,
            images: product.images
        }));
        renderProductList(affiliateProductList, productsToDisplay, "affiliate");
    }

    // Función para obtener productos aleatorios
    function getRandomProducts() {
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random()); // Shuffle
        return shuffledProducts.slice(0, Math.min(MAX_RANDOM_PRODUCTS, shuffledProducts.length)); // Get first 5 or less
    }

    // Función para cargar productos aleatorios
    function loadRandomProducts() {
        const randomProductsArray = getRandomProducts();
        renderProductList(randomProductList, randomProductsArray);
    }

    // Función para manejar el inicio de sesión
    function handleLogin() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        console.log(`Intento de inicio de sesión con: ${username} ${password}`);
        console.log("Usuarios disponibles:", users);

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            loggedInUser = user;
            loginForm.style.display = "none";
            if (user.role === "master" || user.role === "supervisor") {
                masterSupervisorPanel.style.display = "block";
                affiliatePanel.style.display = "none";
                if (user.role === "master") {
                    userManagementSection.style.display = "block";
                } else {
                    userManagementSection.style.display = "none";
                }
                loadProductsForMasterSupervisor();
            } else if (user.role === "affiliate") {
                masterSupervisorPanel.style.display = "none";
                affiliatePanel.style.display = "block";
                loadProductsForAffiliates();
                loadRandomProducts();
            }
        } else {
            loginError.textContent = "Credenciales incorrectas. Por favor, inténtalo de nuevo.";
            loginError.style.display = "block";
        }
    }

    // Función para crear un nuevo usuario (Solo para Master)
    function handleCreateUser() {
        const newUsername = newUsernameInput.value;
        const newPassword = newPasswordInput.value;
        const newRole = newRoleSelect.value;

        if (!newUsername || !newPassword || !newRole) {
            showMessage(userMessage, "Por favor, completa todos los campos.", "error");
            return;
        }

        const userExists = users.some(u => u.username === newUsername);
        if (userExists) {
            showMessage(userMessage, "El nombre de usuario ya existe. Por favor, elige otro.", "error");
            return;
        }

        users.push({ username: newUsername, password: newPassword, role: newRole });
        showMessage(userMessage, `Usuario "${newUsername}" creado con rol "${newRole}".`, "success");
        newUsernameInput.value = "";
        newPasswordInput.value = "";
        newRoleSelect.value = "affiliate"; // Reset to default
        loadUserList(); // Update user list
    }

    function loadUserList() {
        userList.innerHTML = ""; // Clear the list
        users.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = `${user.username} - ${user.role}`;
            userList.appendChild(listItem);
        });
    }

      // Función para manejar el cierre de sesión
    function handleLogout() {
        loggedInUser = null; // Clear logged in user
        loginForm.style.display = "block"; // Show login form
        masterSupervisorPanel.style.display = "none"; // Hide panels
        affiliatePanel.style.display = "none";
        // Reset form fields (optional)
        usernameInput.value = "";
        passwordInput.value = "";
        loginError.style.display = "none";
        // Clear product lists
        productListContainer.innerHTML = "";
        affiliateProductList.innerHTML = "";
        randomProductList.innerHTML = "";
        affiliatePublishedList.innerHTML = ""; // Clear published list
    }

    // Función para manejar la publicación de un producto
    function handlePublishProduct() {
        const productName = productNameInput.value;
        const productDescription = productDescriptionInput.value;
        const suggestedPrice = parseFloat(suggestedPriceInput.value);
        const affiliatePrice = parseFloat(affiliatePriceInput.value);
        const productImages = productImagesInput.files;

        if (!productName || !productDescription || isNaN(suggestedPrice) || isNaN(affiliatePrice) || !productImages || productImages.length === 0) {
            showMessage(formMessage, "Por favor, completa todos los campos y selecciona al menos una imagen.", "error");
            return;
        }

        if (suggestedPrice <= affiliatePrice) {
            showMessage(formMessage, "El precio sugerido debe ser mayor que el precio para el afiliado.", "error");
            return;
        }

        const imageFiles = Array.from(productImages);  // Convert FileList to array
        const imageNames = imageFiles.map(file => file.name); // Extract file names

        const newProduct = {
            name: productName,
            description: productDescription,
            suggestedPrice: suggestedPrice,
            affiliatePrice: affiliatePrice,
            images: imageNames, // Store file names, not File objects
            id: String(Date.now()), // Simple unique ID
        };

        products.push(newProduct); // Add to the products array
        showMessage(formMessage, `Producto "${productName}" publicado con éxito.`, "success");

        // Clear the form
        productNameInput.value = "";
        productDescriptionInput.value = "";
        suggestedPriceInput.value = "";
        affiliatePriceInput.value = "";
        productImagesInput.value = ""; // Reset file input
        document.getElementById('images-preview-container').innerHTML = ''; // Clear preview

        loadProductsForMasterSupervisor(); // Refresh product list
        if (loggedInUser.role === "affiliate") {
            loadProductsForAffiliates();
        }
    }

    // Event Listeners
    loginButton.addEventListener("click", handleLogin);
    createUserButton.addEventListener("click", handleCreateUser);
    publishButton.addEventListener("click", handlePublishProduct);
    viewUsersButton.addEventListener("click", loadUserList);
    logoutButtons.forEach(button => {  // Attach event listener to each button
        button.addEventListener("click", handleLogout);
    });

    productImagesInput.addEventListener('change', (event) => {
        const files = event.target.files;
        const previewContainer = document.getElementById('images-preview-container');
        previewContainer.innerHTML = ''; // Clear previous previews

        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function(e) {
                    const preview = document.createElement('div');
                    preview.classList.add('image-preview');
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    preview.appendChild(img);
                    previewContainer.appendChild(preview);
                }
                reader.readAsDataURL(file);
            }
        }
    });
});

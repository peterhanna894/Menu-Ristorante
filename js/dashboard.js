// Funzione di inizializzazione della pagina
window.onload = function() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        // Redirect alla pagina di login se il token è assente
        window.location.href = "/dashboardLogin.html";
    } else {
        // Carica le categorie e gli articoli, includendo il token in ogni richiesta
        loadCategories();
        loadArticles();
    }
};
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', function() {
localStorage.removeItem('authToken');  
token = '';

window.location.href = `dashboardLogin.html`;
});
// Carica le categorie per il filtro
function loadCategories() {
    fetch("http://localhost:8080/categorie", {
        method: "GET"
    })
    .then(response => response.json())
    .then(categories => {
        const categorySelect = document.getElementById("categoryFilter");
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.nomeIta;
            categorySelect.appendChild(option);
            
        });
        const categorySelectForModal = document.getElementById("category");
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.nomeIta;
            categorySelectForModal.appendChild(option);
        });
    })
    .catch(error => console.error("Errore nel caricamento delle categorie:", error));
}

// Carica e visualizza gli articoli
function loadArticles(categoryId = null) {
    const token = localStorage.getItem("authToken");
    let url = "http://localhost:8080/articoli";
    if (categoryId) {
        url += `/categ/${categoryId}`;
    }

    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(response => response.json())
    .then(articles => {
        const articlesTable = document.getElementById("menuItemsTable");
        articlesTable.innerHTML = ""; // Svuota la tabella prima di riempirla
        articles.forEach(article => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${article.id}</td>
                <td>${article.nomeIta}</td>
                <td>${article.descrIta}</td>
                <td>${article.nomeIng}</td>
                <td>${article.descrIng}</td>
                <td>${article.categoria.nomeIta}</td>
                <td>${article.prezzo} €</td>
                <td>
                    <button onclick="editArticle(${article.id})" class="btn btn-warning btn-sm">Modifica</button>
                    <button onclick="deleteArticle(${article.id})" class="btn btn-danger btn-sm">Elimina</button>
                </td>
            `;
            articlesTable.appendChild(row);
        });
    })
    .catch(error => console.error("Errore nel caricamento degli articoli:", error));
}

// Aggiunge un nuovo articolo
function addArticle() {
    const newArticle = {
        nomeIta: document.getElementById("nameIta").value,
        descrIta: document.getElementById("descIta").value,
        nomeIng: document.getElementById("nameEng").value,
        descrIng: document.getElementById("descEng").value,
        prezzo: parseFloat(document.getElementById("price").value),
        categoria: { id: document.getElementById("category").value }
    };

    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/articolo", {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newArticle)
    })
    
    .then(() => {
        loadArticles(document.getElementById("category").value); // Ricarica gli articoli
        // Nasconde il modal dopo aver aggiunto il piatto
        const addModal = bootstrap.Modal.getInstance(document.getElementById("addArticleModal"));
        addModal.hide(); 

        // Pulisce i campi del form
        document.getElementById("addArticleForm").reset();
    })
    .catch(error => console.error("Errore durante l'aggiunta dell'articolo:", error));
   
}

// Funzione per caricare e mostrare i dati di un articolo nel modal di modifica
function editArticle(id) {
    const token = localStorage.getItem("authToken");

    // Recupera i dettagli dell'articolo
    fetch(`http://localhost:8080/articolo/${id}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(response => response.json())
    .then(article => {
        // Precompila i campi del modal con i dati dell'articolo
        document.getElementById("editNameIta").value = article.nomeIta;
        document.getElementById("editDescIta").value = article.descrIta;
        document.getElementById("editNameEng").value = article.nomeIng;
        document.getElementById("editDescEng").value = article.descrIng;
        document.getElementById("editPrice").value = article.prezzo;

        // Carica le categorie e seleziona quella giusta
        loadCategoriesForEdit(article.categoria.id);

        // Mostra il modal di modifica
        const editModal = new bootstrap.Modal(document.getElementById("editArticleModal"));
        editModal.show();

        // Memorizza l'ID dell'articolo da modificare
        document.getElementById("editArticleForm").dataset.articleId = article.id;
        
    })
    .catch(error => console.error("Errore durante il caricamento dell'articolo:", error));
}

// Carica le categorie per il modal di modifica
function loadCategoriesForEdit(selectedCategoryId) {
    fetch("http://localhost:8080/categorie", {
        method: "GET"
    })
    .then(response => response.json())
    .then(categories => {
        const categorySelect = document.getElementById("editCategory");
        categorySelect.innerHTML = "";

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.nomeIta;
            if (category.id === selectedCategoryId) {
                option.selected = true; // Seleziona la categoria corretta
            }
            categorySelect.appendChild(option);
        });
    })
    .catch(error => console.error("Errore nel caricamento delle categorie:", error));
}

// Funzione per salvare le modifiche dell'articolo
function saveEditedArticle() {
    const articleId = document.getElementById("editArticleForm").dataset.articleId;
    const updatedArticle = {
        nomeIta: document.getElementById("editNameIta").value,
        descrIta: document.getElementById("editDescIta").value,
        nomeIng: document.getElementById("editNameEng").value,
        descrIng: document.getElementById("editDescEng").value,
        prezzo: parseFloat(document.getElementById("editPrice").value),
        categoria: { id: document.getElementById("editCategory").value }
    };

    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8080/articolo/update/${articleId}`, {
        method: "PUT",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedArticle)
    })
    .then(() => {
        loadArticles(document.getElementById("editCategory").value); // Ricarica gli articoli
        const editModal = bootstrap.Modal.getInstance(document.getElementById("editArticleModal"));
        editModal.hide(); // Chiudi il modal dopo aver salvato
    })
    .catch(error => console.error("Errore durante la modifica dell'articolo:", error));
}


// Elimina un articolo
function deleteArticle(id) {
    console.log("articolo da cancellare " + id)
    if (confirm("Sei sicuro di voler eliminare questo articolo?")) {
        const token = localStorage.getItem("authToken");

        fetch(`http://localhost:8080/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        })
        .then(() => loadArticles()) // Ricarica gli articoli
        .catch(error => console.error("Errore durante l'eliminazione dell'articolo:", error));
    }
}

// Filtro per categoria
function filterByCategory() {
    const categoryId = document.getElementById("categoryFilter").value;
    loadArticles(categoryId); // Carica gli articoli per la categoria selezionata
}
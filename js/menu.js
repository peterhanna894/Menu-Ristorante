
    let language = "ita"; // Lingua di default

    // Funzione per recuperare le categorie
    const urlParam =new URLSearchParams(window.location.search);
    language = urlParam.get('language')||"ita",
    console.log(language)
    const langButton=document.getElementById("change-language");
    if(language=="ita"){
        langButton.innerHTML="English";
    }else{
        langButton.innerHTML="Italiano";
    }
    function changeLanguage() {
        if(language=="ita"){
        
        window.location.href=`/menu.html?language=eng`
        }else{
        window.location.href=`/menu.html?language=ita`
        }
}

    window.onload=getCategories;
    console.log(language)
    async function getCategories() {
        console.log("carico categorie" + language)
        const response = await fetch("http://localhost:8080/categorie");
        const categories = await response.json();
        displayCategories(categories);
        console.log(categories)
    }

    // Funzione per visualizzare le categorie come Navbar
    function displayCategories(categories) {
        const container = document.getElementById("categories-nav");
        container.innerHTML = ""; // Pulisce il contenitore prima di aggiungere nuove categorie

        categories.forEach(category => {
            const listItem = document.createElement("li");
            listItem.classList.add("nav-item");

            listItem.innerHTML = `
                <a class="nav-link" href="#" onclick="getArticoliByCategory(${category.id})">
                    ${language === "ita" ? category.nomeIta : category.nomeIng}
                </a>
            `;
            container.appendChild(listItem);
        });
    }

    // Funzione per recuperare gli articoli per una data categoria
    async function getArticoliByCategory(categoryId) {
        const response = await fetch(`http://localhost:8080/articoli/categ/${categoryId}`);
        const articoli = await response.json();
        displayArticoli(articoli);
    }

    // Funzione per visualizzare gli articoli della categoria come righe
    function displayArticoli(articoli) {
        const container = document.getElementById("articoli-container");
        container.innerHTML = ""; // Pulisce la vista degli articoli

        articoli.forEach(articolo => {
            const row = document.createElement("div");
            row.classList.add("category-row", "row");

            row.innerHTML = `
                <div class="category-header">
                    ${language === "ita" ? articolo.nomeIta : articolo.nomeIng}
                </div>
                <div class="row-item">
                    <span>${language === "ita" ? articolo.descrIta : articolo.descrIng}</span>
                    <span class="price">${articolo.prezzo.toFixed(2)}€</span>
                </div>
            `;
            container.appendChild(row);
        });
    }

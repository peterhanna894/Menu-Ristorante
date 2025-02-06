let language = "ita"; // Lingua di default

// Funzione per impostare la lingua 
function setLanguage(selectedLanguage) {
    language = selectedLanguage;
    window.location.href=`/menu.html?language=${language}`
}

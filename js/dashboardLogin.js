
window.onload = function() {
    const token = localStorage.getItem("authToken");

    if (token) {
        // Redirect alla pagina di login se il token è assente
        window.location.href = "/dashboard.html";
    } 
};

async function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElementLogin = document.getElementById('message-login');
    const loginSection = document.getElementById('login-section');
    //   const logoutSection = document.getElementById('logout-section');


    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.status === 200) {
            const data = await response.json();
            const token = data.token;
            localStorage.setItem('authToken', token);
           // messageElementLogin.textContent = 'Login successful';
           // messageElementLogin.style.color = 'green';
            //   loginSection.style.display = 'none';
            //   signupSection.style.display = 'none';
            //   logoutSection.style.display = 'block';
            // Ricarica la pagina per aggiornare l'interfaccia utente
            window.location.href = '/dashboard.html';
        } else {
            messageElementLogin.textContent = 'Credenziali non validi';
            messageElementLogin.style.color = '#66141B';
            messageElementLogin.style.textAlign = 'center'
        }
    } catch (error) {
        console.error('Error durante il login:', error);
        messageElementLogin.textContent = 'Error durante il login';
        messageElementLogin.style.color = 'red';
    }
}

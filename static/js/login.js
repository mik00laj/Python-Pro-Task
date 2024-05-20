const username = document.querySelector('.username');
const password1 = document.querySelector('.password1');
const form = document.querySelector('form');

form.addEventListener('submit', event => {
    let isValid = true;
    event.preventDefault();

    if (username.value === '') {
        username.placeholder = 'Brak nazwy użytkownika';
        username.style.background = 'red';
        username.value = "";
        isValid = false;
    }

    if (password1.value === '') {
        password1.placeholder = 'Brak hasła';
        password1.style.background = 'red';
        password1.value = "";
        isValid = false;
    }

    if (isValid) {
        fetch('/check_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username.value, password: password1.value }),
        })
        .then(response => response.json())
        .then(data => {
            if (!data.exists) {
                username.style.backgroundColor = 'red';
                username.setCustomValidity('Użytkownik nie istnieje');
                username.reportValidity();
            }
            if (data.exists && !data.validPassword) {
                password1.style.backgroundColor = 'red';
                password1.setCustomValidity('Niepoprawne hasło');
                password1.reportValidity();
            }
            if (data.exists && data.validPassword) {
                window.location.href = '/quiz.html'; // Przekieruj na stronę quizu
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

username.addEventListener('input', () => {
    if (username.value !== '') {
        username.placeholder = 'Nazwa użytkownika';
        username.style.backgroundColor = '';
        username.setCustomValidity('');
    }
});

password1.addEventListener('input', () => {
    if (password1.value !== '') {
        password1.placeholder = 'Wpisz hasło';
        password1.style.backgroundColor = '';
        password1.setCustomValidity('');
    }
});

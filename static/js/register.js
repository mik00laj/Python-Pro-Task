const username = document.querySelector('.username');
const password1 = document.querySelector('.password1');
const password2 = document.querySelector('.password2');
const form = document.querySelector('form');

form.addEventListener('submit', event => {
    let isValid = true;

    if (username.value === '') {
        username.placeholder = 'Brak nazwy użytkownika';
        username.style.background = 'red';
        isValid = false;
    }

    if (password1.value === '') {
        password1.placeholder = 'Brak hasła';
        password1.value = "";
        password1.style.background = 'red';
        isValid = false;
    }

    if (password2.value === '') {
        password2.placeholder = 'Brak potwierdzenia hasła';
        password2.value = "";
        password2.style.background = 'red';
        isValid = false;
    }

    if (password1.value !== password2.value) {
        password2.placeholder = 'Hasła się różnią';
        password2.value = "";
        password2.style.background = 'red';
        isValid = false;
    }

    if (isValid) {
        event.preventDefault();
        fetch('/check_username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username.value }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                username.style.backgroundColor = 'red';
                username.setCustomValidity('Nazwa użytkownika jest zajęta');
                username.reportValidity();
            } else {
                username.setCustomValidity('');
                form.submit();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        event.preventDefault();
    }
});

username.addEventListener('input', () => {
    if (username.value !== '') {
        username.placeholder = 'Wpisz nazwę użytkownika';
        username.style.backgroundColor = '';
        username.setCustomValidity('');
    }
});

password1.addEventListener('input', () => {
    if (password1.value !== '') {
        password1.placeholder = 'Wpisz swoje hasło';
        password1.style.backgroundColor = '';
    }
});

password2.addEventListener('input', () => {
    if (password2.value !== '') {
        password2.placeholder = 'Powtórz swoje hasło';
        password2.style.backgroundColor = '';
    }
});

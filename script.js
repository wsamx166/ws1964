// JavaScript للتحقق من كلمة المرور
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const correctKey = "your_secret_key_for_friends"; // !!! غير هذه الكلمة بكلمة المرور التي تريدها لأصدقائك !!!
    const enteredKey = document.getElementById('inviteKey').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    if (enteredKey === correctKey) {
        successMessage.style.display = 'block';
        // إضافة علامة في sessionStorage عند الدخول الناجح
        sessionStorage.setItem('loggedIn', 'true'); // !!! هذا هو السطر الجديد !!!
        
        setTimeout(() => {
            window.location.href = "chat.html";
        }, 1500);
    } else {
        errorMessage.style.display = 'block';
    }
});

// ------------ كود تأثير سقوط 0 و 1 (يبقى كما هو) ------------

function createFallingNumber() {
    const number = document.createElement('span');
    number.classList.add('falling-number');
    number.textContent = Math.random() < 0.5 ? '0' : '1';

    const startX = Math.random() * window.innerWidth;
    number.style.left = `${startX}px`;
    number.style.animationDuration = `${Math.random() * 5 + 3}s`;
    number.style.animationDelay = `${Math.random() * 5}s`;

    document.body.appendChild(number);

    number.addEventListener('animationend', () => {
        number.remove();
    });
}

setInterval(createFallingNumber, 300);
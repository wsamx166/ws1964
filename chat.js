document.addEventListener('DOMContentLoaded', () => {
    // التحقق من حالة الدخول
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = "index.html"; 
        return; 
    }

    document.body.classList.add('chat-page');

    // --- الاتصال بالخادم ---
    // استبدل هذا الرابط برابط الخادم الخاص بك (مثلاً نطاقك على Cloudflare)
    const socket = io('https://your-backend-server-url.com'); 

    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    // دوال مساعدة لإنشاء وعرض الرسائل
    function displayMessage(sender, text, type, time, imageUrl = null, fileUrl = null, fileName = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        const senderSpan = document.createElement('span');
        senderSpan.classList.add('sender-name');
        senderSpan.textContent = sender;
        messageContent.appendChild(senderSpan);

        if (text) {
            const textP = document.createElement('p');
            textP.textContent = text;
            messageContent.appendChild(textP);
        }

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('message-time');
        timeSpan.textContent = time;
        messageContent.appendChild(timeSpan);

        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- إرسال الرسائل للخادم ---
    sendMessageButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const now = new Date();
            const timestamp = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
            const currentUserName = localStorage.getItem('userName') || 'أنت';
            
            // عرض الرسالة عندك
            displayMessage(currentUserName, messageText, 'sent', timestamp);
            
            // إرسال الرسالة للخادم
            socket.emit('chatMessage', {
                senderName: currentUserName,
                text: messageText,
                time: timestamp
            });

            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageButton.click();
        }
    });

    // --- استقبال الرسائل من الخادم ---
    socket.on('message', (data) => {
        displayMessage(data.senderName, data.text, 'received', data.time);
    });

    // إعدادات الملف الشخصي (نفس الكود الخاص بك لتغيير الاسم والـ ID)
    const profileSettingsButton = document.querySelector('.profile-settings-button');
    const profileModal = document.getElementById('profileModal');
    const closeButton = profileModal.querySelector('.close-button');
    const saveProfileInfoButton = document.getElementById('saveProfileInfo');
    const userNameInput = document.getElementById('userName');

    profileSettingsButton.addEventListener('click', () => profileModal.style.display = 'block');
    closeButton.addEventListener('click', () => profileModal.style.display = 'none');
    
    saveProfileInfoButton.addEventListener('click', () => {
        localStorage.setItem('userName', userNameInput.value);
        profileModal.style.display = 'none';
    });
});

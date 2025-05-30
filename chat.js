// هذا الكود سيعمل بشكل كامل فقط مع خادم Node.js و Socket.IO.
// بدون الخادم، لن يتم إرسال أو استقبال الرسائل في الوقت الفعلي.

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // التحقق من حالة الدخول - منع الوصول المباشر
    // ----------------------------------------------------
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = "index.html"; // إعادة التوجيه لصفحة الدخول
        return; // إيقاف تنفيذ باقي الكود في هذه الصفحة
    }
    // ----------------------------------------------------

    document.body.classList.add('chat-page');

    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    const imageUpload = document.getElementById('imageUpload');
    const fileUpload = document.getElementById('fileUpload');

    // عناصر ملف المستخدم
    const profileSettingsButton = document.querySelector('.profile-settings-button');
    const profileModal = document.getElementById('profileModal');
    const closeButton = profileModal.querySelector('.close-button');
    const profileImageUpload = document.getElementById('profileImageUpload');
    const profileImageDisplay = document.getElementById('profileImageDisplay');
    const userNameInput = document.getElementById('userName');
    const userHandleInput = document.getElementById('userHandle');
    const userIdInput = document.getElementById('userId');
    const generateNewIdButton = document.getElementById('generateNewId');
    const saveProfileInfoButton = document.getElementById('saveProfileInfo');

    // دالة لإنشاء ID عشوائي مكون من 4 أرقام
    function generateUserId() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // تحميل معلومات المستخدم المحفوظة (إذا وجدت)
    // نستخدم localStorage لحفظ معلومات الملف الشخصي بشكل دائم في المتصفح
    const savedUserName = localStorage.getItem('userName');
    const savedUserHandle = localStorage.getItem('userHandle');
    const savedUserId = localStorage.getItem('userId');
    const savedProfileImage = localStorage.getItem('profileImage');

    if (savedUserName) userNameInput.value = savedUserName;
    if (savedUserHandle) userHandleInput.value = savedUserHandle;
    if (savedUserId) {
        userIdInput.value = savedUserId;
    } else {
        // إذا لم يكن هناك ID محفوظ، قم بتوليد واحد جديد وحفظه
        const newId = generateUserId();
        userIdInput.value = newId;
        localStorage.setItem('userId', newId);
    }
    
    if (savedProfileImage) {
        profileImageDisplay.src = savedProfileImage;
    } else {
        profileImageDisplay.src = 'default-profile.png'; // الصورة الافتراضية
    }

    // إظهار/إخفاء نافذة ملف المستخدم
    profileSettingsButton.addEventListener('click', () => {
        profileModal.style.display = "flex"; // استخدام flex لتوسيط المحتوى
    });

    closeButton.addEventListener('click', () => {
        profileModal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target == profileModal) { // إغلاق المودال عند النقر خارج المحتوى
            profileModal.style.display = "none";
        }
    });

    // تحميل صورة الملف الشخصي
    profileImageUpload.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImageDisplay.src = e.target.result;
                localStorage.setItem('profileImage', e.target.result); // حفظ الصورة كـ Base64
            };
            reader.readAsDataURL(file);
        }
    });

    // إنشاء ID جديد
    generateNewIdButton.addEventListener('click', () => {
        const newId = generateUserId();
        userIdInput.value = newId;
        localStorage.setItem('userId', newId); // حفظ الـ ID الجديد
    });

    // حفظ معلومات الملف الشخصي
    saveProfileInfoButton.addEventListener('click', () => {
        localStorage.setItem('userName', userNameInput.value);
        localStorage.setItem('userHandle', userHandleInput.value);
        // userId تم حفظه بالفعل عند التوليد أو التحميل
        alert('تم حفظ معلومات الملف الشخصي بنجاح!');
        profileModal.style.display = "none";
    });

    // وظيفة لعرض الرسالة في واجهة المستخدم
    function displayMessage(senderName, messageText, type, timestamp, imageUrl = null, fileUrl = null, fileName = null, profilePic = 'default-profile.png') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('sender-name');
        nameSpan.textContent = senderName;

        const messageContent = document.createElement('p');
        messageContent.textContent = messageText;

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('timestamp');
        timeSpan.textContent = timestamp;

        messageDiv.appendChild(nameSpan);
        messageDiv.appendChild(messageContent);

        if (imageUrl) {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = "صورة مرفقة";
            messageDiv.appendChild(imgElement);
        }

        if (fileUrl && fileName) {
            const fileLink = document.createElement('a');
            fileLink.href = fileUrl;
            fileLink.textContent = `تحميل: ${fileName}`;
            fileLink.target = "_blank";
            messageDiv.appendChild(fileLink);
        }

        messageDiv.appendChild(timeSpan);
        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // منطق إرسال الرسائل
    sendMessageButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const now = new Date();
            const timestamp = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()} ${now.getHours() >= 12 ? 'م' : 'ص'}`;
            
            const currentUserName = localStorage.getItem('userName') || 'أنت';
            displayMessage(currentUserName, messageText, 'sent', timestamp);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessageButton.click();
        }
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                const now = new Date();
                const timestamp = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()} ${now.getHours() >= 12 ? 'م' : 'ص'}`;
                const currentUserName = localStorage.getItem('userName') || 'أنت';
                displayMessage(currentUserName, '', 'sent', timestamp, imageUrl);
                imageUpload.value = '';
            };
            reader.readAsDataURL(file);
        }
    });

    fileUpload.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const now = new Date();
            const timestamp = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()} ${now.getHours() >= 12 ? 'م' : 'ص'}`;
            const dummyFileUrl = '#'; // في مشروع حقيقي، هذا سيكون رابط الملف بعد تحميله على الخادم
            const currentUserName = localStorage.getItem('userName') || 'أنت';
            displayMessage(currentUserName, '', 'sent', timestamp, null, dummyFileUrl, file.name);
            fileUpload.value = '';
        }
    });

    // محاكاة لرسائل مستلمة (للتجربة فقط بدون خادم)
    setTimeout(() => {
        displayMessage('صديق مبرمج 1', 'مرحباً بالجميع! من مستعد للبرمجة الليلة؟', 'received', '10:00 ص');
    }, 2000);
    setTimeout(() => {
        displayMessage('صديقة الكود', 'أنا جاهزة! هل نبدأ بمشروعنا الجديد؟', 'received', '10:01 ص');
    }, 4000);
});
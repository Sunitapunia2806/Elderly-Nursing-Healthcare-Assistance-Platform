const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });
}

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme") || "light";

document.documentElement.setAttribute("data-theme", currentTheme);
themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

let modal;
let closeBtn;
let bookingForm;
let toastContainer;
let caregiversState = [];
let usersState = [];
let currentUser = JSON.parse(localStorage.getItem('careCurrentUser') || 'null');
let savedUsers = JSON.parse(localStorage.getItem('careUsers') || 'null') || [
  { name: 'John Doe', email: 'john@example.com', password: 'password123' }
];
let notificationsState = [
  { id: 'n1', message: 'Sarah Khan confirmed your next visit for tomorrow.', time: '2h ago', unread: true },
  { id: 'n2', message: 'Medication reminder: Give Mr. Sharma his morning dose.', time: '4h ago', unread: true },
  { id: 'n3', message: 'Your care plan has been updated with new exercise routines.', time: '1d ago', unread: false }
];

const faqItems = [
  { question: 'How do I book a caregiver?', answer: 'Use the booking form or quick action buttons to select your service, preferred date, and time. We will match you with a verified caregiver shortly.' },
  { question: 'Can I change booking dates later?', answer: 'Yes, our team can reschedule or update your care plan based on your needs. Contact support or use the booking form to request changes.' },
  { question: 'Are caregivers verified before visits?', answer: 'Absolutely. Every caregiver is screened, verified, and trained to deliver safe and compassionate elderly care at home.' }
];

let chatMessages = [
  { text: 'Hi! How can we help you with elderly care today?', sender: 'bot', time: new Date() }
];

let patientProfile = {
  name: 'John Doe',
  age: 72,
  phone: '+91 98765 43210',
  emergencyContact: 'Jane Doe (+91 98765 43211)',
  medicalConditions: 'Hypertension, Diabetes',
  memberSince: 'January 2024'
};

let recentBookings = [
  { id: 'b1', service: 'Nursing Care', plan: 'weekly', date: '2024-05-15', time: '10:00 AM', caregiver: 'Sarah Khan', status: 'confirmed' },
  { id: 'b2', service: 'Physiotherapy', plan: 'monthly', date: '2024-05-18', time: '2:00 PM', caregiver: 'Arjun Rao', status: 'pending' },
  { id: 'b3', service: 'Elderly Attendant', plan: 'yearly', date: '2024-05-20', time: '9:00 AM', caregiver: 'Nazia Malik', status: 'confirmed' }
];

let currentCalendarDate = new Date();
let selectedDate = null;

const sampleCaregivers = [
  {
    id: '1',
    name: 'Sarah Khan',
    position: 'Lead Senior Nurse',
    specialty: 'Nursing care, medication management, patient comfort',
    rating: '4.9 ★',
    availability: ['morning', 'afternoon'],
    bio: 'Sarah is a senior nurse with compassionate bedside care, medication support, and chronic condition monitoring for elderly clients.',
    education: 'MSc Nursing, University of Mumbai',
    certifications: 'BLS, Advanced Geriatric Care, Medication Safety',
    languages: ['English', 'Hindi'],
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    services: ['nursing', 'home']
  },
  {
    id: '2',
    name: 'Arjun Rao',
    position: 'Senior Physiotherapist',
    specialty: 'Rehab plans, mobility support, therapeutic exercise',
    rating: '4.8 ★',
    availability: ['afternoon', 'evening'],
    bio: 'Arjun is a physiotherapist expert in safe movement, gentle rehab exercises, and strength-building after injury or surgery.',
    education: 'Bachelor of Physiotherapy, St. John’s Institute',
    certifications: 'Orthopedic Rehabilitation, Balance Training',
    languages: ['English', 'Kannada'],
    image: 'https://randomuser.me/api/portraits/men/34.jpg',
    services: ['physiotherapy']
  },
  {
    id: '3',
    name: 'Nazia Malik',
    position: 'Elderly Care Specialist',
    specialty: 'Dementia care, personal assistance, emotional support',
    rating: '4.9 ★',
    availability: ['morning', 'evening'],
    bio: 'Nazia supports seniors with daily living, dementia-friendly care, and respectful companionship during every shift.',
    education: 'Diploma in Elder Care, National Care Academy',
    certifications: 'Dementia Support, Personal Care Assistance',
    languages: ['English', 'Urdu'],
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    services: ['dementia', 'home']
  }
];

const sampleReviews = [
  {
    name: 'Rekha S.',
    rating: 5,
    message: 'CareBridge24 matched us with a wonderful caregiver who understood my father’s needs immediately.'
  },
  {
    name: 'Mahesh P.',
    rating: 4,
    message: 'Fast booking, dependable service, and clear updates through the whole process.'
  },
  {
    name: 'Anita D.',
    rating: 5,
    message: 'The staff were kind, punctual, and very gentle with our elderly relative.'
  }
];

function persistAuthState() {
  localStorage.setItem('careCurrentUser', JSON.stringify(currentUser));
  localStorage.setItem('careUsers', JSON.stringify(savedUsers));
}

function renderAuthState() {
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userStatus = document.getElementById('userStatus');

  if (!authBtn || !logoutBtn || !userStatus) return;

  if (currentUser) {
    authBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    userStatus.classList.remove('hidden');
    userStatus.textContent = `Welcome, ${currentUser.name || currentUser.email}`;
  } else {
    authBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    userStatus.classList.add('hidden');
    userStatus.textContent = '';
  }
}

function showToast(message, type = 'success') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3800);
}

function renderCaregivers(caregivers) {
  const caregiversGrid = document.querySelector('#caregivers .grid');
  if (!caregiversGrid) return;

  caregiversGrid.innerHTML = caregivers.map(caregiver => {
    return `
      <article class="caregiver">
        <img class="caregiver-img" src="${caregiver.image}" alt="${caregiver.name}" />
        <div class="caregiver-top">
          <h3>${caregiver.name}</h3>
          <p class="caregiver-role">${caregiver.position}</p>
        </div>
        <p class="caregiver-specialty">${caregiver.specialty}</p>
        <span>${caregiver.rating}</span>
        <div class="caregiver-details hidden" id="caregiver-details-${caregiver.id}">
          <p>${caregiver.bio}</p>
          <div class="caregiver-detail-item"><strong>Education:</strong> ${caregiver.education}</div>
          <div class="caregiver-detail-item"><strong>Certifications:</strong> ${caregiver.certifications}</div>
          <div class="caregiver-detail-item"><strong>Languages:</strong> ${caregiver.languages.join(', ')}</div>
        </div>
        <button class="btn learn-more-btn" data-id="${caregiver.id}">Learn More</button>
      </article>
    `;
  }).join('');
}

function filterCaregivers() {
  const query = document.getElementById('caregiverSearch')?.value.toLowerCase() || '';
  const service = document.getElementById('serviceFilter')?.value || '';
  const availability = document.getElementById('availabilityFilter')?.value || '';

  const filtered = caregiversState.filter(caregiver => {
    const matchesQuery = query === '' || [caregiver.name, caregiver.specialty, caregiver.position, caregiver.languages.join(' ')].some(field => field.toLowerCase().includes(query));
    const matchesService = service === '' || caregiver.services.includes(service);
    const matchesAvailability = availability === '' || caregiver.availability.includes(availability);
    return matchesQuery && matchesService && matchesAvailability;
  });

  renderCaregivers(filtered.length ? filtered : caregiversState);
}

function setupFilters() {
  const search = document.getElementById('caregiverSearch');
  const service = document.getElementById('serviceFilter');
  const availability = document.getElementById('availabilityFilter');

  [search, service, availability].forEach(element => {
    if (!element) return;
    element.addEventListener('input', filterCaregivers);
  });
}

function renderReviews(reviews) {
  const reviewsGrid = document.getElementById('reviewsGrid');
  if (!reviewsGrid) return;

  reviewsGrid.innerHTML = reviews.map(review => `
    <article class="review-card">
      <strong>${review.name}</strong>
      <span>${'★'.repeat(review.rating)}</span>
      <p>${review.message}</p>
    </article>
  `).join('');
}

function setupDashboardActions() {
  const bookNowBtn = document.getElementById('bookNowBtn');
  const feedbackBtn = document.getElementById('feedbackBtn');

  if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
      const bookingModal = document.getElementById('bookingModal');
      const authModal = document.getElementById('authModal');
      if (!currentUser) {
        openModal(authModal);
      } else if (bookingModal) {
        openModal(bookingModal);
      }
    });
  }

  if (feedbackBtn) {
    feedbackBtn.addEventListener('click', () => {
      document.getElementById('reviewName')?.focus();
      showToast('Feedback form opened. Thank you for sharing your experience!');
    });
  }
}

function loadReviews() {
  renderReviews(sampleReviews);

  const reviewForm = document.getElementById('reviewForm');
  if (!reviewForm) return;

  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const rating = Number(document.getElementById('reviewRating').value);
    const message = document.getElementById('reviewMessage').value.trim();

    if (!name || !message) {
      showToast('Please complete your review before submitting.', 'error');
      return;
    }

    sampleReviews.unshift({ name, rating, message });
    renderReviews(sampleReviews.slice(0, 6));
    reviewForm.reset();
    showToast('Thank you! Your review has been added.');
  });
}

function openModal(modal) {
  modal.style.display = 'block';
}

function closeModal(modal) {
  modal.style.display = 'none';
}

function setupModal() {
  const bookingModal = document.getElementById('bookingModal');
  const authModal = document.getElementById('authModal');
  bookingForm = document.getElementById('bookingForm');
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const googleLoginBtn = document.getElementById('googleLoginBtn');

  const toggleModalButtons = [
    document.getElementById('bookBtn'),
    document.getElementById('getStartedBtn'),
    document.getElementById('startBookingBtn'),
    document.getElementById('bookServiceBtn')
  ];

  toggleModalButtons.forEach(btn => {
    if (!btn || !bookingModal) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUser) {
        openModal(authModal);
      } else {
        openModal(bookingModal);
      }
    });
  });

  if (authBtn) {
    authBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(authModal);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      currentUser = null;
      persistAuthState();
      renderAuthState();
      showToast('Logged out successfully.');
    });
  }

  const closeButtons = document.querySelectorAll('.modal .close');
  closeButtons.forEach(button => {
    const modalElement = button.closest('.modal');
    if (!modalElement) return;
    button.addEventListener('click', () => closeModal(modalElement));
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target);
    }
  });

  if (loginTab && registerTab && loginPanel && registerPanel) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginPanel.classList.remove('hidden');
      registerPanel.classList.add('hidden');
    });
    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerPanel.classList.remove('hidden');
      loginPanel.classList.add('hidden');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const user = savedUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) {
        showToast('Login failed: check email and password.', 'error');
        return;
      }
      currentUser = { name: user.name, email: user.email };
      persistAuthState();
      renderAuthState();
      closeModal(authModal);
      showToast('Logged in successfully.');
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;
      if (!name || !email || !password) {
        showToast('Please fill all fields to register.', 'error');
        return;
      }
      if (savedUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showToast('This email is already registered.', 'error');
        return;
      }
      savedUsers.push({ name, email, password });
      currentUser = { name, email };
      persistAuthState();
      renderAuthState();
      closeModal(authModal);
      showToast('Account created and logged in.');
    });
  }

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      const googleUser = { name: 'Google User', email: 'google.user@example.com' };
      currentUser = googleUser;
      if (!savedUsers.some(u => u.email === googleUser.email)) {
        savedUsers.push({ name: googleUser.name, email: googleUser.email, password: '' });
      }
      persistAuthState();
      renderAuthState();
      closeModal(authModal);
      showToast('Logged in with Gmail.');
    });
  }

  renderAuthState();
}

async function loadCaregivers() {
  try {
    const [caregiversResponse, usersResponse] = await Promise.all([
      fetch('http://localhost:3000/api/caregivers'),
      fetch('http://localhost:3000/api/users')
    ]);

    const caregivers = await caregiversResponse.json();
    const users = await usersResponse.json();

    caregiversState = caregivers.length ? caregivers.map(caregiver => ({
      ...caregiver,
      image: caregiver.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(caregiver.id)}&background=3563ff&color=ffffff&rounded=true&size=120`,
      bio: caregiver.bio || 'Trusted professional caring for every senior need.',
      education: caregiver.education || 'Certified Care Provider',
      certifications: caregiver.certifications || 'Senior Care Training',
      languages: caregiver.languages || ['English'],
      position: caregiver.position || 'Caregiver',
      specialty: caregiver.services ? caregiver.services.join(', ') : 'Senior care support',
      rating: caregiver.verified ? '4.9 ★' : 'Pending',
      availability: caregiver.availability || ['morning', 'afternoon']
    })) : sampleCaregivers;

    usersState = users.length ? users : [{ id: '1', name: 'Sarah Khan' }];

    renderCaregivers(caregiversState);
    setupFilters();
  } catch (error) {
    console.error('Error loading caregivers:', error);
    caregiversState = sampleCaregivers;
    renderCaregivers(caregiversState);
    setupFilters();
  }
}

function renderNotifications() {
  const notificationsList = document.getElementById('notificationsList');
  const notificationCount = document.getElementById('notificationCount');

  if (!notificationsList || !notificationCount) return;

  notificationsList.innerHTML = '';

  notificationsState.forEach(notification => {
    const item = document.createElement('div');
    item.className = `notification-item${notification.unread ? ' unread' : ''}`;
    item.innerHTML = `
      <p>${notification.message}</p>
      <span class="muted">${notification.time}</span>
    `;
    notificationsList.appendChild(item);
  });

  const unreadCount = notificationsState.filter(n => n.unread).length;
  notificationCount.textContent = unreadCount.toString();
  notificationCount.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
}

function setupNotificationActions() {
  const markReadBtn = document.getElementById('markReadBtn');
  if (!markReadBtn) return;

  markReadBtn.addEventListener('click', () => {
    notificationsState = notificationsState.map(notification => ({ ...notification, unread: false }));
    renderNotifications();
    showToast('All notifications marked as read.');
  });

  renderNotifications();
}

function renderFAQ() {
  const faqContainer = document.getElementById('faqContainer');
  if (!faqContainer) return;

  faqContainer.innerHTML = '';

  faqItems.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card faq-card';
    card.innerHTML = `
      <button class="faq-question" type="button">${item.question}</button>
      <div class="faq-answer">${item.answer}</div>
    `;
    faqContainer.appendChild(card);
  });

  faqContainer.addEventListener('click', event => {
    const button = event.target.closest('.faq-question');
    if (!button) return;

    const answer = button.nextElementSibling;
    if (!answer) return;

    answer.classList.toggle('open');
    button.classList.toggle('open');
  });
}

function setupCaregiverDelegation() {
  const caregiversGrid = document.querySelector('#caregivers .grid');
  if (!caregiversGrid) return;

  caregiversGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.learn-more-btn');
    if (!button) return;

    const id = button.getAttribute('data-id');
    const details = document.getElementById(`caregiver-details-${id}`);
    if (!details) return;

    const isOpen = details.classList.toggle('show');
    details.classList.toggle('hidden', !isOpen);
    button.textContent = isOpen ? 'Show Less' : 'Learn More';
  });
}

// Chat Widget Functions
function setupChatWidget() {
  const chatToggle = document.getElementById('chatToggle');
  const chatModal = document.querySelector('.chat-modal');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessagesEl = document.getElementById('chatMessages');

  if (!chatToggle || !chatModal) return;

  chatToggle.addEventListener('click', () => {
    chatModal.style.display = chatModal.style.display === 'flex' ? 'none' : 'flex';
  });

  chatClose.addEventListener('click', () => {
    chatModal.style.display = 'none';
  });

  function sendMessage(text, sender = 'user') {
    chatMessages.push({ text, sender, time: new Date() });
    renderChatMessages();
    
    if (sender === 'user') {
      // Simulate bot response
      setTimeout(() => {
        const responses = [
          "Thank you for your message. A care coordinator will respond shortly.",
          "We're here to help! Let us know how we can assist with your elderly care needs.",
          "Our team is available 24/7. We'll get back to you within the hour."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        sendMessage(randomResponse, 'bot');
      }, 1000);
    }
  }

  function renderChatMessages() {
    if (!chatMessagesEl) return;
    chatMessagesEl.innerHTML = '';
    
    chatMessages.forEach(message => {
      const messageEl = document.createElement('div');
      messageEl.className = `message ${message.sender}`;
      messageEl.innerHTML = `
        <p>${message.text}</p>
        <span class="message-time">${message.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      `;
      chatMessagesEl.appendChild(messageEl);
    });
    
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  chatSend.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
      sendMessage(text);
      chatInput.value = '';
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      chatSend.click();
    }
  });

  renderChatMessages();
}

// Profile Dashboard Functions
let isProfileEditing = false;

function setProfileEditMode(editing) {
  const editButton = document.getElementById('editProfileBtn');
  const cancelButton = document.getElementById('cancelEditBtn');
  const displayFields = document.querySelectorAll('.profile-field-display');
  const inputFields = document.querySelectorAll('.profile-field-input');

  isProfileEditing = editing;

  displayFields.forEach(field => {
    field.classList.toggle('hidden', editing);
  });

  inputFields.forEach(field => {
    field.classList.toggle('hidden', !editing);
  });

  if (editButton) {
    editButton.textContent = editing ? 'Save Profile' : 'Edit Profile';
  }

  if (cancelButton) {
    cancelButton.classList.toggle('hidden', !editing);
  }
}

function renderPatientProfile() {
  const patientNameText = document.getElementById('patientNameText');
  const patientNameInput = document.getElementById('patientNameInput');
  const patientAgeEl = document.getElementById('patientAge');
  const patientAgeInput = document.getElementById('patientAgeInput');
  const patientPhoneEl = document.getElementById('patientPhone');
  const patientPhoneInput = document.getElementById('patientPhoneInput');
  const emergencyContactEl = document.getElementById('emergencyContact');
  const emergencyContactInput = document.getElementById('emergencyContactInput');
  const medicalConditionsEl = document.getElementById('medicalConditions');
  const medicalConditionsInput = document.getElementById('medicalConditionsInput');

  if (patientNameText) patientNameText.textContent = patientProfile.name;
  if (patientAgeEl) patientAgeEl.textContent = patientProfile.age;
  if (patientPhoneEl) patientPhoneEl.textContent = patientProfile.phone;
  if (emergencyContactEl) emergencyContactEl.textContent = patientProfile.emergencyContact;
  if (medicalConditionsEl) medicalConditionsEl.textContent = patientProfile.medicalConditions;

  if (patientNameInput) patientNameInput.value = patientProfile.name;
  if (patientAgeInput) patientAgeInput.value = patientProfile.age;
  if (patientPhoneInput) patientPhoneInput.value = patientProfile.phone;
  if (emergencyContactInput) emergencyContactInput.value = patientProfile.emergencyContact;
  if (medicalConditionsInput) medicalConditionsInput.value = patientProfile.medicalConditions;
}

function savePatientProfile() {
  const patientNameInput = document.getElementById('patientNameInput');
  const patientAgeInput = document.getElementById('patientAgeInput');
  const patientPhoneInput = document.getElementById('patientPhoneInput');
  const emergencyContactInput = document.getElementById('emergencyContactInput');
  const medicalConditionsInput = document.getElementById('medicalConditionsInput');

  if (patientNameInput) patientProfile.name = patientNameInput.value || patientProfile.name;
  if (patientAgeInput) patientProfile.age = patientAgeInput.value || patientProfile.age;
  if (patientPhoneInput) patientProfile.phone = patientPhoneInput.value || patientProfile.phone;
  if (emergencyContactInput) patientProfile.emergencyContact = emergencyContactInput.value || patientProfile.emergencyContact;
  if (medicalConditionsInput) patientProfile.medicalConditions = medicalConditionsInput.value || patientProfile.medicalConditions;

  renderPatientProfile();
  setProfileEditMode(false);
  showToast('Profile updated successfully.');
}

function setupProfileActions() {
  const editProfileBtn = document.getElementById('editProfileBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const viewHistoryBtn = document.getElementById('viewHistoryBtn');

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      if (!isProfileEditing) {
        setProfileEditMode(true);
      } else {
        savePatientProfile();
      }
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      renderPatientProfile();
      setProfileEditMode(false);
    });
  }

  if (viewHistoryBtn) {
    viewHistoryBtn.addEventListener('click', () => {
      showToast('Full booking history available in your dashboard.', 'success');
    });
  }
}

// Calendar Functions
function setupCalendar() {
  const dateDisplay = document.getElementById('dateDisplay');
  const calendarWidget = document.getElementById('calendarWidget');
  const prevMonth = document.getElementById('prevMonth');
  const nextMonth = document.getElementById('nextMonth');
  const currentMonth = document.getElementById('currentMonth');
  const calendarGrid = document.getElementById('calendarGrid');

  if (!dateDisplay || !calendarWidget) return;

  dateDisplay.addEventListener('click', () => {
    calendarWidget.classList.toggle('hidden');
  });

  function renderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    currentMonth.textContent = `${currentCalendarDate.toLocaleString('default', { month: 'long' })} ${year}`;
    
    calendarGrid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = date.getDate();
      
      if (date.getMonth() !== month) {
        dayEl.classList.add('disabled');
      } else if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        dayEl.classList.add('selected');
      } else if (date.toDateString() === new Date().toDateString()) {
        dayEl.classList.add('today');
      }
      
      if (!dayEl.classList.contains('disabled')) {
        dayEl.addEventListener('click', () => {
          selectedDate = new Date(date);
          document.getElementById('date').value = selectedDate.toISOString().split('T')[0];
          dateDisplay.value = selectedDate.toLocaleDateString();
          renderCalendar();
          calendarWidget.classList.add('hidden');
        });
      }
      
      calendarGrid.appendChild(dayEl);
    }
  }

  prevMonth.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonth.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
}

// Load caregivers on page load
document.addEventListener('DOMContentLoaded', () => {
  toastContainer = document.getElementById('toastContainer');
  setupCaregiverDelegation();
  setupModal();
  setupDashboardActions();
  setupNotificationActions();
  renderFAQ();
  setupChatWidget();
  renderPatientProfile();
  renderRecentBookings();
  setupProfileActions();
  setupCalendar();
  loadCaregivers();
  loadReviews();
  loadStats();
});

// Fetch and display stats
async function loadStats() {
  try {
    const [usersResponse, caregiversResponse, bookingsResponse] = await Promise.all([
      fetch('http://localhost:3000/api/users'),
      fetch('http://localhost:3000/api/caregivers'),
      fetch('http://localhost:3000/api/bookings')
    ]);
    const users = await usersResponse.json();
    const caregivers = await caregiversResponse.json();
    const bookings = await bookingsResponse.json();
    
    const familiesServed = users.filter(u => u.role === 'patient').length + bookings.length; // Approximate
    const verifiedCaregivers = caregivers.filter(c => c.verified).length;
    const averageRating = 4.8; // Static for now
    
    const stats = document.querySelectorAll('.stats div');
    if (stats.length >= 3) {
      stats[0].innerHTML = `<strong>${familiesServed}+</strong><span>Families Served</span>`;
      stats[1].innerHTML = `<strong>${verifiedCaregivers}+</strong><span>Verified Caregivers</span>`;
      stats[2].innerHTML = `<strong>${averageRating}/5</strong><span>Average Rating</span>`;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}



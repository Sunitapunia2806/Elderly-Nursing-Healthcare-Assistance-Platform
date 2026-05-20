document.addEventListener('DOMContentLoaded', () => {
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

// Modal functionality (booking + auth)
const bookingModal = document.getElementById("bookingModal");
const authModal = document.getElementById("authModal");
const bookingForm = document.getElementById("bookingForm");

const bookBtns = [
  document.getElementById("bookBtn"),
  document.getElementById("getStartedBtn"),
  document.getElementById("startBookingBtn"),
  document.getElementById("bookServiceBtn")
];

// Simple auth state stored in localStorage for demo purposes
let savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
let currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'null');

const persistUsers = () => localStorage.setItem('savedUsers', JSON.stringify(savedUsers));
const persistCurrentLocal = () => localStorage.setItem('currentUser', JSON.stringify(currentUser));
const persistCurrentSession = () => sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
const clearStoredCurrent = () => { localStorage.removeItem('currentUser'); sessionStorage.removeItem('currentUser'); }

const openModal = (el) => { if (!el) return; el.style.display = 'block'; }
const closeModal = (el) => { if (!el) return; el.style.display = 'none'; }

const renderAuthState = () => {
  const userStatus = document.getElementById('userStatus');
  const logoutBtn = document.getElementById('logoutBtn');
  const headerLoginBtn = document.getElementById('headerLoginBtn');
  const headerRegisterBtn = document.getElementById('headerRegisterBtn');
  const bookBtn = document.getElementById('bookBtn');

  if (currentUser) {
    if (userStatus) { userStatus.textContent = `Hi, ${currentUser.name || currentUser.email}`; userStatus.classList.remove('hidden'); }
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    if (headerLoginBtn) headerLoginBtn.classList.add('hidden');
    if (headerRegisterBtn) headerRegisterBtn.classList.add('hidden');
  } else {
    if (userStatus) userStatus.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (headerLoginBtn) headerLoginBtn.classList.remove('hidden');
    if (headerRegisterBtn) headerRegisterBtn.classList.remove('hidden');
  }
}

// Booking buttons open booking modal only when logged in
bookBtns.forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentUser) {
      openModal(authModal);
    } else {
      openModal(bookingModal);
    }
  });
});

// Header login/register triggers
const headerLoginBtn = document.getElementById('headerLoginBtn');
const headerRegisterBtn = document.getElementById('headerRegisterBtn');
if (headerLoginBtn) headerLoginBtn.addEventListener('click', () => openModal(authModal));
if (headerRegisterBtn) headerRegisterBtn.addEventListener('click', () => { openModal(authModal); document.getElementById('registerTab').click(); });

// Modal close handlers (for any modal with .close)
document.querySelectorAll('.modal .close').forEach(btn => {
  const target = btn.getAttribute('data-target');
  btn.addEventListener('click', () => {
    // if explicit target provided, close that, otherwise close nearest modal
    if (target) document.getElementById(target)?.style && (document.getElementById(target).style.display = 'none');
    else btn.closest('.modal')?.style && (btn.closest('.modal').style.display = 'none');
  });
});

window.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// AUTH: tabs and forms
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginPanel = document.getElementById('loginPanel');
const registerPanel = document.getElementById('registerPanel');

if (loginTab && registerTab && loginPanel && registerPanel) {
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active'); registerTab.classList.remove('active');
    loginPanel.classList.remove('hidden'); registerPanel.classList.add('hidden');
  });
  registerTab.addEventListener('click', () => {
    registerTab.classList.add('active'); loginTab.classList.remove('active');
    registerPanel.classList.remove('hidden'); loginPanel.classList.add('hidden');
  });
}

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!isValidEmail(email)) { alert('Please enter a valid email address.'); return; }
    if (!password) { alert('Please enter your password.'); return; }
    const user = savedUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) { alert('Login failed: check email/password.'); return; }
    // Ensure server-side user exists and capture id
    try {
      const resp = await fetch('/api/users');
      if (resp.ok) {
        const users = await resp.json();
        const serverUser = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
        if (serverUser) {
          currentUser = { id: serverUser.id, name: user.name, email: user.email };
        } else {
          // create server user
          const createResp = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: user.name, email: user.email, role: 'patient' }) });
          const created = await createResp.json();
          currentUser = { id: created.id, name: user.name, email: user.email };
        }
      } else {
        currentUser = { name: user.name, email: user.email };
      }
    } catch (err) {
      currentUser = { name: user.name, email: user.email };
    }

    const remember = document.getElementById('loginRemember')?.checked;
    clearStoredCurrent();
    if (remember) persistCurrentLocal(); else persistCurrentSession();
    renderAuthState();
    closeModal(authModal);
    alert(`Hii ${user.name}, welcome back!`);
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    if (!name || !email || !password) { alert('Please fill all fields.'); return; }
    if (!isValidEmail(email)) { alert('Please enter a valid email.'); return; }
    if (password.length < 6) { alert('Password must be at least 6 characters.'); return; }
    if (savedUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) { alert('Email already registered.'); return; }
    savedUsers.push({ name, email, password });
    persistUsers();

    // create server-side user and capture id
    try {
      const resp = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, role: 'patient' }) });
      if (resp.ok) {
        const created = await resp.json();
        currentUser = { id: created.id, name, email };
      } else {
        currentUser = { name, email };
      }
    } catch (err) {
      currentUser = { name, email };
    }

    const remember = document.getElementById('registerRemember')?.checked;
    clearStoredCurrent();
    if (remember) persistCurrentLocal(); else persistCurrentSession();
    renderAuthState();
    closeModal(authModal);
    alert(`Hii ${name}, welcome!`);
  });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', () => {
  currentUser = null; clearStoredCurrent(); renderAuthState(); alert('Logged out successfully.');
});

// initial render
renderAuthState();

// Caregiver profile handlers
document.querySelectorAll('.view-profile').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = btn.closest('.caregiver');
    if (!card) return;
    const name = card.dataset.name || '';
    const role = card.dataset.role || '';
    const experience = card.dataset.experience || '';
    const languages = card.dataset.languages || '';
    const rating = card.dataset.rating || '';
    const bio = card.dataset.bio || '';
    const availability = card.dataset.availability || '';
    const img = card.querySelector('.profile-img')?.src || 'https://i.pravatar.cc/120';

    document.getElementById('profileImg').src = img;
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileRole').textContent = `${role} • ${experience}`;
    document.getElementById('profileRating').textContent = `${rating} ★`;
    document.getElementById('profileLanguages').textContent = languages;
    document.getElementById('profileBio').textContent = bio;
    document.getElementById('profileAvailability').textContent = availability;

    openModal(document.getElementById('profileModal'));
  });
});

// Password toggle buttons
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    if (!input) return;
    if (input.type === 'password') { input.type = 'text'; btn.textContent = 'Hide'; }
    else { input.type = 'password'; btn.textContent = 'Show'; }
  });
});

// Password strength indicator for register
const pwInput = document.getElementById('registerPassword');
const pwStrength = document.getElementById('pwStrength');
if (pwInput && pwStrength) {
  pwInput.addEventListener('input', () => {
    const v = pwInput.value;
    const score = (v.length > 7) + /[A-Z]/.test(v) + /[0-9]/.test(v) + /[^A-Za-z0-9]/.test(v);
    let text = 'Weak'; let color = '#e11d48';
    if (score >= 3) { text = 'Good'; color = '#f59e0b'; }
    if (score >= 4) { text = 'Strong'; color = '#10b981'; }
    if (v.length === 0) { text = ''; }
    pwStrength.textContent = text ? `Password strength: ${text}` : '';
    pwStrength.style.color = color;
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Contact and book actions from profile
const contactBtn = document.getElementById('contactBtn');
const bookWithBtn = document.getElementById('bookWithBtn');
const setReminderBtn = document.getElementById('setReminderBtn');
if (contactBtn) contactBtn.addEventListener('click', () => alert('Contact request sent — caregiver will reach out soon.'));
if (bookWithBtn) bookWithBtn.addEventListener('click', () => {
  const profileModalEl = document.getElementById('profileModal');
  closeModal(profileModalEl);
  // open booking modal (requires auth)
  if (!currentUser) openModal(authModal);
  else openModal(bookingModal);
});
if (setReminderBtn) setReminderBtn.addEventListener('click', () => {
  // open reminder modal
  openModal(document.getElementById('reminderModal'));
});

// FAQ Accordion
const faqButtons = document.querySelectorAll('.faq-question');
faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon');
    const isOpen = item.classList.toggle('open');
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0px';
    icon.textContent = isOpen ? '−' : '+';
  });
});

// Notifications / calendar tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const calendarLabel = document.getElementById('calendarLabel');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('calendarPrev');
const nextMonthBtn = document.getElementById('calendarNext');

let calendarDate = new Date();

const renderCalendar = () => {
  if (!calendarLabel || !calendarDays) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  calendarLabel.textContent = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  calendarDays.innerHTML = '';
  for (let i = 0; i < firstDay; i += 1) {
    const emptyCell = document.createElement('div');
    calendarDays.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateBtn = document.createElement('button');
    dateBtn.type = 'button';
    dateBtn.textContent = day;
    if (isCurrentMonth && day === today.getDate()) {
      dateBtn.classList.add('active');
    }
    calendarDays.appendChild(dateBtn);
  }
};

if (tabButtons.length) {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabPanels.forEach((panel) => panel.classList.remove('active'));
      button.classList.add('active');
      const target = document.getElementById(button.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}

if (prevMonthBtn) {
  prevMonthBtn.addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  });
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  });
}

renderCalendar();

// Reminders: create and schedule notifications
const reminderForm = document.getElementById('reminderForm');
const reminderModal = document.getElementById('reminderModal');

async function scheduleReminder(reminder) {
  try {
    const now = Date.now();
    const remindAt = new Date(reminder.time).getTime();
    const ms = remindAt - now;
    if (ms <= 0) return; // past
    setTimeout(() => {
      // show notification
      if (window.Notification && Notification.permission === 'granted') {
        new Notification(reminder.title || 'Reminder', { body: reminder.title });
      } else {
        alert(`Reminder: ${reminder.title}`);
      }
      // handle repeats
      if (reminder.repeat === 'daily') {
        // re-schedule for next day
        reminder.time = new Date(new Date(reminder.time).getTime() + 24 * 60 * 60 * 1000).toISOString();
        fetch('/api/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reminder) }).catch(() => {});
      }
    }, ms);
  } catch (err) {
    console.warn('Failed to schedule reminder', err);
  }
}

// Load and schedule reminders for current user
async function loadAndScheduleReminders() {
  if (!currentUser) return;
  try {
    const resp = await fetch('/api/reminders');
    if (!resp.ok) return;
    const list = await resp.json();
    const mine = list.filter(r => r.patientId === (currentUser.id || currentUser.email));
    mine.forEach(r => {
      // unify time as ISO
      const timeIso = new Date(r.time).toISOString();
      scheduleReminder({ ...r, time: timeIso });
    });
  } catch (err) { console.warn(err); }
}

// Request notification permission upfront
if (window.Notification && Notification.permission !== 'granted') {
  Notification.requestPermission().then(() => {});
}

if (reminderForm) {
  reminderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('reminderTitle').value.trim();
    const date = document.getElementById('reminderDate').value;
    const time = document.getElementById('reminderTime').value;
    const repeat = document.getElementById('reminderRepeat').value;
    if (!title || !date || !time) { alert('Please fill all fields'); return; }
    const iso = new Date(`${date}T${time}`).toISOString();
    const payload = { patientId: (currentUser && (currentUser.id || currentUser.email)) || null, title, time: iso, repeat };
    try {
      const resp = await fetch('/api/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (resp.ok) {
        const created = await resp.json();
        scheduleReminder({ ...created, time: created.time || iso });
        alert('Reminder saved');
      } else {
        alert('Failed to save reminder');
      }
    } catch (err) {
      console.warn(err);
      alert('Failed to save reminder (network)');
    }
    reminderForm.reset();
    closeModal(reminderModal);
  });
}

const cancelReminder = document.getElementById('cancelReminder');
if (cancelReminder) cancelReminder.addEventListener('click', () => closeModal(reminderModal));

// schedule existing reminders after auth state is rendered
setTimeout(loadAndScheduleReminders, 1000);

// Live chat widget
const chatBtn = document.getElementById('openChatBtn');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('closeChatBtn');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');

if (chatBtn && chatWidget) {
  chatBtn.addEventListener('click', () => {
    chatWidget.classList.add('active');
    chatInput.focus();
  });
}

if (chatClose && chatWidget) {
  chatClose.addEventListener('click', () => {
    chatWidget.classList.remove('active');
  });
}

const postChatMessage = (text, sender) => {
  const message = document.createElement('div');
  message.className = `chat-message ${sender}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

const sendChatMessage = () => {
  const text = chatInput.value.trim();
  if (!text) return;
  postChatMessage(text, 'user');
  chatInput.value = '';
  setTimeout(() => {
    postChatMessage('Thank you! One of our agents will respond shortly. In the meantime, you can ask about caregiver profiles, schedules, or booking details.', 'bot');
  }, 500);
};

if (chatSendBtn) {
  chatSendBtn.addEventListener('click', sendChatMessage);
}

if (chatInput) {
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendChatMessage();
    }
  });
}

// Form submission - send to backend with fallback to localStorage
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    id: Date.now(),
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    service: document.getElementById("service").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    message: document.getElementById("message").value,
    timestamp: new Date().toISOString()
  };

  // Try to POST booking to backend API
  try {
    const telehealth = !!document.getElementById('telehealth')?.checked;
    const patientId = (currentUser && currentUser.id) ? currentUser.id : ((currentUser && currentUser.email) ? currentUser.email : formData.email);

    if (telehealth) {
      // create an appointment with telehealth room
      const payload = {
        patientId,
        with: '',
        date: `${formData.date} ${formData.time}`,
        notes: `Name: ${formData.name}; Phone: ${formData.phone}; ${formData.message}`,
        telehealth: true
      };
      try {
        const resp = await fetch('/api/appointments', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const created = await resp.json();
        console.log('Appointment created:', created);
        if (created.joinUrl) {
          const join = confirm('Telehealth appointment scheduled. Join now?');
          if (join) window.open(created.joinUrl, '_blank');
        }
        alert('Telehealth appointment scheduled successfully.');
      } catch (err) {
        console.warn('Failed to create telehealth appointment, saving locally', err);
        const appts = JSON.parse(localStorage.getItem('appointments') || '[]');
        appts.push({ ...formData, telehealth: true });
        localStorage.setItem('appointments', JSON.stringify(appts));
        alert('Telehealth appointment saved locally (offline).');
      }
    } else {
      const payload = {
        patientId,
        caregiverId: '',
        service: formData.service,
        date: `${formData.date} ${formData.time}`,
        notes: `Name: ${formData.name}; Phone: ${formData.phone}; ${formData.message}`
      };

      const resp = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) throw new Error(`Status ${resp.status}`);

      const saved = await resp.json();
      console.log('Booking saved to backend:', saved);
      alert('Booking submitted successfully and saved to backend.');
    }
  } catch (err) {
    console.warn('Failed to save booking to backend, falling back to localStorage:', err);
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(formData);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    alert("Booking saved locally (offline). It will not appear in the backend until network is available.");
  }

  // Reset form and close modal
  bookingForm.reset();
  bookingModal.style.display = "none";
});
});

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#navLinks');
const year = document.querySelector('#year');
const liveTime = document.querySelector('#liveTime');
const slipList = document.querySelector('#slipList');
const refreshAvailability = document.querySelector('#refreshAvailability');
const bookingForm = document.querySelector('#bookingForm');
const formNote = document.querySelector('#formNote');
const monthsSelect = document.querySelector('#months');
const estimatedTotal = document.querySelector('#estimatedTotal');
const webcamButtons = document.querySelectorAll('.webcam-tabs button');
const cameraTitle = document.querySelector('.camera-frame h3');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('main section[id]');
const reveals = document.querySelectorAll('.reveal');

const monthlySlipRate = 250;
const totalSlips = 8;

const slipStatuses = [
  { number: 1, status: 'Available' },
  { number: 2, status: 'Available' },
  { number: 3, status: 'Available' },
  { number: 4, status: 'Pending' },
  { number: 5, status: 'Available' },
  { number: 6, status: 'Available' },
  { number: 7, status: 'Available' },
  { number: 8, status: 'Available' }
];

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function renderSlips() {
  if (!slipList) return;

  slipList.innerHTML = '';

  slipStatuses.forEach((slip) => {
    const item = document.createElement('div');
    const statusClass = slip.status.toLowerCase();

    item.className = 'slip-item';
    item.innerHTML = `
      <strong>Slip ${slip.number}</strong>
      <span>$${monthlySlipRate}/month</span>
      <em class="status ${statusClass}">${slip.status}</em>
    `;

    slipList.appendChild(item);
  });
}

function refreshSlipStatus() {
  const availableCount = slipStatuses.filter((slip) => slip.status === 'Available').length;

  if (!refreshAvailability) return;

  refreshAvailability.textContent = `${availableCount} of ${totalSlips} Available`;
  window.setTimeout(() => {
    refreshAvailability.textContent = 'Refresh Status';
  }, 2200);
}

if (refreshAvailability) {
  refreshAvailability.addEventListener('click', refreshSlipStatus);
}

function updateEstimate() {
  if (!monthsSelect || !estimatedTotal) return;

  const months = Number(monthsSelect.value || 1);
  const total = months * monthlySlipRate;
  estimatedTotal.textContent = `$${total.toLocaleString()}`;
}

if (monthsSelect) {
  monthsSelect.addEventListener('change', updateEstimate);
}

function updateLiveTime() {
  if (!liveTime) return;

  const now = new Date();
  liveTime.textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

webcamButtons.forEach((button) => {
  button.addEventListener('click', () => {
    webcamButtons.forEach((tab) => tab.classList.remove('active'));
    button.classList.add('active');

    const camera = button.dataset.camera || 'Live Camera';
    if (cameraTitle) {
      cameraTitle.textContent = `${camera} Coming Soon`;
    }
  });
});

if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const name = formData.get('name') || 'there';
    const requestType = formData.get('requestType') || 'request';
    const months = formData.get('months') || '1';
    const estimate = Number(months) * monthlySlipRate;

    formNote.textContent = `Thanks, ${name}. Your ${requestType.toString().toLowerCase()} inquiry is ready to be sent. Estimated slip total: $${estimate.toLocaleString()}.`;
    formNote.style.color = '#1268d6';
    bookingForm.reset();
    updateEstimate();
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

reveals.forEach((item) => revealObserver.observe(item));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.45 });

sections.forEach((section) => navObserver.observe(section));

renderSlips();
updateEstimate();
updateLiveTime();
setInterval(updateLiveTime, 1000);

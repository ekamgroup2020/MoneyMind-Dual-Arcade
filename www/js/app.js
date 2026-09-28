// Main App Logic

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('mainMenu').style.display = 'none';
  document.getElementById('game1Container').style.display = 'none';
  document.getElementById('game2Container').style.display = 'none';
  document.getElementById('walletScreen').style.display = 'none';
  document.getElementById('settingsScreen').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('levelCompleteScreen').style.display = 'none';
}

function showMainMenu() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainMenu').style.display = 'flex';
  document.getElementById('game1Container').style.display = 'none';
  document.getElementById('game2Container').style.display = 'none';
  document.getElementById('walletScreen').style.display = 'none';
  document.getElementById('settingsScreen').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('levelCompleteScreen').style.display = 'none';
  
  updateWalletDisplay();
  updateAllTranslations();
}

function showWallet() {
  document.getElementById('mainMenu').style.display = 'none';
  document.getElementById('walletScreen').style.display = 'block';
  updateWalletDisplay();
  renderWithdrawalHistory();
}

function showSettings() {
  document.getElementById('mainMenu').style.display = 'none';
  document.getElementById('settingsScreen').style.display = 'block';
}

function showLoginTab() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
  document.querySelectorAll('.tab-btn')[0].classList.add('active');
  document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showSignupTab() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
  document.querySelectorAll('.tab-btn')[0].classList.remove('active');
  document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  await login(email, password);
});

// Signup form handler
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  await signUp(email, password, name);
});

// Withdrawal form handler
document.getElementById('withdrawalForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const qrCode = document.getElementById('qrCodeInput').value;
  if (!qrCode) {
    alert('Please enter QR code');
    return;
  }
  await submitWithdrawal(qrCode);
});

// Language selector
document.getElementById('languageSelect')?.addEventListener('change', (e) => {
  setLanguage(e.target.value);
  if (currentUser) {
    updateUserData({ language: e.target.value });
  }
});

// Initialize app
window.addEventListener('load', () => {
  updateAllTranslations();
});

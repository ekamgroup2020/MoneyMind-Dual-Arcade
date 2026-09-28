// Authentication System
let currentUser = null;
let userData = null;

async function signUp(email, password, name) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    
    // Save user data to Firestore
    await db.collection('users').doc(currentUser.uid).set({
      name: name,
      email: email,
      stars: 0,
      wallet: 0,
      level: 1,
      game1Level: 1,
      game2Level: 1,
      game1Stars: 0,
      game2Stars: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      language: currentLanguage,
      qrCode: null,
      withdrawalHistory: []
    });
    
    userData = {
      name: name,
      email: email,
      stars: 0,
      wallet: 0,
      level: 1,
      game1Level: 1,
      game2Level: 1,
      game1Stars: 0,
      game2Stars: 0,
      qrCode: null,
      withdrawalHistory: []
    };
    
    showMainMenu();
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
}

async function login(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    
    // Load user data from Firestore
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    if (userDoc.exists) {
      userData = userDoc.data();
      if (userData.language) {
        setLanguage(userData.language);
      }
    }
    
    showMainMenu();
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
}

async function logout() {
  await auth.signOut();
  currentUser = null;
  userData = null;
  showLoginScreen();
}

async function updateUserData(updates) {
  if (!currentUser || !userData) return;
  
  Object.assign(userData, updates);
  await db.collection('users').doc(currentUser.uid).update(updates);
}

async function addStars(stars) {
  if (!userData) return;
  userData.stars += stars;
  await updateUserData({ stars: userData.stars });
  updateWalletDisplay();
}

async function convertStarsToWallet() {
  if (!userData) return;
  
  // Convert 100 stars to ₹10
  const conversionRate = 100;
  const amountPerConversion = 10;
  
  const conversions = Math.floor(userData.stars / conversionRate);
  if (conversions > 0) {
    const totalAmount = conversions * amountPerConversion;
    const starsToDeduct = conversions * conversionRate;
    
    userData.wallet += totalAmount;
    userData.stars -= starsToDeduct;
    
    await updateUserData({
      wallet: userData.wallet,
      stars: userData.stars
    });
    
    updateWalletDisplay();
    alert(`₹${totalAmount} added to wallet!`);
  }
}

function updateWalletDisplay() {
  const starsElement = document.getElementById('totalStars');
  const walletElement = document.getElementById('walletAmount');
  
  if (starsElement) starsElement.textContent = userData?.stars || 0;
  if (walletElement) walletElement.textContent = `₹${userData?.wallet || 0}`;
}

// Auth state listener
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    db.collection('users').doc(user.uid).get().then(doc => {
      if (doc.exists) {
        userData = doc.data();
        if (userData.language) {
          setLanguage(userData.language);
        }
        showMainMenu();
      }
    });
  } else {
    showLoginScreen();
  }
});

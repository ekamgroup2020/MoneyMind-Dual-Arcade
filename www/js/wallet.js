// Wallet and Withdrawal System

async function submitWithdrawal(qrCode) {
  if (!currentUser || !userData) {
    alert('Please login first');
    return false;
  }
  
  const minWithdrawal = 1999;
  
  if (userData.wallet < minWithdrawal) {
    alert(`Minimum withdrawal is ₹${minWithdrawal}. You have ₹${userData.wallet}`);
    return false;
  }
  
  // Check if user already withdrew this month
  const lastWithdrawal = userData.withdrawalHistory?.[userData.withdrawalHistory.length - 1];
  if (lastWithdrawal) {
    const lastDate = new Date(lastWithdrawal.date);
    const now = new Date();
    if (lastDate.getMonth() === now.getMonth() && lastDate.getFullYear() === now.getFullYear()) {
      alert('You can only withdraw once per month');
      return false;
    }
  }
  
  const withdrawalData = {
    userId: currentUser.uid,
    userName: userData.name,
    userEmail: userData.email,
    amount: userData.wallet,
    qrCode: qrCode,
    status: 'pending',
    date: firebase.firestore.FieldValue.serverTimestamp(),
    starsAtWithdrawal: userData.stars
  };
  
  try {
    await db.collection('withdrawals').add(withdrawalData);
    
    const newHistory = userData.withdrawalHistory || [];
    newHistory.push({
      amount: userData.wallet,
      date: new Date().toISOString(),
      status: 'pending',
      qrCode: qrCode
    });
    
    await updateUserData({
      wallet: 0,
      withdrawalHistory: newHistory
    });
    
    alert('Withdrawal request submitted successfully!');
    return true;
  } catch (error) {
    alert('Error: ' + error.message);
    return false;
  }
}

async function loadWithdrawalHistory() {
  if (!userData) return [];
  return userData.withdrawalHistory || [];
}

function renderWithdrawalHistory() {
  const historyContainer = document.getElementById('withdrawalHistory');
  if (!historyContainer) return;
  
  const history = userData?.withdrawalHistory || [];
  
  if (history.length === 0) {
    historyContainer.innerHTML = '<p>No withdrawal history</p>';
    return;
  }
  
  historyContainer.innerHTML = history.map(item => `
    <div class="withdrawal-item">
      <div class="withdrawal-amount">₹${item.amount}</div>
      <div class="withdrawal-date">${new Date(item.date).toLocaleDateString()}</div>
      <div class="withdrawal-status status-${item.status}">${t(item.status)}</div>
    </div>
  `).join('');
}

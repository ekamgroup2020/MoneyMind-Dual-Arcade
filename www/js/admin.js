// Admin Panel Logic

async function adminLogin() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadAdminData();
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

async function loadAdminData() {
  const usersSnapshot = await db.collection('users').get();
  const usersList = document.getElementById('usersList');
  usersList.innerHTML = '';
  
  usersSnapshot.forEach(doc => {
    const user = doc.data();
    usersList.innerHTML += `
      <div class="user-card">
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
        <p>Stars: ${user.stars} | Wallet: ₹${user.wallet}</p>
        <p>Game1 Level: ${user.game1Level} | Game2 Level: ${user.game2Level}</p>
      </div>
    `;
  });
  
  const withdrawalsSnapshot = await db.collection('withdrawals')
    .where('status', '==', 'pending')
    .get();
  
  const withdrawalsList = document.getElementById('withdrawalsList');
  withdrawalsList.innerHTML = '';
  
  withdrawalsSnapshot.forEach(doc => {
    const withdrawal = doc.data();
    withdrawalsList.innerHTML += `
      <div class="withdrawal-card">
        <h3>${withdrawal.userName}</h3>
        <p>Email: ${withdrawal.userEmail}</p>
        <p>Amount: ₹${withdrawal.amount}</p>
        <p>Date: ${new Date(withdrawal.date?.toDate()).toLocaleDateString()}</p>
        <img src="${withdrawal.qrCode}" class="qr-display" alt="QR Code">
        <button onclick="approveWithdrawal('${doc.id}', '${withdrawal.userId}', ${withdrawal.amount})">Approve</button>
        <button onclick="rejectWithdrawal('${doc.id}', '${withdrawal.userId}')">Reject</button>
      </div>
    `;
  });
}

async function approveWithdrawal(withdrawalId, userId, amount) {
  try {
    await db.collection('withdrawals').doc(withdrawalId).update({ status: 'approved' });
    
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const history = userData.withdrawalHistory || [];
    const lastPending = history.findLastIndex(h => h.status === 'pending');
    if (lastPending !== -1) {
      history[lastPending].status = 'approved';
      await db.collection('users').doc(userId).update({ withdrawalHistory: history });
    }
    
    alert('Withdrawal approved!');
    loadAdminData();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function rejectWithdrawal(withdrawalId, userId) {
  try {
    await db.collection('withdrawals').doc(withdrawalId).update({ status: 'rejected' });
    
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const withdrawalDoc = await db.collection('withdrawals').doc(withdrawalId).get();
    const amount = withdrawalDoc.data().amount;
    
    await db.collection('users').doc(userId).update({
      wallet: userData.wallet + amount
    });
    
    const history = userData.withdrawalHistory || [];
    const lastPending = history.findLastIndex(h => h.status === 'pending');
    if (lastPending !== -1) {
      history[lastPending].status = 'rejected';
      await db.collection('users').doc(userId).update({ withdrawalHistory: history });
    }
    
    alert('Withdrawal rejected and amount refunded!');
    loadAdminData();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

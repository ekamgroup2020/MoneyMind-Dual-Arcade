// Firebase Configuration - MoneyMind Dual Arcade
// Project: moneymind-8abb6
// Package: com.ekamgroup.moneymind

const firebaseConfig = {
  apiKey: "AIzaSyDE7jpnzwtej--5uzRyw-t_K4_Rb3sOiLU",
  authDomain: "moneymind-8abb6.firebaseapp.com",
  projectId: "moneymind-8abb6",
  storageBucket: "moneymind-8abb6.firebasestorage.app",
  messagingSenderId: "887234380082",
  appId: "1:887234380082:android:b6376babf890257af7d72b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Admin email
const ADMIN_EMAIL = "admin@ekamgroup.com";

// Enable Phone Auth
auth.useDeviceLanguage();

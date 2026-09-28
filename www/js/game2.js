// Game 2: Color Trap (Stroop Effect)
// 5 steps per level, ad after each step, ad on mistake

const COLORS = {
  en: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown'],
  hi: ['लाल', 'नीला', 'हरा', 'पीला', 'बैंगनी', 'नारंगी', 'गुलाबी', 'भूरा'],
  pa: ['ਲਾਲ', 'ਨੀਲਾ', 'ਹਰਾ', 'ਪੀਲਾ', 'ਬੈਂਗਣੀ', 'ਨਾਰੰਗੀ', 'ਗੁਲਾਬੀ', 'ਭੂਰਾ'],
  ur: ['سرخ', 'نیلا', 'سبز', 'پیلا', 'جامنی', 'نارنجی', 'گلابی', 'بھورا'],
  es: ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Morado', 'Naranja', 'Rosa', 'Marrón'],
  ar: ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'بنفسجي', 'برتقالي', 'وردي', 'بني']
};

const COLOR_HEX = {
  'Red': '#FF0000', 'लाल': '#FF0000', 'ਲਾਲ': '#FF0000', 'سرخ': '#FF0000', 'Rojo': '#FF0000', 'أحمر': '#FF0000',
  'Blue': '#0000FF', 'नीला': '#0000FF', 'ਨੀਲਾ': '#0000FF', 'نیلا': '#0000FF', 'Azul': '#0000FF', 'أزرق': '#0000FF',
  'Green': '#00FF00', 'हरा': '#00FF00', 'ਹਰਾ': '#00FF00', 'سبز': '#00FF00', 'Verde': '#00FF00', 'أخضر': '#00FF00',
  'Yellow': '#FFFF00', 'पीला': '#FFFF00', 'ਪੀਲਾ': '#FFFF00', 'پیلا': '#FFFF00', 'Amarillo': '#FFFF00', 'أصفر': '#FFFF00',
  'Purple': '#800080', 'बैंगनी': '#800080', 'ਬੈਂਗਣੀ': '#800080', 'جامنی': '#800080', 'Morado': '#800080', 'بنفسجي': '#800080',
  'Orange': '#FFA500', 'नारंगी': '#FFA500', 'ਨਾਰੰਗੀ': '#FFA500', 'نارنجی': '#FFA500', 'Naranja': '#FFA500', 'برتقالي': '#FFA500',
  'Pink': '#FFC0CB', 'गुलाबी': '#FFC0CB', 'ਗੁਲਾਬੀ': '#FFC0CB', 'گلابی': '#FFC0CB', 'Rosa': '#FFC0CB', 'وردي': '#FFC0CB',
  'Brown': '#8B4513', 'भूरा': '#8B4513', 'ਭੂਰਾ': '#8B4513', 'بھورا': '#8B4513', 'Marrón': '#8B4513', 'بني': '#8B4513'
};

let game2State = {
  isPlaying: false,
  level: 1,
  step: 1,
  maxSteps: 5,
  score: 0,
  timeLeft: 30,
  reactionTime: 2000,
  currentWord: '',
  currentColor: '',
  correctAnswer: '',
  timerInterval: null,
  availableColors: 4
};

function startGame2() {
  game2State.isPlaying = true;
  game2State.score = 0;
  game2State.timeLeft = 30;
  game2State.step = 1;
  game2State.reactionTime = 2000;
  game2State.availableColors = 4;
  
  document.getElementById('mainMenu').style.display = 'none';
  document.getElementById('game2Container').style.display = 'block';
  
  showBannerAd();
  startLevel2();
}

function startLevel2() {
  game2State.isPlaying = true;
  createGrid2();
  nextRound2();
  
  game2State.timerInterval = setInterval(() => {
    game2State.timeLeft--;
    updateGame2UI();
    
    if (game2State.timeLeft <= 0) {
      endGame2();
    }
  }, 1000);
}

function createGrid2() {
  const grid = document.getElementById('tapGrid');
  grid.innerHTML = '';
  
  const colors = COLORS[currentLanguage].slice(0, game2State.availableColors);
  
  colors.forEach(color => {
    const button = document.createElement('button');
    button.className = 'color-button';
    button.textContent = color;
    button.dataset.color = color;
    button.addEventListener('click', () => handleColorTap2(color));
    grid.appendChild(button);
  });
}

function nextRound2() {
  if (!game2State.isPlaying) return;
  
  const colors = COLORS[currentLanguage].slice(0, game2State.availableColors);
  
  const wordIndex = Math.floor(Math.random() * colors.length);
  let colorIndex = Math.floor(Math.random() * colors.length);
  
  while (colorIndex === wordIndex) {
    colorIndex = Math.floor(Math.random() * colors.length);
  }
  
  game2State.currentWord = colors[wordIndex];
  game2State.currentColor = colors[colorIndex];
  game2State.correctAnswer = game2State.currentColor;
  
  const wordDisplay = document.getElementById('colorWord');
  wordDisplay.textContent = game2State.currentWord;
  wordDisplay.style.color = COLOR_HEX[game2State.currentColor];
  
  setTimeout(() => {
    if (game2State.isPlaying) {
      handleWrongAnswer2();
    }
  }, game2State.reactionTime);
}

function handleColorTap2(color) {
  if (!game2State.isPlaying) return;
  
  if (color === game2State.correctAnswer) {
    game2State.score += 10;
    updateGame2UI();
    checkStepCompletion2();
    nextRound2();
  } else {
    handleWrongAnswer2();
  }
}

async function handleWrongAnswer2() {
  game2State.isPlaying = false;
  clearInterval(game2State.timerInterval);
  
  await showInterstitialAd();
  
  const retry = confirm('Watch ad to retry this step?');
  if (retry) {
    await showRewardedAd(() => {
      game2State.isPlaying = true;
      game2State.timerInterval = setInterval(() => {
        game2State.timeLeft--;
        updateGame2UI();
        if (game2State.timeLeft <= 0) endGame2();
      }, 1000);
      nextRound2();
    });
  } else {
    endGame2();
  }
}

function checkStepCompletion2() {
  const stepTarget = game2State.step * 50;
  
  if (game2State.score >= stepTarget) {
    completeStep2();
  }
}

async function completeStep2() {
  game2State.isPlaying = false;
  clearInterval(game2State.timerInterval);
  
  await showInterstitialAd();
  
  if (game2State.step < game2State.maxSteps) {
    game2State.step++;
    game2State.reactionTime = Math.max(500, game2State.reactionTime - 200);
    alert(`Step ${game2State.step - 1} Complete! Starting Step ${game2State.step}`);
    startLevel2();
  } else {
    completeLevel2();
  }
}

async function completeLevel2() {
  game2State.isPlaying = false;
  clearInterval(game2State.timerInterval);
  
  await addStars(1);
  
  if (game2State.level % 2 === 0) {
    await showGiftPack2();
  }
  
  game2State.level++;
  game2State.step = 1;
  game2State.reactionTime = Math.max(500, game2State.reactionTime - 100);
  
  if (game2State.level % 5 === 0 && game2State.availableColors < 8) {
    game2State.availableColors++;
  }
  
  await updateUserData({
    game2Level: game2State.level,
    game2Stars: (userData?.game2Stars || 0) + 1
  });
  
  showLevelComplete2();
}

async function showGiftPack2() {
  const giftStars = Math.random() > 0.5 ? 2 : 1;
  
  const showGift = confirm(`🎁 Gift Pack Available!\nWatch ad to claim ${giftStars} star(s)!`);
  
  if (showGift) {
    await showRewardedAd(() => {
      addStars(giftStars);
      alert(`You received ${giftStars} star(s)!`);
    });
  }
}

function showLevelComplete2() {
  document.getElementById('game2Container').style.display = 'none';
  document.getElementById('levelCompleteScreen').style.display = 'flex';
  document.getElementById('levelCompleteText').textContent = `Level ${game2State.level - 1} Complete!`;
  document.getElementById('starsEarned').textContent = '⭐ 1 Star';
}

function endGame2() {
  game2State.isPlaying = false;
  clearInterval(game2State.timerInterval);
  hideBannerAd();
  
  showGameOver2();
}

function showGameOver2() {
  document.getElementById('game2Container').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'flex';
  document.getElementById('finalScore').textContent = game2State.score;
}

function updateGame2UI() {
  document.getElementById('game2Time').textContent = game2State.timeLeft;
  document.getElementById('game2Score').textContent = game2State.score;
  document.getElementById('game2Level').textContent = `L${game2State.level} S${game2State.step}/${game2State.maxSteps}`;
}

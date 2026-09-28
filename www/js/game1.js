// Game 1: Money Rain - American Dollars
// 5 steps per level, ad after each step, ad on mistake

let game1State = {
  isPlaying: false,
  level: 1,
  step: 1,
  maxSteps: 5,
  score: 0,
  dollars: 0,
  timeLeft: 60,
  notes: [],
  bombs: [],
  gameLoop: null,
  timerInterval: null,
  speed: 2,
  spawnRate: 1500,
  lastSpawnTime: 0
};

const DOLLAR_VALUES = [1, 5, 10, 20, 50, 100];
const BOMB_CHANCE = 0.3;

function startGame1() {
  game1State.isPlaying = true;
  game1State.score = 0;
  game1State.dollars = 0;
  game1State.timeLeft = 60;
  game1State.step = 1;
  
  document.getElementById('mainMenu').style.display = 'none';
  document.getElementById('game1Container').style.display = 'block';
  
  showBannerAd();
  startLevel1();
}

function startLevel1() {
  game1State.isPlaying = true;
  game1State.notes = [];
  game1State.bombs = [];
  game1State.lastSpawnTime = Date.now();
  
  updateGame1UI();
  
  game1State.gameLoop = requestAnimationFrame(game1Loop);
  
  game1State.timerInterval = setInterval(() => {
    game1State.timeLeft--;
    updateGame1UI();
    
    if (game1State.timeLeft <= 0) {
      endGame1();
    }
  }, 1000);
}

function game1Loop(timestamp) {
  if (!game1State.isPlaying) return;
  
  if (timestamp - game1State.lastSpawnTime > game1State.spawnRate) {
    spawnObject1();
    game1State.lastSpawnTime = timestamp;
  }
  
  moveObjects1();
  
  game1State.gameLoop = requestAnimationFrame(game1Loop);
}

function spawnObject1() {
  const isBomb = Math.random() < BOMB_CHANCE;
  const container = document.getElementById('game1Area');
  const object = document.createElement('div');
  
  object.className = isBomb ? 'bomb' : 'note';
  object.style.left = Math.random() * 90 + '%';
  object.style.top = '-50px';
  
  if (isBomb) {
    object.innerHTML = '💣';
    object.dataset.type = 'bomb';
  } else {
    const value = DOLLAR_VALUES[Math.floor(Math.random() * DOLLAR_VALUES.length)];
    object.innerHTML = `$${value}`;
    object.dataset.type = 'note';
    object.dataset.value = value;
  }
  
  object.addEventListener('click', () => handleTap1(object));
  object.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTap1(object);
  });
  
  container.appendChild(object);
  
  if (isBomb) {
    game1State.bombs.push(object);
  } else {
    game1State.notes.push(object);
  }
}

function moveObjects1() {
  const allObjects = [...game1State.notes, ...game1State.bombs];
  
  allObjects.forEach(obj => {
    const currentTop = parseFloat(obj.style.top);
    obj.style.top = (currentTop + game1State.speed) + 'px';
    
    if (currentTop > window.innerHeight) {
      obj.remove();
      const index = game1State.notes.indexOf(obj);
      if (index > -1) game1State.notes.splice(index, 1);
      const bombIndex = game1State.bombs.indexOf(obj);
      if (bombIndex > -1) game1State.bombs.splice(bombIndex, 1);
    }
  });
}

async function handleTap1(object) {
  const type = object.dataset.type;
  
  if (type === 'note') {
    const value = parseInt(object.dataset.value);
    game1State.dollars += value;
    game1State.score += 10;
    
    showFloatingText1(`+$${value}`, object);
    
    object.remove();
    const index = game1State.notes.indexOf(object);
    if (index > -1) game1State.notes.splice(index, 1);
    
    updateGame1UI();
    checkStepCompletion1();
  } else if (type === 'bomb') {
    game1State.score = Math.max(0, game1State.score - 50);
    showFloatingText1('💣 -50', object);
    
    object.remove();
    const index = game1State.bombs.indexOf(object);
    if (index > -1) game1State.bombs.splice(index, 1);
    
    updateGame1UI();
    
    await showAdOnMistake1();
  }
}

async function showAdOnMistake1() {
  await showInterstitialAd();
  alert('Watch ad to continue from Step ' + game1State.step);
}

function checkStepCompletion1() {
  const stepTarget = game1State.step * 100;
  
  if (game1State.score >= stepTarget) {
    completeStep1();
  }
}

async function completeStep1() {
  game1State.isPlaying = false;
  cancelAnimationFrame(game1State.gameLoop);
  clearInterval(game1State.timerInterval);
  
  await showInterstitialAd();
  
  if (game1State.step < game1State.maxSteps) {
    game1State.step++;
    alert(`Step ${game1State.step - 1} Complete! Starting Step ${game1State.step}`);
    startLevel1();
  } else {
    completeLevel1();
  }
}

async function completeLevel1() {
  game1State.isPlaying = false;
  cancelAnimationFrame(game1State.gameLoop);
  clearInterval(game1State.timerInterval);
  
  await addStars(1);
  
  if (game1State.level % 2 === 0) {
    await showGiftPack1();
  }
  
  game1State.level++;
  game1State.step = 1;
  game1State.speed += 0.5;
  game1State.spawnRate = Math.max(500, game1State.spawnRate - 100);
  
  await updateUserData({
    game1Level: game1State.level,
    game1Stars: (userData?.game1Stars || 0) + 1
  });
  
  showLevelComplete1();
}

async function showGiftPack1() {
  const giftStars = Math.random() > 0.5 ? 2 : 1;
  
  const showGift = confirm(`🎁 Gift Pack Available!\nWatch ad to claim ${giftStars} star(s)!`);
  
  if (showGift) {
    await showRewardedAd(() => {
      addStars(giftStars);
      alert(`You received ${giftStars} star(s)!`);
    });
  }
}

function showLevelComplete1() {
  document.getElementById('game1Container').style.display = 'none';
  document.getElementById('levelCompleteScreen').style.display = 'flex';
  document.getElementById('levelCompleteText').textContent = `Level ${game1State.level - 1} Complete!`;
  document.getElementById('starsEarned').textContent = '⭐ 1 Star';
}

function endGame1() {
  game1State.isPlaying = false;
  cancelAnimationFrame(game1State.gameLoop);
  clearInterval(game1State.timerInterval);
  hideBannerAd();
  
  showGameOver1();
}

function showGameOver1() {
  document.getElementById('game1Container').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'flex';
  document.getElementById('finalScore').textContent = game1State.score;
}

function updateGame1UI() {
  document.getElementById('game1Time').textContent = game1State.timeLeft;
  document.getElementById('game1Coins').textContent = `$${game1State.dollars}`;
  document.getElementById('game1Level').textContent = `L${game1State.level} S${game1State.step}/${game1State.maxSteps}`;
}

function showFloatingText1(text, element) {
  const float = document.createElement('div');
  float.className = 'floating-text';
  float.textContent = text;
  float.style.left = element.style.left;
  float.style.top = element.style.top;
  document.getElementById('game1Area').appendChild(float);
  
  setTimeout(() => float.remove(), 1000);
}

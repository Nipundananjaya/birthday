// Romantic Birthday Surprise - Advanced Interactive Engine

// State Management
let appState = {
  herName: localStorage.getItem('gf_her_name') || 'My Beautiful Queen',
  yourName: localStorage.getItem('gf_your_name') || 'Your Love ❤️',
  dateBadge: localStorage.getItem('gf_date_badge') || 'Celebrating 10th October • Your Special Day',
  isPlayingMusic: false,
  isCandleBlown: false,
  activeSlide: 0,
  synthInterval: null
};

// DOM Elements
const envelopeScreen = document.getElementById('envelope-screen');
const envelopeCard = document.querySelector('.envelope-card');
const waxSeal = document.getElementById('waxSeal');
const openSealBtn = document.getElementById('openSealBtn');
const mainExperience = document.getElementById('mainExperience');

const mainAudio = document.getElementById('mainAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const discArt = document.getElementById('discArt');
const equalizer = document.getElementById('equalizer');
const trackTitle = document.getElementById('trackTitle');
const audioUpload = document.getElementById('audioUpload');

const carouselContainer = document.getElementById('carouselContainer');
const sliderPrevBtn = document.getElementById('sliderPrevBtn');
const sliderNextBtn = document.getElementById('sliderNextBtn');
const sliderDots = document.getElementById('sliderDots');
const directPhotoUpload = document.getElementById('directPhotoUpload');

const mainCandle = document.getElementById('mainCandle');
const flameElement = document.getElementById('flameElement');
const smokeElement = document.getElementById('smokeElement');
const blowFlameBtn = document.getElementById('blowFlameBtn');
const wishSuccessBox = document.getElementById('wishSuccessBox');

const proposalYesBtn = document.getElementById('proposalYesBtn');
const proposalNoBtn = document.getElementById('proposalNoBtn');
const proposalSuccessMsg = document.getElementById('proposalSuccessMsg');

const settingsToggleBtn = document.getElementById('settingsToggleBtn');
const settingsModal = document.getElementById('settingsModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const saveCustomDetailsBtn = document.getElementById('saveCustomDetailsBtn');
const settingHerName = document.getElementById('settingHerName');
const settingYourName = document.getElementById('settingYourName');
const settingDateText = document.getElementById('settingDateText');
const modalAudioPicker = document.getElementById('modalAudioPicker');

// Canvas Setup
const ambientCanvas = document.getElementById('ambient-canvas');
const ctx = ambientCanvas.getContext('2d');

function initCanvasSize() {
  ambientCanvas.width = window.innerWidth;
  ambientCanvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvasSize);
initCanvasSize();

// 1. Ambient Particle System: Floating Rose Petals & Golden Stardust
let ambientParticles = [];
class AmbientParticle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * ambientCanvas.width;
    this.y = ambientCanvas.height + Math.random() * 40;
    this.size = Math.random() * 14 + 8;
    this.speedY = Math.random() * 1.0 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.7;
    this.opacity = Math.random() * 0.6 + 0.3;
    this.isPetal = Math.random() > 0.35;
    this.angle = Math.random() * 360;
    this.spin = (Math.random() - 0.5) * 1.5;
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.008) * 0.6;
    this.angle += this.spin;
    if (this.y < -30 || this.x < -30 || this.x > ambientCanvas.width + 30) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;

    if (this.isPetal) {
      // Elegant Rose Petal
      ctx.fillStyle = '#ff3366';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.4, this.size, 0);
      ctx.quadraticCurveTo(this.size * 0.7, this.size * 0.4, 0, 0);
      ctx.fill();
    } else {
      // Golden Sparkle Stardust
      ctx.fillStyle = '#ffeaa7';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

for (let i = 0; i < 45; i++) {
  ambientParticles.push(new AmbientParticle());
}

function runAmbientAnimation() {
  ctx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
  ambientParticles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(runAmbientAnimation);
}
runAmbientAnimation();

// Interactive Click Heart Sparkle
window.addEventListener('click', (e) => {
  if (['BUTTON', 'INPUT', 'LABEL', 'SELECT'].includes(e.target.tagName)) return;
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 12,
      spread: 50,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#ff3366', '#ff758c', '#ffd700'],
      shapes: ['circle'],
      disableForReducedMotion: true
    });
  }
});

// 2. High-Fidelity Romantic Music Engine (Audio API + Stream + Upload)
let audioCtx = null;
const dreamyNotes = [
  261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 659.25
];

function playLullabyBell(freq, delay = 0, duration = 1.8) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

    gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
  } catch (e) {
    console.log(e);
  }
}

function startSynthesizerMelody() {
  if (appState.synthInterval) return;
  let step = 0;
  const melody = [
    329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23, 329.63,
    392.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00, 392.00
  ];
  appState.synthInterval = setInterval(() => {
    if (!appState.isPlayingMusic) return;
    const note = melody[step % melody.length];
    playLullabyBell(note, 0, 1.4);
    if (step % 2 === 0) {
      playLullabyBell(note / 2, 0.1, 2.0); // soft bass
    }
    step++;
  }, 750);
}

function stopSynthesizerMelody() {
  if (appState.synthInterval) {
    clearInterval(appState.synthInterval);
    appState.synthInterval = null;
  }
}

function setPlayingUI(playing) {
  appState.isPlayingMusic = playing;
  if (playing) {
    playIcon.textContent = "⏸";
    discArt.classList.add('spinning');
    equalizer.classList.add('active');
  } else {
    playIcon.textContent = "▶";
    discArt.classList.remove('spinning');
    equalizer.classList.remove('active');
  }
}

const romanticPlaylist = [
  { title: "Romantic Piano Serenade ♫", src: "romantic-music.mp3" },
  { title: "Golden Love Melody ♫", src: "romantic-music-2.mp3" }
];
let currentTrackIndex = 0;

function switchRomanticTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % romanticPlaylist.length;
  const track = romanticPlaylist[currentTrackIndex];
  mainAudio.src = track.src;
  trackTitle.textContent = track.title;
  playRomanticMusic();
}

const switchTrackBtn = document.getElementById('switchTrackBtn');
if (switchTrackBtn) {
  switchTrackBtn.addEventListener('click', switchRomanticTrack);
}

function playRomanticMusic() {
  setPlayingUI(true);
  mainAudio.play().then(() => {
    trackTitle.textContent = romanticPlaylist[currentTrackIndex].title;
  }).catch(() => {
    // If blocked or fails, use dreamy synthesizer melody!
    trackTitle.textContent = "Acoustic Music Box ♫";
    startSynthesizerMelody();
  });
}

function pauseRomanticMusic() {
  setPlayingUI(false);
  mainAudio.pause();
  stopSynthesizerMelody();
}

function toggleAudio() {
  if (appState.isPlayingMusic) {
    pauseRomanticMusic();
  } else {
    playRomanticMusic();
  }
}

playPauseBtn.addEventListener('click', toggleAudio);

// Audio File Upload for Her Favorite Song
function handleAudioUpload(file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  mainAudio.src = url;
  stopSynthesizerMelody();
  trackTitle.textContent = file.name.substring(0, 20) + (file.name.length > 20 ? '...' : '');
  playRomanticMusic();
}

audioUpload.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    handleAudioUpload(e.target.files[0]);
  }
});

// 3. Wax Seal Tap & Unboxing Experience
function triggerGrandUnboxing() {
  envelopeCard.classList.add('opened');

  // Trigger romantic chime chord
  [329.63, 392.00, 523.25, 659.25].forEach((freq, i) => {
    playLullabyBell(freq, i * 0.12, 2.0);
  });

  // Confetti burst
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#ff3366', '#ff758c', '#ffd700', '#ffffff']
    });
  }

  // Smooth screen transition
  setTimeout(() => {
    envelopeScreen.classList.add('fade-out');
    mainExperience.classList.remove('main-hidden');

    // Auto start music
    playRomanticMusic();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 950);
}

waxSeal.addEventListener('click', triggerGrandUnboxing);
openSealBtn.addEventListener('click', triggerGrandUnboxing);

// 4. Supirima 3D Carousel / Slider Logic
const cards = document.querySelectorAll('.carousel-card');
const dots = document.querySelectorAll('.slider-dots .dot');
const totalCards = cards.length;

function updateCarouselUI(index) {
  appState.activeSlide = (index + totalCards) % totalCards;

  cards.forEach((card, idx) => {
    card.classList.remove('active', 'prev', 'next');
    const pos = (idx - appState.activeSlide + totalCards) % totalCards;

    if (pos === 0) {
      card.classList.add('active');
    } else if (pos === totalCards - 1) {
      card.classList.add('prev');
    } else if (pos === 1) {
      card.classList.add('next');
    }
  });

  dots.forEach((dot, idx) => {
    if (idx === appState.activeSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

sliderPrevBtn.addEventListener('click', () => {
  updateCarouselUI(appState.activeSlide - 1);
  playLullabyBell(440, 0, 0.4);
});

sliderNextBtn.addEventListener('click', () => {
  updateCarouselUI(appState.activeSlide + 1);
  playLullabyBell(523.25, 0, 0.4);
});

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.getAttribute('data-index'), 10);
    updateCarouselUI(idx);
    playLullabyBell(493.88, 0, 0.4);
  });
});

cards.forEach(card => {
  card.addEventListener('click', () => {
    const idx = parseInt(card.getAttribute('data-index'), 10);
    if (idx !== appState.activeSlide) {
      updateCarouselUI(idx);
      playLullabyBell(440, 0, 0.4);
    }
  });
});

// Direct Image Upload: Replace with her real photos seamlessly
directPhotoUpload.addEventListener('change', (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const cardImgs = document.querySelectorAll('.carousel-img');
  for (let i = 0; i < Math.min(files.length, cardImgs.length); i++) {
    const file = files[i];
    const imgUrl = URL.createObjectURL(file);
    cardImgs[i].src = imgUrl;
  }

  if (typeof confetti === 'function') {
    confetti({ particleCount: 40, spread: 60 });
  }
  alert("✨ Awesome! Her photos have been loaded into your 3D gallery!");
});

// 5. Interactive Birthday Cake Candle
function extinguishCandle() {
  if (appState.isCandleBlown) return;
  appState.isCandleBlown = true;

  flameElement.classList.add('blown');
  smokeElement.classList.add('rise');

  // Chime
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
    playLullabyBell(freq, idx * 0.1, 2.2);
  });

  // Fireworks celebration confetti
  if (typeof confetti === 'function') {
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff3366', '#ff758c', '#ffd700', '#ffffff']
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff3366', '#ff758c', '#ffd700', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  document.getElementById('tapFlameHint').style.display = 'none';
  blowFlameBtn.style.display = 'none';
  wishSuccessBox.classList.remove('hidden');
}

mainCandle.addEventListener('click', extinguishCandle);
flameElement.addEventListener('click', extinguishCandle);
blowFlameBtn.addEventListener('click', extinguishCandle);

// 6. Reasons Flip Cards Interactivity
document.querySelectorAll('.glass-reason-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
    playLullabyBell(392.00, 0, 0.4);
  });
});

// 7. Proposal "Yes" & Playful "Maybe"
proposalYesBtn.addEventListener('click', () => {
  proposalSuccessMsg.classList.remove('hidden');
  [329.63, 440.00, 523.25, 659.25].forEach((freq, idx) => {
    playLullabyBell(freq, idx * 0.1, 2.5);
  });

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 130,
      spread: 100,
      origin: { y: 0.65 },
      colors: ['#ff3366', '#ff758c', '#ffd700']
    });
  }
});

proposalNoBtn.addEventListener('mouseover', moveProposalNo);
proposalNoBtn.addEventListener('click', moveProposalNo);

function moveProposalNo() {
  const randX = (Math.random() - 0.5) * 200;
  const randY = (Math.random() - 0.5) * 90;
  proposalNoBtn.style.transform = `translate(${randX}px, ${randY}px)`;
  proposalNoBtn.textContent = "Yes instead! 🥰";
}

// 8. Customization Settings
function renderAppliedState() {
  document.getElementById('heroName').textContent = appState.herName;
  document.getElementById('letterGfName').textContent = appState.herName;
  document.getElementById('letterYourName').textContent = appState.yourName;
  document.getElementById('displayDateBadge').textContent = appState.dateBadge;
}

settingsToggleBtn.addEventListener('click', () => {
  settingHerName.value = appState.herName;
  settingYourName.value = appState.yourName;
  settingDateText.value = appState.dateBadge;
  settingsModal.classList.remove('hidden');
});

modalCloseBtn.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
});

saveCustomDetailsBtn.addEventListener('click', () => {
  if (settingHerName.value.trim()) {
    appState.herName = settingHerName.value.trim();
    localStorage.setItem('gf_her_name', appState.herName);
  }
  if (settingYourName.value.trim()) {
    appState.yourName = settingYourName.value.trim();
    localStorage.setItem('gf_your_name', appState.yourName);
  }
  if (settingDateText.value.trim()) {
    appState.dateBadge = settingDateText.value.trim();
    localStorage.setItem('gf_date_badge', appState.dateBadge);
  }

  if (modalAudioPicker.files && modalAudioPicker.files[0]) {
    handleAudioUpload(modalAudioPicker.files[0]);
  }

  renderAppliedState();
  settingsModal.classList.add('hidden');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 35, spread: 60 });
  }
});

// Close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.add('hidden');
  }
});

// Initialize on Load
renderAppliedState();
updateCarouselUI(0);

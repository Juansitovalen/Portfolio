// Preloader
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('is-hidden');
  }, 600);
});

// Nav scroll state
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Typed code effect in hero editor
const codeLines = [
  { n: 1, html: '<span class="code-key">const</span> developer <span class="code-key">=</span> {' },
  { n: 2, html: '&nbsp;&nbsp;<span class="code-prop">name</span>: <span class="code-str">"Juan Carlos Valentini"</span>,' },
  { n: 3, html: '&nbsp;&nbsp;<span class="code-prop">role</span>: <span class="code-str">"Diseñador & Developer"</span>,' },
  { n: 4, html: '&nbsp;&nbsp;<span class="code-prop">focus</span>: <span class="code-str">"Experiencias premium"</span>,' },
  { n: 5, html: '&nbsp;&nbsp;<span class="code-prop">stack</span>: [<span class="code-str">"HTML"</span>, <span class="code-str">"CSS"</span>, <span class="code-str">"JS"</span>],' },
  { n: 6, html: '&nbsp;&nbsp;<span class="code-comment">// siempre aprendiendo</span>' },
  { n: 7, html: '};' },
  { n: 8, html: '' },
  { n: 9, html: '<span class="code-fn">build</span>(developer.focus);' },
];

const container = document.getElementById('typedCode');
let lineIndex = 0;

function typeLine() {
  if (lineIndex >= codeLines.length) {
    const cur = document.createElement('span');
    cur.className = 'cursor-blink';
    container.appendChild(cur);
    return;
  }
  const line = codeLines[lineIndex];
  const row = document.createElement('div');
  row.innerHTML = `<span class="line-num">${line.n}</span>${line.html}`;
  row.style.opacity = '0';
  container.appendChild(row);
  requestAnimationFrame(() => {
    row.style.transition = 'opacity 0.3s ease';
    row.style.opacity = '1';
  });
  lineIndex++;
  setTimeout(typeLine, line.html === '' ? 120 : 220);
}
setTimeout(typeLine, 900);

// Scroll reveal
// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const skillFills = document.querySelectorAll('.skill-fill');

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      if (entry.target.classList.contains('skills-panel')) {

        skillFills.forEach(f => {
          const targetW = parseInt(f.dataset.w);
          f.style.width = targetW + '%';

          // Animar el porcentaje
          const pctEl = f.closest('.skill-row').querySelector('.skill-pct');
          if (!pctEl) return;
          let start = 0;
          const duration = 1400;
          const startTime = performance.now();

          function countUp(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            pctEl.textContent = Math.floor(ease * targetW) + '%';
            if (progress < 1) requestAnimationFrame(countUp);
          }
          requestAnimationFrame(countUp);
        });
      }
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

// Cursor glow
const glow = document.querySelector('.cursor-glow');
let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  currentX += (mouseX - currentX) * 0.06;
  currentY += (mouseY - currentY) * 0.06;
  if (glow) {
    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';
  }
  requestAnimationFrame(animateGlow);
}
animateGlow();

// Carousel de proyectos
const carouselTrack = document.getElementById('carouselTrack');
const carouselCards = carouselTrack ? carouselTrack.querySelectorAll('.project-card') : [];
const carouselNav = document.getElementById('carouselNav');

if (carouselTrack && carouselCards.length) {

  carouselCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => scrollToCard(i);
    carouselNav.appendChild(dot);
  });

  function updateActiveCard() {
    const idx = getCarouselIndex();
    carouselCards.forEach((card, i) => {
      card.classList.toggle('is-active', i === idx);
    });
    carouselNav.querySelectorAll('.nav-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function scrollToCard(index) {
    const card = carouselCards[index];
    const trackCenter = carouselTrack.offsetWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    carouselTrack.scrollTo({ left: cardCenter - trackCenter, behavior: 'smooth' });
  }

  window.scrollCarousel = function(dir) {
    const current = getCarouselIndex();
    scrollToCard(Math.min(Math.max(current + dir, 0), carouselCards.length - 1));
  };

  function getCarouselIndex() {
    const center = carouselTrack.scrollLeft + carouselTrack.offsetWidth / 2;
    let closest = 0;
    carouselCards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const closestCenter = carouselCards[closest].offsetLeft + carouselCards[closest].offsetWidth / 2;
      if (Math.abs(cardCenter - center) < Math.abs(closestCenter - center)) {
        closest = i;
      }
    });
    return closest;
  }

  carouselTrack.addEventListener('scroll', updateActiveCard);

  scrollToCard(0);
  setTimeout(updateActiveCard, 100);

  let isDragging = false, dragStartX = 0, dragScrollStart = 0;

  carouselTrack.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.pageX;
    dragScrollStart = carouselTrack.scrollLeft;
    carouselTrack.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    carouselTrack.scrollLeft = dragScrollStart - (e.pageX - dragStartX);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    carouselTrack.style.userSelect = '';
  });
}

// Reproductor de música
const playlist = [
  {
    title: 'Lofi Study Beats',
    artist: 'Chillhop Music',
    src: 'music/lofidreams-lofi-background-music-326931.mp3'
  },
  {
    title: 'Electro Vibes',
    artist: 'Shattered',
    src: 'music/18259555-shattered-339166.mp3'
  },
  {
    title: 'Jazz Rainy Night',
    artist: 'Alex Morgan',
    src: 'music/alex-morgan-blues-jazz-rainy-night-552797.mp3'
  },
  {
    title: 'Lofi HipHop',
    artist: 'Apalon Beats',
    src: 'music/apalonbeats-lofi-hiphop-549454.mp3'
  },
];

let currentTrack = 0;
let isPlaying = false;
let isMuted = false;
let lastVolume = 0.3;

const audio = new Audio();
audio.volume = 0.3;

const playerTitle  = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerPlay   = document.getElementById('playerPlay');
const playerPrev   = document.getElementById('playerPrev');
const playerNext   = document.getElementById('playerNext');
const playerVolume = document.getElementById('playerVolume');
const playerMute   = document.getElementById('playerMute');
const iconPlay     = document.getElementById('iconPlay');
const iconPause    = document.getElementById('iconPause');

function loadTrack(index) {
  const track = playlist[index];
  audio.src = track.src;
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  if (isPlaying) audio.play();
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
  } else {
    audio.play();
    isPlaying = true;
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
  }
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
}

audio.addEventListener('ended', nextTrack);

playerPlay.addEventListener('click', togglePlay);
playerPrev.addEventListener('click', prevTrack);
playerNext.addEventListener('click', nextTrack);

playerVolume.addEventListener('input', (e) => {
  audio.volume = e.target.value / 100;
  lastVolume = audio.volume;
  if (isMuted && audio.volume > 0) {
    isMuted = false;
    audio.muted = false;
    playerMute.classList.remove('is-muted');
  }
});

playerMute.addEventListener('click', () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  playerMute.classList.toggle('is-muted', isMuted);
  if (isMuted) {
    playerVolume.value = 0;
  } else {
    audio.volume = lastVolume;
    playerVolume.value = lastVolume * 100;
  }
});

loadTrack(currentTrack);

// Modo claro / oscuro
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') document.body.classList.add('light');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Barra de progreso de scroll
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = progress + '%';
});

// Contador animado en stats
function animateCounter(el, target, duration, suffix) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = parseInt(el.dataset.duration) || 1200;
      animateCounter(el, target, duration, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// Cursor personalizado
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let ringX = 0, ringY = 0;
let dotX  = 0, dotY  = 0;
let cursorMouseX = 0, cursorMouseY = 0;

document.addEventListener('mousemove', (e) => {
  cursorMouseX = e.clientX;
  cursorMouseY = e.clientY;

  // El punto sigue instantáneo
  dotX = cursorMouseX;
  dotY = cursorMouseY;
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top  = dotY + 'px';

  cursorDot.classList.remove('is-hidden');
  cursorRing.classList.remove('is-hidden');
});

// El anillo sigue con delay
function animateCursor() {
  ringX += (cursorMouseX - ringX) * 0.12;
  ringY += (cursorMouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover sobre elementos interactivos
const interactives = 'a, button, input, textarea, select, [role="button"], .project-card, .service-card, .contact-btn';

document.querySelectorAll(interactives).forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
});

// Click
document.addEventListener('mousedown', () => {
  cursorDot.classList.add('is-clicking');
  cursorRing.classList.add('is-clicking');
});
document.addEventListener('mouseup', () => {
  cursorDot.classList.remove('is-clicking');
  cursorRing.classList.remove('is-clicking');
});

// Ocultar al salir de la ventana
document.addEventListener('mouseleave', () => {
  cursorDot.classList.add('is-hidden');
  cursorRing.classList.add('is-hidden');
});

// Partículas hero
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 60;
const MAX_DISTANCE = 140;
const GOLD = '201, 168, 76';

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Líneas entre partículas cercanas
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DISTANCE) {
        const opacity = (1 - dist / MAX_DISTANCE) * 0.25;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${GOLD}, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Puntos
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${GOLD}, 0.5)`;
    ctx.fill();
  });
}

function updateParticles() {
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    // Rebotar en los bordes
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });
}

function animateParticles() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
animateParticles();

// Typing effect hero
const typingTexts = [
  'identidad propia.',
  'diseño premium.',
  'animaciones suaves.',
  'presencia digital.',
  'código limpio.',
];

const typingEl = document.getElementById('typingText');
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
const TYPE_SPEED   = 60;
const DELETE_SPEED = 35;
const PAUSE_END    = 2000;
const PAUSE_START  = 400;

function typeLoop() {
  const current = typingTexts[typingIndex];

  if (isDeleting) {
    charIndex--;
    typingEl.textContent = current.slice(0, charIndex);
  } else {
    charIndex++;
    typingEl.textContent = current.slice(0, charIndex);
  }

  let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

  if (!isDeleting && charIndex === current.length) {
    delay = PAUSE_END;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typingIndex = (typingIndex + 1) % typingTexts.length;
    delay = PAUSE_START;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();

// Efecto tilt en cards de proyecto
const tiltCards = document.querySelectorAll('.project-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    card.style.transition = 'transform 0.5s cubic-bezier(.34,1.56,.64,1)';
  });
});

// Efecto magnético en botones
const magneticEls = document.querySelectorAll('.btn, .contact-btn, .item-action');

magneticEls.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;

    el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    el.style.transition = 'transform 0.15s ease';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.5s cubic-bezier(.34,1.56,.64,1)';
  });
});
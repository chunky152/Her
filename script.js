(function(){
  "use strict";

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reducedMotion){ document.body.classList.add('reduced-motion'); }

  /* ================= Envelope ================= */
  var overlay = document.getElementById('envelope-overlay');
  var envelope = document.getElementById('envelope');
  var envelopeTrigger = document.getElementById('envelopeTrigger');
  document.body.classList.add('locked');

  function openEnvelope(){
    if(envelope.classList.contains('opening')) return;
    envelope.classList.add('opening');
    startMusic();
    setTimeout(function(){
      overlay.classList.add('fade-out');
      document.body.classList.remove('locked');
    }, 650);
    setTimeout(function(){
      overlay.style.display = 'none';
    }, 1700);
  }
  envelopeTrigger.addEventListener('click', openEnvelope);

  /* ================= Mute button ================= */
  var muteBtn = document.getElementById('muteBtn');
  var muted = false;
  muteBtn.addEventListener('click', function(){
    muted = !muted;
    muteBtn.innerHTML = muted ? '&#128263;' : '&#128266;';
    muteBtn.setAttribute('aria-label', muted ? 'Unmute music' : 'Mute music');
    applyMute();
  });

  /* ================= Background music (single audio file, plays through every section) =================
     Drop your track in as audio/background-music.mp3 (see README) — this just wires up
     the <audio id="bgMusic"> element in the page and controls it via the mute button. */
  var bgMusic = document.getElementById('bgMusic');
  var isPlaying = false;
  bgMusic.volume = 0.55;

  function applyMute(){
    bgMusic.muted = muted;
  }

  function startMusic(){
    if(isPlaying) return;
    isPlaying = true;
    var playPromise = bgMusic.play();
    if(playPromise && playPromise.catch){ playPromise.catch(function(){}); }
  }

  /* ================= Petals (falling rose flowers) ================= */
  if(!reducedMotion){
    var petalContainer = document.getElementById('petals');
    var PETAL_COUNT = 50;
    for(var i = 0; i < PETAL_COUNT; i++){
      var petal = document.createElement('div');
      petal.className = 'petal';
      petal.textContent = '🌹';
      petal.setAttribute('aria-hidden', 'true');
      var size = 16 + Math.random() * 14;
      var left = Math.random() * 100;
      var duration = 16 + Math.random() * 14;
      var delay = Math.random() * -20;
      var drift = (Math.random() * 120 - 60) + 'px';
      petal.style.left = left + '%';
      petal.style.fontSize = size + 'px';
      petal.style.animationDuration = duration + 's';
      petal.style.animationDelay = delay + 's';
      petal.style.setProperty('--drift', drift);
      petalContainer.appendChild(petal);
    }
  }

  /* ================= Polaroid photo slots ================= */
  document.querySelectorAll('.polaroid-photo img').forEach(function(img){
    img.addEventListener('error', function(){
      img.closest('.polaroid').classList.add('no-photo');
    });
  });

  /* ================= Reasons: flip cards ================= */
  var reasons = [
    { icon: '🙏', text: "You love GOD so much, and that attracted me to you." },
    { icon: '🌸', text: "You are very beautiful." },
    { icon: '😊', text: "Your smile is amazing." },
    { icon: '🫶', text: "You open up to me, and that makes me feel important in your life." },
    { icon: '🎁', text: "You make me feel appreciated for the little things I do for you." }
  ];
  var reasonsGrid = document.getElementById('reasonsGrid');
  reasons.forEach(function(item, idx){
    var card = document.createElement('div');
    card.className = 'flip-card reveal';
    card.style.transitionDelay = (idx * 90) + 'ms';

    var btn = document.createElement('button');
    btn.className = 'flip-card-btn';
    btn.setAttribute('aria-label', 'Reveal reason ' + (idx + 1));

    var inner = document.createElement('div');
    inner.className = 'flip-inner';

    var front = document.createElement('div');
    front.className = 'flip-front';
    var frontIcon = document.createElement('span');
    frontIcon.className = 'flip-icon';
    frontIcon.textContent = item.icon;
    var num = document.createElement('span');
    num.className = 'num';
    num.textContent = String(idx + 1).padStart(2, '0');
    var hint = document.createElement('span');
    hint.className = 'flip-hint';
    hint.textContent = 'tap ✨';
    front.appendChild(frontIcon);
    front.appendChild(num);
    front.appendChild(hint);

    var back = document.createElement('div');
    back.className = 'flip-back';
    var backIcon = document.createElement('span');
    backIcon.className = 'flip-icon back-icon';
    backIcon.textContent = item.icon;
    var backText = document.createElement('p');
    backText.className = 'flip-text';
    backText.textContent = item.text;
    back.appendChild(backIcon);
    back.appendChild(backText);

    inner.appendChild(front);
    inner.appendChild(back);
    btn.appendChild(inner);
    card.appendChild(btn);
    reasonsGrid.appendChild(card);

    btn.addEventListener('click', function(){
      card.classList.toggle('flipped');
    });
  });

  /* ================= Scroll reveals ================= */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ================= Quiz ================= */
  var quizData = [
    {
      q: "How did we get to know each other?",
      options: ["Through a mutual friend", "Through your Mom", "At a party", "At Church"],
      correct: 0,
      right: "Yes! Our mutual friend deserves a thank-you gift 😄",
      wrong: "Nice guess, but no matchmaking magic there."
    },
    {
      q: "How long have we been together in this relationship?",
      options: ["2 years", "1 year and 3 months", "5 years", "2 weeks"],
      correct: 1,
      right: "Exactly — and every month has been worth it.",
      wrong: "Close, but let's just say it's been worth counting."
    },
    {
      q: "How many times have we met physically?",
      options: ["2", "5", "4", "3"],
      correct: 2,
      right: "Four and counting — the next one's coming soon.",
      wrong: "A little off, but who's counting? (I am.)"
    },
    {
      q: "How many siblings do I have?",
      options: ["1", "20", "0", "11"],
      correct: 3,
      right: "Eleven! You come from quite the crew.",
      wrong: "Not quite — ask me again after a family gathering."
    },
    {
      q: "Where did we first meet?",
      options: ["In town", "At home", "In a bank", "At a restaurant"],
      correct: 1,
      right: "Right where it all began — at home.",
      wrong: "Almost — but home will always be the real answer."
    }
  ];

  var quizStage = document.getElementById('quizCard');
  var stageInner = document.getElementById('quizStage');
  var qIndex = 0, score = 0;

  function renderQuestion(){
    var item = quizData[qIndex];
    var html = '<p class="quiz-progress">Question ' + (qIndex + 1) + ' of ' + quizData.length + '</p>';
    html += '<h3 class="quiz-question">' + item.q + '</h3>';
    html += '<div class="quiz-options">';
    item.options.forEach(function(opt, i){
      html += '<button class="quiz-option" data-i="' + i + '">' + opt + '</button>';
    });
    html += '</div><div class="quiz-feedback" aria-live="polite"></div>';
    stageInner.innerHTML = html;

    var buttons = stageInner.querySelectorAll('.quiz-option');
    buttons.forEach(function(b){
      b.addEventListener('click', function(){ handleAnswer(parseInt(b.getAttribute('data-i'), 10), buttons); });
    });
  }

  function heartBurst(){
    var count = reducedMotion ? 3 : 6;
    var rect = quizStage.getBoundingClientRect();
    for(var i = 0; i < count; i++){
      var h = document.createElement('span');
      h.className = 'heart-pop';
      h.innerHTML = '&#10084;';
      h.style.left = (30 + Math.random() * 40) + '%';
      h.style.top = '55%';
      h.style.animationDelay = (Math.random() * 0.15) + 's';
      quizStage.appendChild(h);
      (function(el){
        setTimeout(function(){ el.remove(); }, 1300);
      })(h);
    }
  }

  function handleAnswer(i, buttons){
    var item = quizData[qIndex];
    var correct = i === item.correct;
    if(correct) score++;

    buttons.forEach(function(b){
      var bi = parseInt(b.getAttribute('data-i'), 10);
      b.disabled = true;
      if(bi === item.correct){ b.classList.add('correct'); }
      else if(bi === i){ b.classList.add('wrong'); }
      else { b.classList.add('dim'); }
    });

    var feedback = stageInner.querySelector('.quiz-feedback');
    feedback.textContent = correct ? item.right : item.wrong;
    if(correct){ heartBurst(); }

    var cont = document.createElement('button');
    cont.className = 'quiz-continue';
    cont.textContent = (qIndex === quizData.length - 1) ? 'See my score' : 'Continue';
    cont.addEventListener('click', function(){
      qIndex++;
      if(qIndex < quizData.length){ renderQuestion(); }
      else { renderResults(); }
    });
    stageInner.appendChild(cont);
  }

  function renderResults(){
    var msg;
    if(score === quizData.length){ msg = "Of course. You know us by heart."; }
    else if(score >= 3){ msg = "Pretty close — some things only forever will teach you."; }
    else { msg = "Good thing we have forever to practice."; }

    stageInner.innerHTML =
      '<p class="quiz-progress">Your score</p>' +
      '<p class="quiz-result-score">' + score + ' / ' + quizData.length + '</p>' +
      '<p class="quiz-result-msg">' + msg + '</p>';
  }

  renderQuestion();

  /* ================= Finale: confetti ================= */
  var canvas = document.getElementById('confettiCanvas');
  var ctx = canvas.getContext('2d');
  var confettiParticles = [];
  var confettiRAF = null;
  var confettiColors = ['#B76E79', '#D9A87E', '#F6D7D2'];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function launchConfetti(){
    var count = reducedMotion ? 40 : 140;
    confettiParticles = [];
    for(var i = 0; i < count; i++){
      confettiParticles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.3,
        vx: reducedMotion ? 0 : (Math.random() * 2 - 1),
        vy: reducedMotion ? 0 : (2 + Math.random() * 3),
        size: 5 + Math.random() * 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        vr: reducedMotion ? 0 : (Math.random() * 8 - 4),
        life: 1,
        decay: reducedMotion ? (0.006 + Math.random() * 0.004) : (0.004 + Math.random() * 0.004)
      });
    }
    var start = performance.now();
    var duration = reducedMotion ? 1800 : 4200;

    function frame(now){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var elapsed = now - start;
      confettiParticles.forEach(function(p){
        if(!reducedMotion){
          p.vy += 0.03;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vr;
        } else {
          p.y = canvas.height * 0.3;
        }
        p.life -= p.decay;
        ctx.save();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if(elapsed < duration){
        confettiRAF = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(confettiRAF);
      }
    }
    if(confettiRAF) cancelAnimationFrame(confettiRAF);
    confettiRAF = requestAnimationFrame(frame);
  }

  var lastThingBtn = document.getElementById('lastThingBtn');
  var finalLine = document.getElementById('finalLine');
  lastThingBtn.addEventListener('click', function(){
    launchConfetti();
    finalLine.classList.add('show');
    lastThingBtn.disabled = true;
  });

})();

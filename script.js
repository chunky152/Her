// GENERATED FILE — edit the fragments in js/ instead, then run `npm run concat`.
(function(){
  "use strict";

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reducedMotion){ document.body.classList.add('reduced-motion'); }

  /* ================= Envelope ================= */
  var overlay = document.getElementById('envelope-overlay');
  var envelope = document.getElementById('envelope');
  var envelopeTrigger = document.getElementById('envelopeTrigger');
  document.body.classList.add('locked');

  /* Play the envelope-open sound effect first, then start the background
     music once it finishes (or immediately if the sound can't play). */
  var envelopeSound = document.getElementById('envelopeSound');
  var musicQueued = false;
  function queueMusic(){
    if(musicQueued) return;
    musicQueued = true;
    startMusic();
  }
  envelopeSound.addEventListener('ended', queueMusic);
  envelopeSound.addEventListener('error', queueMusic);

  function openEnvelope(){
    if(envelope.classList.contains('opening')) return;
    envelope.classList.add('opening');
    playLottieOnce('lottieEnvelope', 'animations/sparkle-burst.json');
    var soundPromise = envelopeSound.play();
    if(soundPromise && soundPromise.catch){ soundPromise.catch(queueMusic); }
    setTimeout(function(){
      overlay.classList.add('fade-out');
      document.body.classList.remove('locked');
    }, 650);
    setTimeout(function(){
      overlay.style.display = 'none';
    }, 1700);
  }
  envelopeTrigger.addEventListener('click', openEnvelope);
  /* ================= Mute button =================
     Uses envelopeSound from 01-envelope.js. */
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
    envelopeSound.muted = muted;
  }

  function startMusic(){
    if(isPlaying) return;
    isPlaying = true;
    var playPromise = bgMusic.play();
    if(playPromise && playPromise.catch){ playPromise.catch(function(){}); }
  }
  /* ================= Lottie motion graphics =================
     Uses reducedMotion from 01-envelope.js. Exposes playLottieOnce and
     lottieReady, used by 01-envelope.js, 08-quiz.js and 09-finale.js.
     Small hand-built animations in animations/*.json, played via the
     vendored lottie-web (vendor/lottie.min.js). Skipped entirely under
     prefers-reduced-motion, matching the rest of the site's motion. */
  var lottieReady = !reducedMotion && typeof lottie !== 'undefined';

  function playLottieOnce(containerId, path){
    if(!lottieReady) return;
    var el = document.getElementById(containerId);
    if(!el) return;
    lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: path
    });
  }

  function mountLottieOnView(containerId, path){
    if(!lottieReady) return;
    var el = document.getElementById(containerId);
    if(!el || !('IntersectionObserver' in window)) return;
    var lottieIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          lottie.loadAnimation({
            container: el,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: path
          });
          lottieIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    lottieIo.observe(el);
  }

  mountLottieOnView('lottieReasonsHearts', 'animations/floating-hearts.json');

  /* Letter heart: pulses ambiently, but cracks apart like a broken wax seal
     when tapped, then reassembles back into the ambient pulse. */
  (function(){
    var el = document.getElementById('lottieHeart');
    if(!el) return;
    if(!lottieReady){
      mountLottieOnView('lottieHeart', 'animations/heartbeat.json');
      return;
    }
    var heartAnim = null;
    var breaking = false;

    function playPulse(){
      if(heartAnim){ heartAnim.destroy(); }
      heartAnim = lottie.loadAnimation({
        container: el, renderer: 'svg', loop: true, autoplay: true,
        path: 'animations/heartbeat.json'
      });
    }

    function playBreak(){
      if(breaking) return;
      breaking = true;
      if(heartAnim){ heartAnim.destroy(); }
      heartAnim = lottie.loadAnimation({
        container: el, renderer: 'svg', loop: false, autoplay: true,
        path: 'animations/heart-break.json'
      });
      heartAnim.addEventListener('complete', function(){
        breaking = false;
        playPulse();
      });
    }

    el.addEventListener('click', playBreak);

    var heartIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          playPulse();
          heartIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    heartIo.observe(el);
  })();

  /* Unlike the decorative touches above, this is the only visual for the
     "Hard Moments" milestone — under reduced-motion, show a still frame
     instead of leaving that polaroid empty. */
  (function(){
    var el = document.getElementById('lottieHardMoments');
    if(!el || typeof lottie === 'undefined') return;
    if(reducedMotion){
      var anim = lottie.loadAnimation({
        container: el, renderer: 'svg', loop: false, autoplay: false,
        path: 'animations/hard-moments-growth.json'
      });
      anim.addEventListener('DOMLoaded', function(){ anim.goToAndStop(anim.totalFrames - 1, true); });
    } else {
      mountLottieOnView('lottieHardMoments', 'animations/hard-moments-growth.json');
    }
  })();
  /* ================= Petals (falling cherry blossoms) =================
     Uses reducedMotion from 01-envelope.js. */
  if(!reducedMotion){
    /* Finale already layers confetti + a Lottie heart burst on click, so it
       gets a lighter petal count — kept as ambient background, not the focal effect. */
    var petalCounts = { petals: 50, petalsFinale: 18 };
    Object.keys(petalCounts).forEach(function(containerId){
      var petalContainer = document.getElementById(containerId);
      if(!petalContainer) return;
      var PETAL_COUNT = petalCounts[containerId];
      for(var i = 0; i < PETAL_COUNT; i++){
        var petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = '🌸';
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
    });
  }
  /* ================= Polaroid photo/video slots ================= */
  document.querySelectorAll('.polaroid-photo img').forEach(function(img){
    img.addEventListener('error', function(){
      img.closest('.polaroid').classList.add('no-photo');
    });
  });
  document.querySelectorAll('.polaroid-photo video').forEach(function(video){
    video.addEventListener('error', function(){
      video.closest('.polaroid').classList.add('no-photo');
    });
  });
  /* ================= Reasons: flip cards ================= */
  var reasons = [
    { icon: '🙏', text: "You love GOD so much, and that attracted me to you." },
    { icon: '🌸', text: "You are very genuine and true to yourself." },
    { icon: '😊', text: "You are very honest, loving, and caring to the people that you love." },
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
  /* ================= Quiz =================
     Uses lottieReady from 03-lottie.js. */
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
      right: "Exacly! I come from quite the crew.",
      wrong: "Not quite — Maybe you should ask me."
    },
    {
      q: "Where did we first meet?",
      options: ["In town", "At home", "In a bank", "At a restaurant"],
      correct: 1,
      right: "Right where it all began — at home.",
      wrong: "Almost — but home will always be the real answer."
    }
  ];

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

  var quizCheckEl = document.getElementById('lottieQuizCheck');
  var quizCheckAnim = null;
  function playQuizCheck(){
    if(!lottieReady || !quizCheckEl) return;
    if(quizCheckAnim){ quizCheckAnim.destroy(); }
    quizCheckEl.classList.add('show');
    quizCheckAnim = lottie.loadAnimation({
      container: quizCheckEl,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'animations/checkmark-success.json'
    });
    setTimeout(function(){ quizCheckEl.classList.remove('show'); }, 1700);
  }

  function handleAnswer(i, buttons){
    var item = quizData[qIndex];
    var correct = i === item.correct;
    if(correct) score++;

    buttons.forEach(function(b){
      var bi = parseInt(b.getAttribute('data-i'), 10);
      b.disabled = true;
      if(bi === item.correct){ b.classList.add('correct'); }
      else if(bi === i){ b.classList.add('wrong'); if(!correct){ b.classList.add('shake'); } }
      else { b.classList.add('dim'); }
    });

    var feedback = stageInner.querySelector('.quiz-feedback');
    feedback.textContent = correct ? item.right : item.wrong;
    if(correct){ playQuizCheck(); }

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
  /* ================= Finale: confetti =================
     Uses reducedMotion from 01-envelope.js and playLottieOnce from
     03-lottie.js. Closes the IIFE opened at the top of 01-envelope.js. */
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
    playLottieOnce('lottieFinaleBurst', 'animations/finale-burst.json');
    finalLine.classList.add('show');
    lastThingBtn.disabled = true;
  });

})();

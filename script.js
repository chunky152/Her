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

  /* Wax seal cracks open like the letter heart does, instead of just
     shrinking away. Skipped under reduced motion (lottieReady is false),
     leaving the existing CSS shrink/fade of the whole badge untouched. */
  var waxSealIcon = document.getElementById('waxSealIcon');
  var lottieWaxSeal = document.getElementById('lottieWaxSeal');
  function crackWaxSeal(){
    if(!lottieReady || !waxSealIcon || !lottieWaxSeal) return;
    waxSealIcon.classList.add('cracking');
    lottieWaxSeal.classList.add('show');
    lottie.loadAnimation({
      container: lottieWaxSeal,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'animations/wax-seal-crack.json'
    });
  }

  function openEnvelope(){
    if(envelope.classList.contains('opening')) return;
    envelope.classList.add('opening');
    playLottieOnce('lottieEnvelope', 'animations/sparkle-burst.json');
    crackWaxSeal();
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
     Uses envelopeSound from 01-envelope.js. Icon markup is duplicated in
     index.html (unmuted, the default state) so it doesn't need to wait for
     JS to render on first paint. */
  var muteBtn = document.getElementById('muteBtn');
  var muted = false;
  var speakerIcon = '<svg viewBox="0 0 20 16" fill="none" aria-hidden="true"><path d="M2,6 L5,6 L9,3 L9,13 L5,10 L2,10 Z" fill="#fff"/><path d="M11,5 Q13.5,8 11,11" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><path d="M13,3 Q17,8 13,13" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var mutedIcon = '<svg viewBox="0 0 20 16" fill="none" aria-hidden="true"><path d="M2,6 L5,6 L9,3 L9,13 L5,10 L2,10 Z" fill="#fff"/><path d="M12,5 L17,11 M17,5 L12,11" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>';
  muteBtn.addEventListener('click', function(){
    muted = !muted;
    muteBtn.innerHTML = muted ? mutedIcon : speakerIcon;
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
  /* ================= Reasons: flip cards =================
     Uses lottieReady and lottie from 03-lottie.js for the completion burst. */
  var reasons = [
    { icon: '🙏', teaser: 'Your faith', text: "You love GOD so much, and that attracted me to you." },
    { icon: '🌸', teaser: 'Just being you', text: "You are very genuine and true to yourself." },
    { icon: '😊', teaser: 'Your caring heart', text: "You are very honest, loving, and caring to the people that you love." },
    { icon: '🫶', teaser: 'You open up', text: "You open up to me, and that makes me feel important in your life." },
    { icon: '🎁', teaser: 'You appreciate me', text: "You make me feel appreciated for the little things I do for you." }
  ];
  var reasonsGrid = document.getElementById('reasonsGrid');
  var reasonsFlipped = {};
  var reasonsFlippedCount = 0;
  var reasonsCompleted = false;

  function checkReasonsComplete(){
    if(reasonsCompleted || reasonsFlippedCount < reasons.length) return;
    reasonsCompleted = true;
    var msg = document.getElementById('reasonsCompleteMsg');
    var burstEl = document.getElementById('lottieReasonsComplete');
    if(msg){ msg.classList.add('show'); }
    if(burstEl){
      burstEl.classList.add('show');
      if(lottieReady){
        lottie.loadAnimation({
          container: burstEl, renderer: 'svg', loop: false, autoplay: true,
          path: 'animations/sparkle-burst.json'
        });
      }
    }
  }

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
    var teaser = document.createElement('span');
    teaser.className = 'flip-teaser';
    teaser.textContent = item.teaser;
    var hint = document.createElement('span');
    hint.className = 'flip-hint';
    hint.textContent = 'tap ✨';
    front.appendChild(frontIcon);
    front.appendChild(teaser);
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
      if(card.classList.contains('flipped') && !reasonsFlipped[idx]){
        reasonsFlipped[idx] = true;
        reasonsFlippedCount++;
        checkReasonsComplete();
      }
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
     03-lottie.js. */
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
  /* ================= Photo/video carousels + shared lightbox =================
     Uses reducedMotion from 01-envelope.js. This is now the last fragment,
     so it closes the outer IIFE opened at the top of 01-envelope.js. */
  (function(){
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxVideo = document.getElementById('lightboxVideo');
    var lightboxClose = document.getElementById('lightboxClose');
    if(!lightbox || !lightboxImg || !lightboxVideo || !lightboxClose) return;

    var lastFocused = null;

    function openLightbox(media){
      lastFocused = document.activeElement;
      if(media.tagName === 'VIDEO'){
        lightboxVideo.src = media.currentSrc || media.src;
        lightboxVideo.classList.add('active');
        lightboxImg.classList.remove('active');
        var playPromise = lightboxVideo.play();
        if(playPromise && playPromise.catch){ playPromise.catch(function(){}); }
      } else {
        lightboxImg.src = media.currentSrc || media.src;
        lightboxImg.alt = media.alt;
        lightboxImg.classList.add('active');
        lightboxVideo.classList.remove('active');
      }
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('locked');
      lightboxClose.focus();
    }
    function closeLightbox(){
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('locked');
      lightboxVideo.pause();
      lightboxVideo.currentTime = 0;
      if(lastFocused && lastFocused.focus){ lastFocused.focus(); }
    }

    lightbox.addEventListener('click', closeLightbox);
    lightboxVideo.addEventListener('click', function(e){ e.stopPropagation(); });
    lightboxClose.addEventListener('click', function(e){ e.stopPropagation(); closeLightbox(); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && lightbox.classList.contains('show')){ closeLightbox(); }
    });

    /* One carousel instance per (trackId, dotsId, dotLabel) — builds the dot
       row, keeps it in sync with scroll position, and wires each slide's
       photo/video button to open the shared lightbox above. Missing-photo
       slots are handled by CSS (pointer-events:none via .polaroid.no-photo),
       not a JS complete/naturalWidth check here — that check raced against
       lazy-loaded media still decoding, silently swallowing genuine taps. */
    function initCarousel(trackId, dotsId, dotLabel){
      var track = document.getElementById(trackId);
      var dotsWrap = document.getElementById(dotsId);
      if(!track || !dotsWrap) return;

      var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));

      slides.forEach(function(slide, i){
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', 'Go to ' + dotLabel + ' ' + (i + 1));
        dot.addEventListener('click', function(){
          slide.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
        });
        dotsWrap.appendChild(dot);
      });
      var dots = dotsWrap.querySelectorAll('.carousel-dot');
      if(dots.length){ dots[0].classList.add('active'); }

      if('IntersectionObserver' in window){
        var dotIo = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            var idx = slides.indexOf(entry.target);
            if(entry.isIntersecting && idx > -1){
              dots.forEach(function(d){ d.classList.remove('active'); });
              dots[idx].classList.add('active');
            }
          });
        }, { root: track, threshold: 0.6 });
        slides.forEach(function(s){ dotIo.observe(s); });
      }

      track.querySelectorAll('.polaroid-photo-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
          var media = btn.querySelector('img, video');
          if(media){ openLightbox(media); }
        });
      });
    }

    initCarousel('birthdayCarouselTrack', 'birthdayCarouselDots', 'photo');
    initCarousel('funnyMomentsCarouselTrack', 'funnyMomentsCarouselDots', 'video');
  })();

})();

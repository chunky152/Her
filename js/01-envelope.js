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

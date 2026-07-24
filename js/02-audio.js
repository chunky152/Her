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

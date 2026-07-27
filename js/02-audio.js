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
  var bgMusicVolume = 0.55;
  var isPlaying = false;
  bgMusic.volume = bgMusicVolume;

  function applyMute(){
    bgMusic.muted = muted;
    envelopeSound.muted = muted;
    var lbVideo = document.getElementById('lightboxVideo');
    if(lbVideo){ lbVideo.muted = muted; }
  }

  function startMusic(){
    if(isPlaying) return;
    isPlaying = true;
    var playPromise = bgMusic.play();
    if(playPromise && playPromise.catch){ playPromise.catch(function(){}); }
  }

  /* Generic volume fade, used to duck the background music when a Funny
     Moments video plays its own audio (see 10-carousels.js). A shared
     token means a new fade — on any element — always supersedes whatever
     fade was previously in flight, so rapid open/close of the lightbox
     can't leave stale rAF loops fighting over volume. */
  var fadeToken = 0;
  function fadeAudioVolume(audioEl, target, duration, onComplete){
    var id = ++fadeToken;
    var start = audioEl.volume;
    var startTime = null;
    function step(ts){
      if(id !== fadeToken) return;
      if(startTime === null){ startTime = ts; }
      var t = Math.min((ts - startTime) / duration, 1);
      audioEl.volume = start + (target - start) * t;
      if(t < 1){
        requestAnimationFrame(step);
      } else if(onComplete){
        onComplete();
      }
    }
    requestAnimationFrame(step);
  }

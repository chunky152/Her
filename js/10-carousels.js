  /* ================= Photo/video carousels + shared lightbox =================
     Uses reducedMotion from 01-envelope.js. Self-contained (own matched
     IIFE) — the fragments no longer share one wrapper IIFE across files,
     specifically so no file's syntax depends on a brace living in a
     different file (that pattern kept getting silently broken by
     per-file editor tooling, which has no visibility into the concat
     step and treats a closing brace with no matching opener in the same
     file as an error to auto-fix). Shared state (reducedMotion, bgMusic,
     etc.) works anyway: script.js is one plain concatenated script, so
     top-level var/function in any fragment is already global to all of
     them — the wrapper was only ever for encapsulation, not correctness. */
  (function(){
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxVideo = document.getElementById('lightboxVideo');
    var lightboxClose = document.getElementById('lightboxClose');
    if(!lightbox || !lightboxImg || !lightboxVideo || !lightboxClose) return;

    var lastFocused = null;

    /* Background music ducks out (and pauses) before a video's own audio
       fades in, and fades back in once the video closes — never run for
       photos, and skipped entirely while muted since there's nothing
       audible to make room for. musicDucked guards closeLightbox so it
       only touches bgMusic when a video actually ducked it. */
    var musicDucked = false;
    function duckMusicForVideo(onDucked){
      if(!isPlaying){ if(onDucked){ onDucked(); } return; }
      musicDucked = true;
      fadeAudioVolume(bgMusic, 0, 450, function(){
        bgMusic.pause();
        if(onDucked){ onDucked(); }
      });
    }
    function restoreMusicAfterVideo(){
      if(!musicDucked) return;
      musicDucked = false;
      var playPromise = bgMusic.play();
      if(playPromise && playPromise.catch){ playPromise.catch(function(){}); }
      fadeAudioVolume(bgMusic, bgMusicVolume, 600);
    }

    function openLightbox(media){
      lastFocused = document.activeElement;
      if(media.tagName === 'VIDEO'){
        lightboxVideo.src = media.currentSrc || media.src;
        lightboxVideo.classList.add('active');
        lightboxImg.classList.remove('active');
        lightboxVideo.volume = muted ? 1 : 0;
        var playPromise = lightboxVideo.play();
        if(playPromise && playPromise.catch){ playPromise.catch(function(){}); }
        if(!muted){
          duckMusicForVideo(function(){
            fadeAudioVolume(lightboxVideo, 1, 400);
          });
        }
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
      restoreMusicAfterVideo();
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
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

    /* Focus trap: body.locked only stops scrolling, so without this Tab
       would walk focus straight into the page behind the modal. Only
       lightboxClose and (when active) lightboxVideo are ever focusable
       here — the inactive image/video is display:none via CSS and so
       already out of tab order on its own. */
    document.addEventListener('keydown', function(e){
      if(!lightbox.classList.contains('show')) return;
      if(e.key === 'Escape'){ closeLightbox(); return; }
      if(e.key !== 'Tab') return;
      var focusables = Array.prototype.slice.call(lightbox.querySelectorAll('button, video[controls]'))
        .filter(function(el){ return el.offsetParent !== null; });
      if(!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if(e.shiftKey && document.activeElement === first){
        e.preventDefault(); last.focus();
      } else if(!e.shiftKey && document.activeElement === last){
        e.preventDefault(); first.focus();
      }
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

      var activeIndex = 0;
      if('IntersectionObserver' in window){
        var dotIo = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            var idx = slides.indexOf(entry.target);
            if(entry.isIntersecting && idx > -1){
              activeIndex = idx;
              dots.forEach(function(d){ d.classList.remove('active'); });
              dots[idx].classList.add('active');
            }
          });
        }, { root: track, threshold: 0.6 });
        slides.forEach(function(s){ dotIo.observe(s); });
      }

      /* track has tabindex="0" (see index.html) specifically so this works —
         arrow keys are otherwise only a native scroll gesture on a focused
         scroll container, not a slide-to-slide one. */
      track.addEventListener('keydown', function(e){
        if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        var next = activeIndex + (e.key === 'ArrowRight' ? 1 : -1);
        if(next < 0 || next >= slides.length) return;
        e.preventDefault();
        slides[next].scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      });

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
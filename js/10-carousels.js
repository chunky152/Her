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

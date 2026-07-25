  /* ================= Birthday photo carousel + lightbox =================
     Uses reducedMotion from 01-envelope.js. This is now the last fragment,
     so it closes the outer IIFE opened at the top of 01-envelope.js. */
  (function(){
    var track = document.getElementById('birthdayCarouselTrack');
    var dotsWrap = document.getElementById('birthdayCarouselDots');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.getElementById('lightboxClose');
    if(!track || !dotsWrap || !lightbox || !lightboxImg || !lightboxClose) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));

    slides.forEach(function(slide, i){
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
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

    var lastFocused = null;

    function openLightbox(img){
      lastFocused = document.activeElement;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('locked');
      lightboxClose.focus();
    }
    function closeLightbox(){
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('locked');
      if(lastFocused && lastFocused.focus){ lastFocused.focus(); }
    }

    /* Missing-photo slots are handled by CSS (pointer-events:none via
       .polaroid.no-photo), not a JS complete/naturalWidth check here — that
       check raced against lazy-loaded images that were still decoding,
       silently swallowing genuine taps on valid photos. */
    track.querySelectorAll('.polaroid-photo-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var img = btn.querySelector('img');
        if(img){ openLightbox(img); }
      });
    });
    lightbox.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('click', function(e){ e.stopPropagation(); closeLightbox(); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && lightbox.classList.contains('show')){ closeLightbox(); }
    });
  })();

})();

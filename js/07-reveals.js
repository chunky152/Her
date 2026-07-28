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

  /* ================= Scroll progress + parallax =================
     One rAF-throttled scroll listener drives both: the top progress bar
     (always on — it's a position indicator, not decorative motion) and
     a subtle parallax on the hero photo + story polaroids (skipped
     entirely under reduced motion, matching the rest of the site's
     decorative-motion convention). Photos are pre-sized with overshoot
     in CSS specifically so this shift never reveals an edge gap. */
  var scrollProgressEl = document.getElementById('scrollProgress');
  var heroEl = document.getElementById('hero');
  var heroBgPhoto = document.querySelector('.hero-bg-photo');
  var parallaxPhotos = reducedMotion ? [] :
    Array.prototype.slice.call(document.querySelectorAll('.polaroid-photo img, .polaroid-photo video'));

  var scrollTicking = false;
  function updateScrollEffects(){
    scrollTicking = false;

    if(scrollProgressEl){
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      scrollProgressEl.style.width = pct + '%';
    }

    if(reducedMotion) return;

    if(heroBgPhoto && heroEl){
      var heroRect = heroEl.getBoundingClientRect();
      if(heroRect.bottom > 0 && heroRect.top < window.innerHeight){
        var heroOffset = Math.max(-40, Math.min(40, heroRect.top * -0.08));
        heroBgPhoto.style.transform = 'translateY(' + heroOffset + 'px)';
      }
    }

    parallaxPhotos.forEach(function(media){
      var r = media.getBoundingClientRect();
      if(r.bottom < -100 || r.top > window.innerHeight + 100) return;
      var center = r.top + r.height / 2 - window.innerHeight / 2;
      var offset = Math.max(-12, Math.min(12, center * -0.04));
      media.style.transform = 'translateY(' + offset + 'px)';
    });
  }
  function onScroll(){
    if(!scrollTicking){
      scrollTicking = true;
      requestAnimationFrame(updateScrollEffects);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateScrollEffects();

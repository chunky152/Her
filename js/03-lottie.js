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

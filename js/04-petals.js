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

  /* ================= Finale: confetti =================
     Uses reducedMotion from 01-envelope.js and playLottieOnce from
     03-lottie.js. */
  var canvas = document.getElementById('confettiCanvas');
  var ctx = canvas.getContext('2d');
  var confettiParticles = [];
  var confettiRAF = null;
  var confettiColors = ['#B76E79', '#D9A87E', '#F6D7D2'];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function launchConfetti(){
    var count = reducedMotion ? 40 : 140;
    confettiParticles = [];
    for(var i = 0; i < count; i++){
      confettiParticles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.3,
        vx: reducedMotion ? 0 : (Math.random() * 2 - 1),
        vy: reducedMotion ? 0 : (2 + Math.random() * 3),
        size: 5 + Math.random() * 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        vr: reducedMotion ? 0 : (Math.random() * 8 - 4),
        life: 1,
        decay: reducedMotion ? (0.006 + Math.random() * 0.004) : (0.004 + Math.random() * 0.004)
      });
    }
    var start = performance.now();
    var duration = reducedMotion ? 1800 : 4200;

    function frame(now){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var elapsed = now - start;
      confettiParticles.forEach(function(p){
        if(!reducedMotion){
          p.vy += 0.03;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vr;
        } else {
          p.y = canvas.height * 0.3;
        }
        p.life -= p.decay;
        ctx.save();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if(elapsed < duration){
        confettiRAF = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(confettiRAF);
      }
    }
    if(confettiRAF) cancelAnimationFrame(confettiRAF);
    confettiRAF = requestAnimationFrame(frame);
  }

  var lastThingBtn = document.getElementById('lastThingBtn');
  var finalLine = document.getElementById('finalLine');
  lastThingBtn.addEventListener('click', function(){
    launchConfetti();
    playLottieOnce('lottieFinaleBurst', 'animations/finale-burst.json');
    finalLine.classList.add('show');
    lastThingBtn.disabled = true;
  });

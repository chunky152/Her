  /* ================= Reasons: flip cards =================
     Uses lottieReady and lottie from 03-lottie.js for the completion burst. */
  var reasons = [
    { icon: '🙏', teaser: 'Your faith', text: "You love GOD so much, and that attracted me to you." },
    { icon: '🌸', teaser: 'Just being you', text: "You are very genuine and true to yourself." },
    { icon: '😊', teaser: 'Your caring heart', text: "You are very honest, loving, and caring to the people that you love." },
    { icon: '🫶', teaser: 'You open up', text: "You open up to me, and that makes me feel important in your life." },
    { icon: '🎁', teaser: 'You appreciate me', text: "You make me feel appreciated for the little things I do for you." }
  ];
  var reasonsGrid = document.getElementById('reasonsGrid');
  var reasonsFlipped = {};
  var reasonsFlippedCount = 0;
  var reasonsCompleted = false;

  function checkReasonsComplete(){
    if(reasonsCompleted || reasonsFlippedCount < reasons.length) return;
    reasonsCompleted = true;
    var msg = document.getElementById('reasonsCompleteMsg');
    var burstEl = document.getElementById('lottieReasonsComplete');
    if(msg){ msg.classList.add('show'); }
    if(burstEl){
      burstEl.classList.add('show');
      if(lottieReady){
        lottie.loadAnimation({
          container: burstEl, renderer: 'svg', loop: false, autoplay: true,
          path: 'animations/sparkle-burst.json'
        });
      }
    }
  }

  reasons.forEach(function(item, idx){
    var card = document.createElement('div');
    card.className = 'flip-card reveal';
    card.style.transitionDelay = (idx * 90) + 'ms';

    var btn = document.createElement('button');
    btn.className = 'flip-card-btn';
    btn.setAttribute('aria-label', 'Reveal reason ' + (idx + 1));
    btn.setAttribute('aria-pressed', 'false');

    var inner = document.createElement('div');
    inner.className = 'flip-inner';

    var front = document.createElement('div');
    front.className = 'flip-front';
    front.setAttribute('aria-hidden', 'false');
    var frontIcon = document.createElement('span');
    frontIcon.className = 'flip-icon';
    frontIcon.textContent = item.icon;
    var teaser = document.createElement('span');
    teaser.className = 'flip-teaser';
    teaser.textContent = item.teaser;
    var hint = document.createElement('span');
    hint.className = 'flip-hint';
    hint.textContent = 'tap to reveal';
    front.appendChild(frontIcon);
    front.appendChild(teaser);
    front.appendChild(hint);

    var back = document.createElement('div');
    back.className = 'flip-back';
    back.setAttribute('aria-hidden', 'true');
    var backIcon = document.createElement('span');
    backIcon.className = 'flip-icon back-icon';
    backIcon.textContent = item.icon;
    var backText = document.createElement('p');
    backText.className = 'flip-text';
    backText.textContent = item.text;
    back.appendChild(backIcon);
    back.appendChild(backText);

    inner.appendChild(front);
    inner.appendChild(back);
    btn.appendChild(inner);
    card.appendChild(btn);
    reasonsGrid.appendChild(card);

    btn.addEventListener('click', function(){
      var revealed = card.classList.toggle('flipped');
      front.setAttribute('aria-hidden', revealed ? 'true' : 'false');
      back.setAttribute('aria-hidden', revealed ? 'false' : 'true');
      btn.setAttribute('aria-pressed', revealed ? 'true' : 'false');
      btn.setAttribute('aria-label', revealed
        ? ('Reason ' + (idx + 1) + ': ' + item.teaser + ' — ' + item.text + '. Tap to hide.')
        : ('Reveal reason ' + (idx + 1)));
      if(revealed && !reasonsFlipped[idx]){
        reasonsFlipped[idx] = true;
        reasonsFlippedCount++;
        checkReasonsComplete();
      }
    });
  });

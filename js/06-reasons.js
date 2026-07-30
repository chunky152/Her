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

  function makeEl(tag, className, text){
    var node = document.createElement(tag);
    if(className){ node.className = className; }
    if(text != null){ node.textContent = text; }
    return node;
  }

  function buildReasonCard(item, idx){
    var card = makeEl('div', 'flip-card reveal');
    card.style.transitionDelay = (idx * 90) + 'ms';

    var btn = makeEl('button', 'flip-card-btn');
    btn.setAttribute('aria-label', 'Reveal reason ' + (idx + 1));
    btn.setAttribute('aria-pressed', 'false');

    var inner = makeEl('div', 'flip-inner');

    var front = makeEl('div', 'flip-front');
    front.setAttribute('aria-hidden', 'false');
    front.appendChild(makeEl('span', 'flip-icon', item.icon));
    front.appendChild(makeEl('span', 'flip-teaser', item.teaser));
    front.appendChild(makeEl('span', 'flip-hint', 'tap to reveal'));

    var back = makeEl('div', 'flip-back');
    back.setAttribute('aria-hidden', 'true');
    back.appendChild(makeEl('span', 'flip-icon back-icon', item.icon));
    back.appendChild(makeEl('p', 'flip-text', item.text));

    inner.appendChild(front);
    inner.appendChild(back);
    btn.appendChild(inner);
    card.appendChild(btn);

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

    return card;
  }

  reasons.forEach(function(item, idx){
    reasonsGrid.appendChild(buildReasonCard(item, idx));
  });

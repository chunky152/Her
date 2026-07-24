  /* ================= Reasons: flip cards ================= */
  var reasons = [
    { icon: '🙏', text: "You love GOD so much, and that attracted me to you." },
    { icon: '🌸', text: "You are very genuine and true to yourself." },
    { icon: '😊', text: "You are very honest, loving, and caring to the people that you love." },
    { icon: '🫶', text: "You open up to me, and that makes me feel important in your life." },
    { icon: '🎁', text: "You make me feel appreciated for the little things I do for you." }
  ];
  var reasonsGrid = document.getElementById('reasonsGrid');
  reasons.forEach(function(item, idx){
    var card = document.createElement('div');
    card.className = 'flip-card reveal';
    card.style.transitionDelay = (idx * 90) + 'ms';

    var btn = document.createElement('button');
    btn.className = 'flip-card-btn';
    btn.setAttribute('aria-label', 'Reveal reason ' + (idx + 1));

    var inner = document.createElement('div');
    inner.className = 'flip-inner';

    var front = document.createElement('div');
    front.className = 'flip-front';
    var frontIcon = document.createElement('span');
    frontIcon.className = 'flip-icon';
    frontIcon.textContent = item.icon;
    var num = document.createElement('span');
    num.className = 'num';
    num.textContent = String(idx + 1).padStart(2, '0');
    var hint = document.createElement('span');
    hint.className = 'flip-hint';
    hint.textContent = 'tap ✨';
    front.appendChild(frontIcon);
    front.appendChild(num);
    front.appendChild(hint);

    var back = document.createElement('div');
    back.className = 'flip-back';
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
      card.classList.toggle('flipped');
    });
  });

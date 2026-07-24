  /* ================= Quiz =================
     Uses lottieReady from 03-lottie.js. */
  var quizData = [
    {
      q: "How did we get to know each other?",
      options: ["Through a mutual friend", "Through your Mom", "At a party", "At Church"],
      correct: 0,
      right: "Yes! Our mutual friend deserves a thank-you gift 😄",
      wrong: "Nice guess, but no matchmaking magic there."
    },
    {
      q: "How long have we been together in this relationship?",
      options: ["2 years", "1 year and 3 months", "5 years", "2 weeks"],
      correct: 1,
      right: "Exactly — and every month has been worth it.",
      wrong: "Close, but let's just say it's been worth counting."
    },
    {
      q: "How many times have we met physically?",
      options: ["2", "5", "4", "3"],
      correct: 2,
      right: "Four and counting — the next one's coming soon.",
      wrong: "A little off, but who's counting? (I am.)"
    },
    {
      q: "How many siblings do I have?",
      options: ["1", "20", "0", "11"],
      correct: 3,
      right: "Exacly! I come from quite the crew.",
      wrong: "Not quite — Maybe you should ask me."
    },
    {
      q: "Where did we first meet?",
      options: ["In town", "At home", "In a bank", "At a restaurant"],
      correct: 1,
      right: "Right where it all began — at home.",
      wrong: "Almost — but home will always be the real answer."
    }
  ];

  var stageInner = document.getElementById('quizStage');
  var qIndex = 0, score = 0;

  function renderQuestion(){
    var item = quizData[qIndex];
    var html = '<p class="quiz-progress">Question ' + (qIndex + 1) + ' of ' + quizData.length + '</p>';
    html += '<h3 class="quiz-question">' + item.q + '</h3>';
    html += '<div class="quiz-options">';
    item.options.forEach(function(opt, i){
      html += '<button class="quiz-option" data-i="' + i + '">' + opt + '</button>';
    });
    html += '</div><div class="quiz-feedback" aria-live="polite"></div>';
    stageInner.innerHTML = html;

    var buttons = stageInner.querySelectorAll('.quiz-option');
    buttons.forEach(function(b){
      b.addEventListener('click', function(){ handleAnswer(parseInt(b.getAttribute('data-i'), 10), buttons); });
    });
  }

  var quizCheckEl = document.getElementById('lottieQuizCheck');
  var quizCheckAnim = null;
  function playQuizCheck(){
    if(!lottieReady || !quizCheckEl) return;
    if(quizCheckAnim){ quizCheckAnim.destroy(); }
    quizCheckEl.classList.add('show');
    quizCheckAnim = lottie.loadAnimation({
      container: quizCheckEl,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'animations/checkmark-success.json'
    });
    setTimeout(function(){ quizCheckEl.classList.remove('show'); }, 1700);
  }

  function handleAnswer(i, buttons){
    var item = quizData[qIndex];
    var correct = i === item.correct;
    if(correct) score++;

    buttons.forEach(function(b){
      var bi = parseInt(b.getAttribute('data-i'), 10);
      b.disabled = true;
      if(bi === item.correct){ b.classList.add('correct'); }
      else if(bi === i){ b.classList.add('wrong'); if(!correct){ b.classList.add('shake'); } }
      else { b.classList.add('dim'); }
    });

    var feedback = stageInner.querySelector('.quiz-feedback');
    feedback.textContent = correct ? item.right : item.wrong;
    if(correct){ playQuizCheck(); }

    var cont = document.createElement('button');
    cont.className = 'quiz-continue';
    cont.textContent = (qIndex === quizData.length - 1) ? 'See my score' : 'Continue';
    cont.addEventListener('click', function(){
      qIndex++;
      if(qIndex < quizData.length){ renderQuestion(); }
      else { renderResults(); }
    });
    stageInner.appendChild(cont);
  }

  function renderResults(){
    var msg;
    if(score === quizData.length){ msg = "Of course. You know us by heart."; }
    else if(score >= 3){ msg = "Pretty close — some things only forever will teach you."; }
    else { msg = "Good thing we have forever to practice."; }

    stageInner.innerHTML =
      '<p class="quiz-progress">Your score</p>' +
      '<p class="quiz-result-score">' + score + ' / ' + quizData.length + '</p>' +
      '<p class="quiz-result-msg">' + msg + '</p>';
  }

  renderQuestion();

(function () {
  'use strict';

  // --- DATA ---
  // 女性とマッチング（相手が女性）で選べる項目 → player-female-1,2,3 に対応
  var CONDITION_TAGS_FEMALE = [
    { id: 'gentle_f', label: 'やさしい' },
    { id: 'domestic', label: '家庭的' },
    { id: 'smile_f', label: '笑顔が素敵' },
    { id: 'cute', label: 'かわいい' },
    { id: 'feminine', label: '女性らしい' },
    { id: 'amaenbo', label: '甘えん坊' },
    { id: 'sexy', label: 'セクシー' },
    { id: 'accepting', label: '包容力がある' },
    { id: 'kakkoii_f', label: 'かっこいい' },
  ];
  // 男性とマッチング（相手が男性）で選べる項目 → player-male-1,2,3 に対応
  var CONDITION_TAGS_MALE = [
    { id: 'kakkoii_m', label: 'かっこいい' },
    { id: 'smile_m', label: '笑顔が素敵' },
    { id: 'simple', label: '素朴' },
    { id: 'gentle_m', label: 'やさしい' },
    { id: 'hobby', label: '趣味が合う' },
    { id: 'conversation', label: '会話が面白い' },
    { id: 'cool_m', label: 'クール' },
    { id: 'high_income', label: '高収入' },
    { id: 'high_education', label: '高学歴' },
  ];
  // 対応表: キャラパターン(1～3)ごとの項目ID。同数時は 1 → 2 → 3 の順で優先
  var CHARACTER_TRAITS = {
    female: {
      1: ['gentle_f', 'domestic', 'smile_f'],
      2: ['cute', 'feminine', 'amaenbo'],
      3: ['sexy', 'accepting', 'kakkoii_f'],
    },
    male: {
      1: ['kakkoii_m', 'smile_m', 'simple'],
      2: ['gentle_m', 'hobby', 'conversation'],
      3: ['cool_m', 'high_income', 'high_education'],
    },
  };

  var CHARACTERS = [
    {
      id: 'anna',
      gender: 'female',
      name: 'アンナ',
      age: 28,
      desiredConditionIds: ['cute', 'gentle', 'warm'],
      dateLines: [
        { text: '初めまして。写真より…いい意味で緊張してる。', nextIndex: 1 },
        {
          text: 'どんな人に惹かれる？',
          choices: [
            { text: '笑顔が素敵な人', nextIndex: 2, affinityKey: 'smile' },
            { text: '話を聞いてくれる人', nextIndex: 2, affinityKey: 'listen' },
            { text: '一緒にいて楽な人', nextIndex: 2, affinityKey: 'easy' },
          ],
        },
        { text: 'そうだね、それ大事だよね。私もそう思う。', nextIndex: 3 },
        { text: '今日は会えてよかった。また話そう。', nextIndex: -1 },
      ],
      compatibilityWeights: { smile: 1, listen: 1.2, easy: 0.8 },
    },
    {
      id: 'akira',
      gender: 'male',
      name: 'アキラ',
      age: 28,
      desiredConditionIds: ['natural', 'calm', 'warm'],
      dateLines: [
        { text: '初めまして。写真とちょっと違う？まあ、いい意味で。', nextIndex: 1 },
        {
          text: 'どんな人に惹かれる？',
          choices: [
            { text: '笑顔が素敵な人', nextIndex: 2, affinityKey: 'smile' },
            { text: '話を聞いてくれる人', nextIndex: 2, affinityKey: 'listen' },
            { text: '一緒にいて楽な人', nextIndex: 2, affinityKey: 'easy' },
          ],
        },
        { text: 'そうだね、それ大事だよね。僕もそう思う。', nextIndex: 3 },
        { text: '今日は会えてよかった。また話そう。', nextIndex: -1 },
      ],
      compatibilityWeights: { smile: 1.2, listen: 1, easy: 0.8 },
    },
  ];

  var ENDINGS = {
    happy: {
      type: 'happy',
      title: 'HAPPY END',
      text: 'お互いの素顔を認め合い、二人は結婚した。\nMASKの向こうに、本当の愛があった。',
    },
    bad: {
      type: 'bad',
      title: 'BAD END',
      text: '残念ながら、今回はマッチしなかった。\n別の相手を探すか、もう一度挑戦してみよう。',
    },
  };

  var defaultEditParams = { beautyLevel: 1, editLevel: 1, effectLevel: 1, characterIndex: 1 };

  // --- STORE ---
  var state = {
    phase: 'title',
    playMode: null,
    partnerId: null,
    playerConditionIds: [],
    editParams: Object.assign({}, defaultEditParams),
    partnerImagePattern: null, // 1～3。今はランダム。後で条件指定フェーズの選択で決定する
    playerChoiceMatching1: null,
    partnerOkMatching1: null,
    dateLineIndex: 0,
    dateAffinityKeys: [],
    playerChoiceMatching2: null,
    partnerOkMatching2: null,
    endingType: null,
  };

  function setPhase(p) { state.phase = p; }
  function setPlayMode(mode) { state.playMode = mode; }
  function setPartner(id) { state.partnerId = id; }
  function getCharacters() {
    return state.playMode
      ? CHARACTERS.filter(function (c) { return c.gender === state.playMode; })
      : CHARACTERS;
  }
  function setPlayerConditions(ids) { state.playerConditionIds = ids; }
  function setEditParams(p) {
    state.editParams = Object.assign({}, state.editParams, p);
  }
  function setMatching1(player, partner) {
    state.playerChoiceMatching1 = player;
    state.partnerOkMatching1 = partner;
  }
  function advanceDate(nextIndex, affinityKey) {
    state.dateLineIndex = nextIndex;
    if (affinityKey) state.dateAffinityKeys.push(affinityKey);
  }
  function setMatching2(player, partner) {
    state.playerChoiceMatching2 = player;
    state.partnerOkMatching2 = partner;
  }
  function setEnding(t) { state.endingType = t; }
  function retry() {
    state.phase = 'condition';
    state.playerConditionIds = [];
    state.editParams = Object.assign({}, defaultEditParams);
    state.partnerImagePattern = null;
    state._dateImageShown = undefined;
    state.playerChoiceMatching1 = null;
    state.partnerOkMatching1 = null;
    state.dateLineIndex = 0;
    state.dateAffinityKeys = [];
    state.playerChoiceMatching2 = null;
    state.partnerOkMatching2 = null;
    state.endingType = null;
  }
  function reset() {
    state.phase = 'title';
    state.playMode = null;
    state.partnerId = null;
    state.playerConditionIds = [];
    state.editParams = Object.assign({}, defaultEditParams);
    state.partnerImagePattern = null;
    state._dateImageShown = undefined;
    state.playerChoiceMatching1 = null;
    state.partnerOkMatching1 = null;
    state.dateLineIndex = 0;
    state.dateAffinityKeys = [];
    state.playerChoiceMatching2 = null;
    state.partnerOkMatching2 = null;
    state.endingType = null;
  }

  // --- MATCHING ---
  function computePartnerOkMatching1(partnerId, playerConditionIds, editParams) {
    var char = CHARACTERS.find(function (c) { return c.id === partnerId; });
    if (!char) return false;
    var matchCount = char.desiredConditionIds.filter(function (id) {
      return playerConditionIds.indexOf(id) !== -1;
    }).length;
    var conditionScore = matchCount / Math.max(1, char.desiredConditionIds.length);
    var sum = (editParams.beautyLevel || 1) + (editParams.editLevel || 1) + (editParams.effectLevel || 1);
    var editScore = Math.min(1, sum / 12);
    var total = conditionScore * 0.5 + editScore * 0.5;
    return Math.random() < total + 0.2;
  }

  function computePartnerOkMatching2(partnerId, dateAffinityKeys) {
    var char = CHARACTERS.find(function (c) { return c.id === partnerId; });
    if (!char) return false;
    var affinity = 0.5;
    for (var i = 0; i < dateAffinityKeys.length; i++) {
      var key = dateAffinityKeys[i];
      var w = char.compatibilityWeights[key];
      if (w) affinity += (w - 1) * 0.15;
    }
    return Math.random() < Math.min(0.95, Math.max(0.1, affinity));
  }

  // --- ROUTING (hash) ---
  function getPhaseFromHash() {
    var hash = (window.location.hash || '#').slice(1).toLowerCase();
    var map = {
      '': 'title',
      condition: 'condition',
      edit: 'edit',
      matching1: 'matching1',
      date: 'date',
      matching2: 'matching2',
      ending: 'ending',
    };
    return map[hash] || 'title';
  }

  function navigateTo(phase) {
    var hash = phase === 'title' ? '' : phase;
    window.location.hash = hash;
  }

  // --- RENDER ---
  var root = document.getElementById('root');

  function renderLayout(innerHTML, showHeader) {
    var header = showHeader
      ? '<header class="header"><button type="button" class="logo" id="btn-title" aria-label="タイトルへ">MASKED <span class="logoLove">LOVE</span></button></header>'
      : '';
    root.innerHTML =
      '<div class="layout">' +
      header +
      '<main class="main">' + innerHTML + '</main></div>';
    if (showHeader) {
      document.getElementById('btn-title').onclick = function () {
        reset();
        navigateTo('title');
      };
    }
  }

  function renderTitle() {
    renderLayout(
      '<div class="title-wrap">' +
        '<img src="images/Title logo.png" alt="MASKED LOVE" class="title-logo">' +
        '<p class="title-sub">［加工］が当たり前の時代、本当の愛はどこにある？</p>' +
        '<p class="title-desc">マッチングアプリで結婚相手を見つけ、Happy END を迎えよう。</p>' +
        '<div class="title-startGroup">' +
          '<button type="button" class="title-startBtn" id="btn-start-female">女性とマッチング</button>' +
          '<button type="button" class="title-startBtn title-startBtnSub" id="btn-start-male">男性とマッチング</button>' +
        '</div>' +
      '</div>',
      false
    );
    document.getElementById('btn-start-female').onclick = function () {
      setPlayMode('female');
      setPartner(getCharacters()[0].id);
      setPhase('condition');
      navigateTo('condition');
    };
    document.getElementById('btn-start-male').onclick = function () {
      setPlayMode('male');
      setPartner(getCharacters()[0].id);
      setPhase('condition');
      navigateTo('condition');
    };
  }

  // 選択された条件から、対応表に基づき最もあてはまるキャラパターン(1～3)を返す。同数時は1→2→3の順で優先
  function getPartnerImagePatternFromConditions() {
    var selected = state.playerConditionIds || [];
    var partnerGender = state.playMode; // 女性とマッチング→相手は女性、男性とマッチング→相手は男性
    var traits = CHARACTER_TRAITS[partnerGender];
    if (!traits) return 1 + Math.floor(Math.random() * 3);
    var scores = { 1: 0, 2: 0, 3: 0 };
    for (var p = 1; p <= 3; p++) {
      for (var i = 0; i < selected.length; i++) {
        if (traits[p].indexOf(selected[i]) !== -1) scores[p]++;
      }
    }
    var best = 1;
    if (scores[2] > scores[best]) best = 2;
    if (scores[3] > scores[best]) best = 3;
    return best;
  }

  function renderCondition() {
    var tags = state.playMode === 'female' ? CONDITION_TAGS_FEMALE : CONDITION_TAGS_MALE;
    var selected = state._conditionSelected || [];

    var tagButtons = tags.map(function (t) {
      var cls = 'condition-tag' + (selected.indexOf(t.id) !== -1 ? ' selected' : '');
      return '<button type="button" class="' + cls + '" data-id="' + t.id + '">' + escapeHtml(t.label) + '</button>';
    }).join('');

    renderLayout(
      '<div class="condition-wrap">' +
        '<h2 class="condition-h2">条件設定</h2>' +
        '<p class="condition-lead">相手に求める条件を選んでね（複数可）</p>' +
        '<div class="condition-tagList" id="condition-tags">' + tagButtons + '</div>' +
        '<button type="button" class="condition-nextBtn" id="btn-condition-next">加工フェーズへ</button>' +
      '</div>',
      true
    );

    state._conditionSelected = selected;
    document.getElementById('condition-tags').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-id]');
      if (!btn) return;
      var id = btn.getAttribute('data-id');
      var idx = selected.indexOf(id);
      if (idx === -1) selected.push(id);
      else selected.splice(idx, 1);
      state._conditionSelected = selected;
      btn.classList.toggle('selected', selected.indexOf(id) !== -1);
    });
    document.getElementById('btn-condition-next').onclick = function () {
      setPlayerConditions(selected);
      state.partnerImagePattern = getPartnerImagePatternFromConditions();
      delete state._conditionSelected;
      navigateTo('edit');
    };
  }

  function getEditBrightness(beautyLevel) {
    var l = Math.max(1, Math.min(4, beautyLevel || 1));
    return 0.9 + (l - 1) * 0.1;
  }

  function renderEdit() {
    var ep = state.editParams;
    var beautyLevel = ep.beautyLevel || 1;
    var editLevel = ep.editLevel || 1;
    var effectLevel = ep.effectLevel || 1;
    var charNum = ep.characterIndex || 1;
    var playerGender = state.playMode === 'female' ? 'male' : 'female';
    var imgPath = 'images/player-' + playerGender + '-' + charNum + '-' + editLevel + '.png';
    var imgFallbackChar1 = 'images/player-' + playerGender + '-1-' + editLevel + '.png';
    var imgFallback = 'images/player-' + playerGender + '.png';
    var brightness = getEditBrightness(beautyLevel);
    var effectClass = effectLevel >= 2 ? ' edit-effect-' + effectLevel : '';

    function levelButtons(key, label, maxLevel) {
      maxLevel = maxLevel || 4;
      var current = ep[key] || 1;
      var html = '<div class="edit-levelRow">' +
        '<span class="edit-levelLabel">' + escapeHtml(label) + '</span>' +
        '<div class="edit-levelBtns">';
      for (var i = 1; i <= maxLevel; i++) {
        var cls = 'edit-levelBtn' + (current === i ? ' selected' : '');
        html += '<button type="button" class="' + cls + '" data-key="' + key + '" data-level="' + i + '">' + i + '</button>';
      }
      html += '</div></div>';
      return html;
    }

    var levelRows = levelButtons('characterIndex', 'キャラ', 3) + levelButtons('beautyLevel', '美肌') + levelButtons('editLevel', '加工') + levelButtons('effectLevel', 'エフェクト');

    renderLayout(
      '<div class="edit-wrap">' +
        '<h2 class="edit-h2">加工フェーズ</h2>' +
        '<p class="edit-lead">相手の希望に合わせて、自分の見た目を調整しよう。</p>' +
        '<div class="edit-avatar">' +
          '<div class="edit-avatarInner' + effectClass + '">' +
            '<img src="' + imgPath + '" alt="あなた" class="edit-playerImg" id="edit-playerImg" style="filter:brightness(' + brightness + ')">' +
          '</div>' +
        '</div>' +
        '<div class="edit-levels" id="edit-levels">' + levelRows + '</div>' +
        '<button type="button" class="edit-nextBtn" id="btn-edit-next">第1マッチングへ</button>' +
      '</div>',
      true
    );

    var imgEl = document.getElementById('edit-playerImg');
    var avatarInner = root.querySelector('.edit-avatarInner');
    imgEl.onerror = function () {
      var s = this.src;
      if ((s.indexOf('-2-') !== -1 || s.indexOf('-3-') !== -1)) {
        this.src = s.replace(/-[23]-/, '-1-');
      } else {
        this.onerror = null;
        this.src = imgFallback;
      }
    };
    if (imgEl.complete && imgEl.naturalWidth === 0) imgEl.src = imgFallback;

    function updateLevel(key, level) {
      setEditParams({ [key]: level });
      var ep2 = state.editParams;
      var charNum2 = ep2.characterIndex || 1;
      if (key === 'characterIndex' || key === 'editLevel') {
        imgEl.onerror = function () {
          var s = this.src;
          if (s.indexOf('-2-') !== -1 || s.indexOf('-3-') !== -1) {
            this.src = s.replace(/-[23]-/, '-1-');
          } else {
            this.onerror = null;
            this.src = 'images/player-' + playerGender + '.png';
          }
        };
        imgEl.src = 'images/player-' + playerGender + '-' + charNum2 + '-' + (ep2.editLevel || 1) + '.png';
      }
      if (key === 'beautyLevel') {
        imgEl.style.filter = 'brightness(' + getEditBrightness(ep2.beautyLevel) + ')';
      }
      if (key === 'effectLevel') {
        avatarInner.classList.remove('edit-effect-2', 'edit-effect-3', 'edit-effect-4');
        if ((ep2.effectLevel || 1) >= 2) avatarInner.classList.add('edit-effect-' + (ep2.effectLevel || 1));
      }
      root.querySelectorAll('.edit-levelBtn[data-key="' + key + '"]').forEach(function (btn) {
        btn.classList.toggle('selected', parseInt(btn.getAttribute('data-level'), 10) === (ep2[key] || 1));
      });
    }

    root.querySelectorAll('.edit-levelBtn').forEach(function (btn) {
      btn.onclick = function () {
        updateLevel(btn.getAttribute('data-key'), parseInt(btn.getAttribute('data-level'), 10));
      };
    });
    document.getElementById('btn-edit-next').onclick = function () { navigateTo('matching1'); };
  }

  // 相手画像のパターン（1～3）。条件指定で決まっていればそれを返し、未設定時は条件から算出、なければランダム
  function getPartnerImagePattern() {
    if (state.partnerImagePattern != null) return state.partnerImagePattern;
    if (state.playerConditionIds && state.playerConditionIds.length > 0) {
      state.partnerImagePattern = getPartnerImagePatternFromConditions();
      return state.partnerImagePattern;
    }
    state.partnerImagePattern = 1 + Math.floor(Math.random() * 3);
    return state.partnerImagePattern;
  }

  function renderMatching1() {
    var partner = CHARACTERS.find(function (c) { return c.id === state.partnerId; });
    if (!partner) {
      navigateTo('title');
      return;
    }
    var playerChoice = state._m1Choice;
    var result = state._m1Result;

    var cardContent;
    if (playerChoice === undefined) {
      cardContent =
        '<div class="match-buttons">' +
          '<button type="button" class="match-ngBtn" id="m1-ng" aria-label="NG"><span class="match-btnIcon">✕</span></button>' +
          '<span class="match-buttonsDivider"></span>' +
          '<button type="button" class="match-okBtn" id="m1-ok" aria-label="OK"><span class="match-btnIcon">♥</span></button>' +
        '</div>';
    } else {
      var msg = result === 'matched'
        ? '<p class="match-matched">マッチ！ デートに進もう。</p>'
        : '<p class="match-rejected">' +
            (playerChoice ? 'あなたはOK、でも相手はNGだった…' : 'あなたはNGを選んだ。') +
            '条件を変えてやり直そう。</p>';
      cardContent =
        '<div class="match-resultArea">' + msg +
          '<button type="button" class="match-nextBtn" id="m1-next">' + (result === 'matched' ? 'デートへ' : '条件設定に戻る') + '</button>' +
        '</div>';
    }

    var partnerGender = partner.gender === 'female' ? 'female' : 'male';
    var partnerPattern = getPartnerImagePattern();
    var partnerEditLevel = 4;
    var partnerImgSrc = 'images/partner-' + partnerGender + '-' + partnerPattern + '-' + partnerEditLevel + '.png';
    var partnerImgFallback = 'images/partner-' + partnerGender + '-edited.png';
    renderLayout(
      '<div class="match-wrap">' +
        '<h2 class="match-h2">第1マッチング（加工写真）</h2>' +
        '<p class="match-lead">相手の写真をチェックして、OK か NG を選んでね。</p>' +
        '<div class="match-card">' +
          '<div class="match-cardImage">' +
            '<img src="' + partnerImgSrc + '" alt="' + escapeHtml(partner.name) + '" class="match-partnerImg" id="m1-partnerImg" data-fallback="' + partnerImgFallback + '">' +
          '</div>' +
          '<p class="match-avatarText">' + escapeHtml(partner.name) + ', ' + partner.age + '</p>' +
          '<p class="match-cardDesc">相手の加工されたプロフィール写真です。</p>' +
          cardContent +
        '</div>' +
      '</div>',
      true
    );

    var m1Img = document.getElementById('m1-partnerImg');
    if (m1Img) {
      m1Img.onerror = function () {
        var fallback = this.getAttribute('data-fallback');
        if (fallback) { this.onerror = null; this.src = fallback; }
      };
    }

    if (playerChoice === undefined) {
      function decide(ok) {
        var partnerOk = computePartnerOkMatching1(state.partnerId, state.playerConditionIds, state.editParams);
        setMatching1(ok, partnerOk);
        state._m1Choice = ok;
        state._m1Result = ok && partnerOk ? 'matched' : 'rejected';
        renderMatching1();
      }
      document.getElementById('m1-ng').onclick = function () { decide(false); };
      document.getElementById('m1-ok').onclick = function () { decide(true); };
    } else {
      document.getElementById('m1-next').onclick = function () {
        delete state._m1Choice;
        delete state._m1Result;
        if (result === 'matched') navigateTo('date');
        else navigateTo('condition');
      };
    }
  }

  function renderDate() {
    var partner = CHARACTERS.find(function (c) { return c.id === state.partnerId; });
    if (!partner) {
      navigateTo('title');
      return;
    }
    var lines = partner.dateLines;
    var current = lines[state.dateLineIndex];
    var isLastLine = current && current.nextIndex === -1;

    var dialogueHtml = '';
    if (current) {
      dialogueHtml += '<p class="date-text">' + escapeHtml(current.text) + '</p>';
      if (current.choices && current.choices.length > 0) {
        dialogueHtml += '<div class="date-choices">';
        current.choices.forEach(function (c, i) {
          dialogueHtml += '<button type="button" class="date-choiceBtn" data-ni="' + c.nextIndex + '" data-ak="' + (c.affinityKey || '') + '">' + escapeHtml(c.text) + '</button>';
        });
        dialogueHtml += '</div>';
      } else if (current.nextIndex !== undefined && current.nextIndex >= 0) {
        dialogueHtml += '<button type="button" class="date-nextLineBtn" data-ni="' + current.nextIndex + '">次へ</button>';
      } else if (isLastLine) {
        dialogueHtml += '<button type="button" class="date-nextBtn" id="date-to-m2">第2マッチングへ</button>';
      }
    } else {
      dialogueHtml += '<p class="date-text">デートが終わった。第2マッチングで決めよう。</p>';
      dialogueHtml += '<button type="button" class="date-nextBtn" id="date-to-m2">第2マッチングへ</button>';
    }

    var partnerGender = partner.gender === 'female' ? 'female' : 'male';
    var partnerPattern = state.partnerImagePattern != null ? state.partnerImagePattern : 1;
    var partnerFaceSrc = 'images/player-' + partnerGender + '-' + partnerPattern + '-date.png';
    var partnerFaceFallback = 'images/player-' + partnerGender + '.png';
    var dateImageAlreadyShown = state._dateImageShown === true;
    var overlayClasses = 'date-partnerOverlay' + (dateImageAlreadyShown ? ' date-partnerOverlay--visible' : ' date-partnerOverlay--hidden');
    renderLayout(
      '<div class="date-bg">' +
        '<div class="date-bgTop">' +
          '<div class="' + overlayClasses + '" id="date-partnerOverlay">' +
            '<div class="date-partnerFace">' +
              '<img src="' + partnerFaceSrc + '" alt="' + escapeHtml(partner.name) + '（素顔）" class="date-partnerImg" id="date-partnerImg" data-fallback="' + partnerFaceFallback + '" data-fallback2="images/partner-' + partnerGender + '-' + partnerPattern + '.png">' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="date-content">' +
          '<div class="date-wrap">' +
            '<h2 class="date-h2">デート（アンヴェール）</h2>' +
            '<p class="date-lead">素顔で会って、会話しよう。</p>' +
            '<p class="date-faceLabel">' + escapeHtml(partner.name) + '（素顔）</p>' +
            '<div class="date-dialogue" id="date-dialogue">' + dialogueHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>',
      true
    );

    var overlay = document.getElementById('date-partnerOverlay');
    if (overlay && !dateImageAlreadyShown) {
      requestAnimationFrame(function () {
        setTimeout(function () {
          overlay.classList.remove('date-partnerOverlay--hidden');
          overlay.classList.add('date-partnerOverlay--visible');
          state._dateImageShown = true;
        }, 500);
      });
    }

    var dateImg = document.getElementById('date-partnerImg');
    if (dateImg) {
      dateImg.onerror = function () {
        var fallback = this.getAttribute('data-fallback');
        var fallback2 = this.getAttribute('data-fallback2');
        if (fallback2 && this.src && this.src.indexOf('partner-') !== -1) {
          this.onerror = null;
          this.src = fallback2;
        } else if (fallback) {
          this.src = fallback;
          this.setAttribute('data-fallback', fallback2 || '');
        }
      };
    }

    root.querySelector('#date-dialogue').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-ni]');
      if (btn) {
        var ni = parseInt(btn.getAttribute('data-ni'), 10);
        var ak = btn.getAttribute('data-ak') || undefined;
        advanceDate(ni, ak);
        renderDate();
      }
    });
    var toM2 = document.getElementById('date-to-m2');
    if (toM2) toM2.onclick = function () { navigateTo('matching2'); };
  }

  function renderMatching2() {
    var partner = CHARACTERS.find(function (c) { return c.id === state.partnerId; });
    if (!partner) {
      navigateTo('title');
      return;
    }
    var playerChoice = state._m2Choice;
    var result = state._m2Result;

    var cardContent;
    if (playerChoice === undefined) {
      cardContent =
        '<div class="match-buttons">' +
          '<button type="button" class="match-ngBtn" id="m2-ng" aria-label="NG"><span class="match-btnIcon">✕</span></button>' +
          '<span class="match-buttonsDivider"></span>' +
          '<button type="button" class="match-okBtn" id="m2-ok" aria-label="OK"><span class="match-btnIcon">♥</span></button>' +
        '</div>';
    } else {
      var msg = result === 'matched'
        ? '<p class="match-matched">' + ENDINGS.happy.title + ' へ！ 結婚だ。</p>'
        : '<p class="match-rejected">' +
            (playerChoice ? 'あなたはOK、でも相手はNGだった…' : 'あなたはNGを選んだ。') +
            '残念、BAD END。</p>';
      cardContent =
        '<div class="match-resultArea">' + msg +
          '<button type="button" class="match-nextBtn" id="m2-next">エンディングへ</button>' +
        '</div>';
    }

    var partnerGender = partner.gender === 'female' ? 'female' : 'male';
    var partnerPattern = state.partnerImagePattern != null ? state.partnerImagePattern : 1;
    var partnerFaceSrc = 'images/partner-' + partnerGender + '-' + partnerPattern + '-1.png';
    var partnerFaceFallback = 'images/player-' + partnerGender + '.png';
    renderLayout(
      '<div class="match-wrap">' +
        '<h2 class="match-h2">第2マッチング（素顔）</h2>' +
        '<p class="match-lead">素顔を知った上で、もう一度 OK / NG を選んでね。</p>' +
        '<div class="match-card">' +
          '<div class="match-cardImage">' +
            '<img src="' + partnerFaceSrc + '" alt="' + escapeHtml(partner.name) + '" class="match-partnerImg" id="m2-partnerImg" data-fallback="' + partnerFaceFallback + '">' +
          '</div>' +
          '<p class="match-avatarText">' + escapeHtml(partner.name) + ', ' + partner.age + '</p>' +
          '<p class="match-cardDesc">相手の素顔です。</p>' +
          cardContent +
        '</div>' +
      '</div>',
      true
    );

    var m2Img = document.getElementById('m2-partnerImg');
    if (m2Img) {
      m2Img.onerror = function () {
        var fallback = this.getAttribute('data-fallback');
        if (fallback) { this.onerror = null; this.src = fallback; }
      };
    }

    if (playerChoice === undefined) {
      function decide(ok) {
        var partnerOk = computePartnerOkMatching2(state.partnerId, state.dateAffinityKeys);
        setMatching2(ok, partnerOk);
        setEnding(ok && partnerOk ? 'happy' : 'bad');
        state._m2Choice = ok;
        state._m2Result = ok && partnerOk ? 'matched' : 'rejected';
        renderMatching2();
      }
      document.getElementById('m2-ng').onclick = function () { decide(false); };
      document.getElementById('m2-ok').onclick = function () { decide(true); };
    } else {
      document.getElementById('m2-next').onclick = function () {
        delete state._m2Choice;
        delete state._m2Result;
        navigateTo('ending');
      };
    }
  }

  function renderEnding() {
    var ending = state.endingType ? ENDINGS[state.endingType] : ENDINGS.bad;
    var isHappy = ending && ending.type === 'happy';
    var titleClass = isHappy ? 'ending-titleHappy' : 'ending-titleBad';
    var textLines = (ending && ending.text ? ending.text : '').split('\n').map(function (line) {
      return escapeHtml(line) + '<br>';
    }).join('');

    renderLayout(
      '<div class="ending-wrap">' +
        '<h2 class="' + titleClass + '">' + (ending && ending.title ? escapeHtml(ending.title) : 'BAD END') + '</h2>' +
        '<div class="ending-textWrap"><p class="ending-text">' + textLines + '</p></div>' +
        '<div class="ending-actions">' +
          (!isHappy ? '<button type="button" class="ending-retryBtn" id="btn-retry">RETRY（条件設定から）</button>' : '') +
          '<button type="button" class="ending-titleBtn" id="btn-ending-title">タイトルへ</button>' +
        '</div>' +
      '</div>',
      true
    );

    var retryBtn = document.getElementById('btn-retry');
    if (retryBtn) {
      retryBtn.onclick = function () {
        retry();
        navigateTo('condition');
      };
    }
    document.getElementById('btn-ending-title').onclick = function () {
      reset();
      navigateTo('title');
    };
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function render() {
    var phase = getPhaseFromHash();
    state.phase = phase;
    if (phase === 'title') renderTitle();
    else if (phase === 'condition') renderCondition();
    else if (phase === 'edit') renderEdit();
    else if (phase === 'matching1') renderMatching1();
    else if (phase === 'date') renderDate();
    else if (phase === 'matching2') renderMatching2();
    else if (phase === 'ending') renderEnding();
    else renderTitle();
  }

  window.addEventListener('hashchange', render);
  if (!window.location.hash) window.location.hash = '#';
  render();
})();

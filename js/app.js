(function () {
  'use strict';

  // --- DATA ---
  var CONDITION_TAGS = [
    { id: 'cute', label: '可愛い', category: 'appearance' },
    { id: 'cool', label: 'クール', category: 'appearance' },
    { id: 'natural', label: 'ナチュラル', category: 'appearance' },
    { id: 'gentle', label: '優しい', category: 'personality' },
    { id: 'fun', label: '明るい', category: 'personality' },
    { id: 'calm', label: '落ち着いている', category: 'personality' },
    { id: 'warm', label: '温かい雰囲気', category: 'vibe' },
    { id: 'mysterious', label: 'ミステリアス', category: 'vibe' },
  ];

  var CHARACTERS = [
    {
      id: 'anna',
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

  var defaultEditParams = { beauty: 50, contour: 50, eyes: 50, vibe: 50 };

  // --- STORE ---
  var state = {
    phase: 'title',
    partnerId: null,
    playerConditionIds: [],
    editParams: Object.assign({}, defaultEditParams),
    playerChoiceMatching1: null,
    partnerOkMatching1: null,
    dateLineIndex: 0,
    dateAffinityKeys: [],
    playerChoiceMatching2: null,
    partnerOkMatching2: null,
    endingType: null,
  };

  function setPhase(p) { state.phase = p; }
  function setPartner(id) { state.partnerId = id; }
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
    state.partnerId = null;
    state.playerConditionIds = [];
    state.editParams = Object.assign({}, defaultEditParams);
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
    var editScore = (editParams.beauty + editParams.contour + editParams.eyes + editParams.vibe) / 400;
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
        '<button type="button" class="title-startBtn" id="btn-start">はじめる</button>' +
      '</div>',
      false
    );
    document.getElementById('btn-start').onclick = function () {
      setPartner(CHARACTERS[0].id);
      setPhase('condition');
      navigateTo('condition');
    };
  }

  function renderCondition() {
    var partner = CHARACTERS.find(function (c) { return c.id === state.partnerId; });
    var partnerDesired = CONDITION_TAGS.filter(function (t) {
      return partner && partner.desiredConditionIds.indexOf(t.id) !== -1;
    });
    var selected = state._conditionSelected || [];

    var tagButtons = CONDITION_TAGS.map(function (t) {
      var cls = 'condition-tag' + (selected.indexOf(t.id) !== -1 ? ' selected' : '');
      return '<button type="button" class="' + cls + '" data-id="' + t.id + '">' + escapeHtml(t.label) + '</button>';
    }).join('');

    var partnerTags = partnerDesired.map(function (t) {
      return '<span class="condition-partnerTag">' + escapeHtml(t.label) + '</span>';
    }).join('');

    renderLayout(
      '<div class="condition-wrap">' +
        '<h2 class="condition-h2">条件設定</h2>' +
        '<p class="condition-lead">相手に求める条件を選んでね（複数可）</p>' +
        '<div class="condition-tagList" id="condition-tags">' + tagButtons + '</div>' +
        '<section class="condition-partnerSection">' +
          '<h3 class="condition-h3">相手があなたに求める条件</h3>' +
          '<div class="condition-partnerTags">' + partnerTags + '</div>' +
        '</section>' +
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
      delete state._conditionSelected;
      navigateTo('edit');
    };
  }

  function renderEdit() {
    var ep = state.editParams;
    var filterStyle = 'filter: brightness(' + (0.85 + (ep.beauty / 100) * 0.25) + ') contrast(' + (0.95 + (ep.contour / 100) * 0.1) + ') blur(' + (0.1 - (ep.beauty / 100) * 0.08) + 'px);';
    var transformStyle = 'transform: scale(' + (0.95 + (ep.eyes / 100) * 0.1) + ');';
    var sliders = [
      { key: 'beauty', label: '美肌' },
      { key: 'contour', label: '輪郭' },
      { key: 'eyes', label: '目の大きさ' },
      { key: 'vibe', label: '雰囲気' },
    ].map(function (s) {
      return (
        '<label class="edit-sliderRow">' +
          '<span class="edit-sliderLabel">' + escapeHtml(s.label) + '</span>' +
          '<input type="range" class="edit-slider" min="0" max="100" value="' + ep[s.key] + '" data-key="' + s.key + '">' +
          '<span class="edit-sliderValue" data-value="' + s.key + '">' + ep[s.key] + '</span>' +
        '</label>'
      );
    }).join('');

    renderLayout(
      '<div class="edit-wrap">' +
        '<h2 class="edit-h2">加工フェーズ</h2>' +
        '<p class="edit-lead">相手の希望に合わせて、自分の見た目を調整しよう。</p>' +
        '<div class="edit-avatar">' +
          '<div class="edit-avatarInner" style="' + filterStyle + ' ' + transformStyle + '">' +
            '<span class="edit-avatarPlaceholder">あなた</span>' +
          '</div>' +
        '</div>' +
        '<div class="edit-sliders" id="edit-sliders">' + sliders + '</div>' +
        '<button type="button" class="edit-nextBtn" id="btn-edit-next">第1マッチングへ</button>' +
      '</div>',
      true
    );

    var avatarEl = root.querySelector('.edit-avatarInner');
    var updateSlider = function (key, value) {
      value = Math.max(0, Math.min(100, value));
      setEditParams({ [key]: value });
      var ep2 = state.editParams;
      avatarEl.style.filter = 'brightness(' + (0.85 + (ep2.beauty / 100) * 0.25) + ') contrast(' + (0.95 + (ep2.contour / 100) * 0.1) + ') blur(' + (0.1 - (ep2.beauty / 100) * 0.08) + 'px)';
      avatarEl.style.transform = 'scale(' + (0.95 + (ep2.eyes / 100) * 0.1) + ')';
      root.querySelector('[data-value="' + key + '"]').textContent = value;
    };
    root.querySelectorAll('.edit-slider').forEach(function (input) {
      input.oninput = function () {
        updateSlider(input.getAttribute('data-key'), Number(input.value));
      };
    });
    document.getElementById('btn-edit-next').onclick = function () { navigateTo('matching1'); };
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
          '<button type="button" class="match-ngBtn" id="m1-ng">✕ NG</button>' +
          '<button type="button" class="match-okBtn" id="m1-ok">♡ OK</button>' +
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

    renderLayout(
      '<div class="match-wrap">' +
        '<h2 class="match-h2">第1マッチング（加工写真）</h2>' +
        '<p class="match-lead">相手の写真をチェックして、OK か NG を選んでね。</p>' +
        '<div class="match-card">' +
          '<div class="match-cardAvatar"><span class="match-avatarText">' + escapeHtml(partner.name) + ', ' + partner.age + '</span></div>' +
          '<p class="match-cardDesc">相手の加工されたプロフィール写真です。</p>' +
          cardContent +
        '</div>' +
      '</div>',
      true
    );

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

    renderLayout(
      '<div class="date-wrap">' +
        '<h2 class="date-h2">デート（アンヴェール）</h2>' +
        '<p class="date-lead">素顔で会って、会話しよう。</p>' +
        '<div class="date-partnerFace"><span class="date-faceLabel">' + escapeHtml(partner.name) + '（素顔）</span></div>' +
        '<div class="date-dialogue" id="date-dialogue">' + dialogueHtml + '</div>' +
      '</div>',
      true
    );

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
          '<button type="button" class="match-ngBtn" id="m2-ng">✕ NG</button>' +
          '<button type="button" class="match-okBtn" id="m2-ok">♡ OK</button>' +
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

    renderLayout(
      '<div class="match-wrap">' +
        '<h2 class="match-h2">第2マッチング（素顔）</h2>' +
        '<p class="match-lead">素顔を知った上で、もう一度 OK / NG を選んでね。</p>' +
        '<div class="match-card">' +
          '<div class="match-cardAvatar"><span class="match-avatarText">' + escapeHtml(partner.name) + ', ' + partner.age + '</span></div>' +
          '<p class="match-cardDesc">相手の素顔です。</p>' +
          cardContent +
        '</div>' +
      '</div>',
      true
    );

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

// ============================================================
// 포켓몬 도감 — 외부 API 프로젝트
// 스터디: 비동기 JS (async/await), fetch() API, JSON, Promise
// 사용 API: https://pokeapi.co (무료, API키 불필요)
// ============================================================

// ── 타입별 배경 색상 ──────────────────────────────────────────
// 포켓몬 타입에 따라 카드 배경색을 다르게 적용
const typeColors = {
  fire     : '#c0392b',
  water    : '#1a6b8a',
  grass    : '#1e7e4e',
  electric : '#b7860b',
  psychic  : '#8e1a5e',
  ice      : '#2176ae',
  dragon   : '#4a2c8f',
  dark     : '#2c3e50',
  fairy    : '#8e3a6e',
  fighting : '#922b21',
  flying   : '#1a4f8a',
  poison   : '#6c3483',
  ground   : '#7d6608',
  rock     : '#5d4037',
  bug      : '#1e6b36',
  ghost    : '#4a235a',
  steel    : '#1a4a6b',
  normal   : '#424242'
};

// 타입 뱃지 색상 (밝은 색)
const typeBadgeColors = {
  fire     : '#e74c3c',
  water    : '#3498db',
  grass    : '#2ecc71',
  electric : '#f1c40f',
  psychic  : '#e91e8c',
  ice      : '#74c0fc',
  dragon   : '#7950f2',
  dark     : '#636e72',
  fairy    : '#fd79a8',
  fighting : '#e17055',
  flying   : '#74b9ff',
  poison   : '#a29bfe',
  ground   : '#fdcb6e',
  rock     : '#b2986b',
  bug      : '#55efc4',
  ghost    : '#a29bfe',
  steel    : '#81ecec',
  normal   : '#b2bec3'
};

// 스탯 이름 한글 변환
const statNames = {
  'hp'              : 'HP',
  'attack'          : '공격',
  'defense'         : '방어',
  'special-attack'  : '특수공격',
  'special-defense' : '특수방어',
  'speed'           : '스피드'
};

// ── DOM 요소 선택 ─────────────────────────────────────────────
const searchInput = document.querySelector('#search-input');
const btnSearch   = document.querySelector('#btn-search');
const btnRandom   = document.querySelector('#btn-random');
const errorMsg    = document.querySelector('#error-msg');
const loadingEl   = document.querySelector('#loading');
const card        = document.querySelector('#card');


// ============================================================
// [핵심] 포켓몬 데이터 fetch — async/await + Promise 활용
// ============================================================
async function fetchPokemon(query) {
  // 1. 로딩 상태 시작
  showLoading(true);
  clearError();
  hideCard();

  try {
    // 2. fetch() API로 외부 API 호출 (비동기 요청)
    //    await: Promise가 완료될 때까지 기다림
    const url = 'https://pokeapi.co/api/v2/pokemon/' + String(query).toLowerCase().trim();
    const response = await fetch(url);

    // 3. HTTP 응답 상태 확인
    if (!response.ok) {
      throw new Error('포켓몬을 찾을 수 없습니다. 이름이나 번호를 확인해주세요.');
    }

    // 4. JSON 파싱 (response.json()도 Promise를 반환 → await)
    const data = await response.json();

    // 5. 데이터를 화면에 표시
    displayPokemon(data);

  } catch (error) {
    // 6. 에러 처리 (네트워크 오류 or 존재하지 않는 포켓몬)
    showError(error.message);
  } finally {
    // 7. 성공/실패 상관없이 로딩 종료
    showLoading(false);
  }
}

// ============================================================
// 포켓몬 카드 화면에 표시
// ============================================================
function displayPokemon(data) {
  // 기본 정보 추출
  const id      = data.id;
  const name    = data.name;
  const types   = data.types.map(t => t.type.name);   // 타입 배열 추출
  const height  = (data.height / 10).toFixed(1) + 'm';
  const weight  = (data.weight / 10).toFixed(1) + 'kg';
  const exp     = data.base_experience || '?';
  const imgUrl  = data.sprites.other['official-artwork'].front_default
               || data.sprites.front_default;

  // 대표 타입으로 카드 배경 설정
  const mainType = types[0];
  card.style.background = 'linear-gradient(160deg, '
    + (typeColors[mainType] || '#2a2a4a') + ', #16213e)';

  // 번호
  document.querySelector('#poke-number').textContent =
    '#' + String(id).padStart(3, '0');

  // 이미지
  const img = document.querySelector('#poke-img');
  img.src = imgUrl;
  img.alt = name;

  // 이름
  document.querySelector('#poke-name').textContent = name;

  // 타입 뱃지 — forEach로 배열 순회하며 DOM 생성
  const typesEl = document.querySelector('#poke-types');
  typesEl.innerHTML = '';
  types.forEach(function(type) {
    const badge = document.createElement('span');
    badge.className   = 'type-badge';
    badge.textContent = type;
    badge.style.background = typeBadgeColors[type] || '#666';
    badge.style.color = ['electric', 'ground', 'ice'].includes(type) ? '#1a1a2e' : '#fff';
    typesEl.appendChild(badge);
  });

  // 기본 정보
  document.querySelector('#poke-height').textContent = height;
  document.querySelector('#poke-weight').textContent = weight;
  document.querySelector('#poke-exp').textContent    = exp;

  // 스탯 바 — forEach로 순회하며 생성
  const statsEl = document.querySelector('#poke-stats');
  statsEl.innerHTML = '';

  data.stats.forEach(function(statObj) {
    const statName  = statObj.stat.name;
    const statValue = statObj.base_stat;
    const maxStat   = 255;   // 스탯 최대값

    const row = document.createElement('div');
    row.className = 'stat-row';

    // 스탯 이름 (한글)
    const nameSpan = document.createElement('span');
    nameSpan.className   = 'stat-name';
    nameSpan.textContent = statNames[statName] || statName;

    // 스탯 수치
    const numSpan = document.createElement('span');
    numSpan.className   = 'stat-num';
    numSpan.textContent = statValue;

    // 스탯 바
    const barWrap = document.createElement('div');
    barWrap.className = 'stat-bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'stat-bar';

    barWrap.appendChild(bar);
    row.appendChild(nameSpan);
    row.appendChild(numSpan);
    row.appendChild(barWrap);
    statsEl.appendChild(row);

    // 애니메이션: 약간 딜레이 후 바 너비 적용
    setTimeout(function() {
      bar.style.width = (statValue / maxStat * 100) + '%';
    }, 100);
  });

  // 카드 표시
  card.classList.add('visible');
}

// ============================================================
// 랜덤 포켓몬 — 1~1025번 중 랜덤 ID 선택
// ============================================================
async function fetchRandomPokemon() {
  const randomId = Math.floor(Math.random() * 1025) + 1;
  await fetchPokemon(randomId);
}

// ============================================================
// UI 헬퍼 함수
// ============================================================

// 로딩 표시 / 숨김
function showLoading(visible) {
  if (visible) {
    loadingEl.classList.add('visible');
  } else {
    loadingEl.classList.remove('visible');
  }
}

// 에러 메시지 표시
function showError(message) {
  errorMsg.textContent = message;
}

// 에러 메시지 초기화
function clearError() {
  errorMsg.textContent = '';
}

// 카드 숨기기
function hideCard() {
  card.classList.remove('visible');
}

// ============================================================
// 이벤트 연결
// ============================================================

// 검색 버튼 클릭
btnSearch.addEventListener('click', function() {
  const query = searchInput.value.trim();
  if (query === '') {
    showError('검색어를 입력해주세요');
    return;
  }
  fetchPokemon(query);
});

// Enter 키 검색
searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    btnSearch.click();
  }
});

// 랜덤 버튼 클릭
btnRandom.addEventListener('click', function() {
  searchInput.value = '';
  fetchRandomPokemon();
});

// ============================================================
// 초기 실행 — 페이지 로드 시 랜덤 포켓몬 표시
// ============================================================
fetchRandomPokemon();

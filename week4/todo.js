// ============================================================
// 오늘의 할 일 — Todo List
// 스터디: 배열 & 반복, 객체 활용
// ============================================================

// ── 상태: 할 일 목록을 객체 배열로 관리 ──────────────────────
// 각 항목은 { id, text, completed } 구조의 객체
let todos = [];
let nextId = 1;   // 항목마다 고유 ID 부여 (하드코딩 방지)

// ── DOM 요소 선택 ─────────────────────────────────────────────
const input    = document.querySelector('#todo-input');
const addBtn   = document.querySelector('#btn-add');
const listEl   = document.querySelector('#todo-list');
const counterEl = document.querySelector('#counter');

// ── 할 일 추가 함수 ───────────────────────────────────────────
function addTodo() {
  const text = input.value.trim();   // 앞뒤 공백 제거

  // 빈 입력 방지
  if (text === '') {
    input.focus();
    return;
  }

  // 새 할 일 객체 생성 후 배열에 추가 (하드코딩 없이 동적 생성)
  const newTodo = {
    id       : nextId,
    text     : text,
    completed: false
  };

  todos.push(newTodo);
  nextId++;

  input.value = '';   // 입력칸 초기화
  input.focus();

  render();           // 화면 다시 그리기
}

// ── 할 일 삭제 함수 ───────────────────────────────────────────
function deleteTodo(id) {
  // filter로 해당 id만 제외한 새 배열 생성
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });
  render();
}

// ── 완료 토글 함수 ────────────────────────────────────────────
function toggleTodo(id) {
  // 해당 id의 객체를 찾아 completed 값 반전
  todos = todos.map(function (todo) {
    if (todo.id === id) {
      return { id: todo.id, text: todo.text, completed: !todo.completed };
    }
    return todo;
  });
  render();
}

// ── 카운터 업데이트 함수 ──────────────────────────────────────
// 완료되지 않은 항목 수를 계산해 표시
function updateCounter() {
  const remaining = todos.filter(function (todo) {
    return !todo.completed;
  }).length;

  if (todos.length === 0) {
    counterEl.textContent = '';
  } else {
    counterEl.textContent = remaining + '개 항목 남음';
  }
}

// ── 화면 렌더링 함수 ──────────────────────────────────────────
// todos 배열을 순회하며 DOM 요소를 동적으로 생성
function render() {
  listEl.innerHTML = '';  // 기존 목록 초기화

  // 빈 목록 안내 메시지
  if (todos.length === 0) {
    const empty = document.createElement('p');
    empty.className   = 'empty-msg';
    empty.textContent = '할 일을 추가해보세요 😊';
    listEl.appendChild(empty);
    updateCounter();
    return;
  }

  // todos 배열을 forEach로 순회하며 각 항목 생성
  todos.forEach(function (todo) {

    // <li> 항목 생성
    const li = document.createElement('li');
    li.className = 'todo-item';

    // 체크 버튼 (완료 토글)
    const checkBtn = document.createElement('button');
    checkBtn.className = todo.completed ? 'btn-check checked' : 'btn-check';
    checkBtn.addEventListener('click', function () {
      toggleTodo(todo.id);
    });

    // 할 일 텍스트
    const span = document.createElement('span');
    span.className   = todo.completed ? 'todo-text done' : 'todo-text';
    span.textContent = todo.text;

    // 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.className   = 'btn-delete';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', function () {
      deleteTodo(todo.id);
    });

    // li 안에 요소 추가 (appendChild)
    li.appendChild(checkBtn);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    listEl.appendChild(li);
  });

  updateCounter();
}

// ── 이벤트 연결 ───────────────────────────────────────────────

// 추가 버튼 클릭
addBtn.addEventListener('click', addTodo);

// Enter 키로도 추가 가능
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    addTodo();
  }
});

// ── 초기 실행 ─────────────────────────────────────────────────
render();

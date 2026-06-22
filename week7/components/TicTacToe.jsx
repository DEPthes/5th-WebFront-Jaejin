"use client";

import { useState } from "react";

/*
  React 공식 튜토리얼(틱택토) 기반 구현 + 마무리 단계의 추가 기능 6가지 전부 구현

  추가 기능 목록 (튜토리얼 "마무리" 섹션 참고):
  1. 이동 기록에 (행, 열) 위치 표시
  2. 현재 선택된 이동을 목록에서 굵게 표시
  3. 사각형(Square)을 하드코딩 대신 두 개의 반복문으로 생성
  4. 오름차순 / 내림차순 정렬 토글 버튼
  5. 승리한 3개의 사각형 강조 표시
  6. 무승부일 때 안내 메시지 표시
*/

// 8가지 승리 조합 (가로 3, 세로 3, 대각선 2)
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// 승자와 승리 라인을 함께 계산 (추가 기능 5번을 위해 라인 정보도 반환)
function calculateWinnerInfo(squares) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: [] };
}

// 인덱스(0~8)를 (행, 열) 형태로 변환 — 추가 기능 1번
function indexToRowCol(index) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return `(${row}행, ${col}열)`;
}

function Square({ value, onClick, isWinningSquare }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-20 h-20 text-3xl font-bold border border-slate-300",
        "flex items-center justify-center transition-colors duration-150",
        isWinningSquare
          ? "bg-emerald-100 text-emerald-700"
          : "bg-white hover:bg-slate-50",
        value === "X" ? "text-sky-600" : "",
        value === "O" ? "text-rose-500" : "",
      ].join(" ")}
    >
      {value}
    </button>
  );
}

function Board({ squares, onSquareClick, winningLine }) {
  // 추가 기능 3번: 하드코딩 대신 두 개의 반복문으로 보드 생성
  const rows = [];
  for (let row = 0; row < 3; row++) {
    const cells = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      cells.push(
        <Square
          key={index}
          value={squares[index]}
          onClick={() => onSquareClick(index)}
          isWinningSquare={winningLine.includes(index)}
        />
      );
    }
    rows.push(
      <div key={row} className="flex">
        {cells}
      </div>
    );
  }
  return <div className="inline-block border border-slate-300">{rows}</div>;
}

export default function Game() {
  // history[0]는 게임 시작 전 빈 보드, 이후 매 수마다 추가됨
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [isAscending, setIsAscending] = useState(true); // 추가 기능 4번: 정렬 순서

  const current = history[stepNumber];
  const xIsNext = stepNumber % 2 === 0;
  const { winner, line: winningLine } = calculateWinnerInfo(current.squares);
  const isDraw = !winner && current.squares.every((s) => s !== null); // 추가 기능 6번: 무승부 판정

  function handleSquareClick(i) {
    // 시간 여행 후 새로운 수를 두면 그 이후의 "미래" 기록은 버림
    const newHistory = history.slice(0, stepNumber + 1);
    const squares = current.squares.slice();

    if (winner || squares[i]) return; // 이미 승부가 났거나 채워진 칸이면 무시

    squares[i] = xIsNext ? "X" : "O";
    setHistory(newHistory.concat([{ squares, location: i }]));
    setStepNumber(newHistory.length);
  }

  function jumpTo(step) {
    setStepNumber(step);
  }

  function handleRestart() {
    setHistory([{ squares: Array(9).fill(null), location: null }]);
    setStepNumber(0);
  }

  let status;
  if (winner) {
    status = `승리: ${winner}`;
  } else if (isDraw) {
    status = "무승부입니다!"; // 추가 기능 6번
  } else {
    status = `다음 차례: ${xIsNext ? "X" : "O"}`;
  }

  // 이동 목록 생성 (추가 기능 1, 2번 포함)
  const moves = history.map((step, move) => {
    const desc = move
      ? `${move}번째 수로 이동 ${indexToRowCol(step.location)}`
      : "게임 시작으로 이동";
    const isCurrent = move === stepNumber;
    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={[
            "w-full text-left px-3 py-1.5 rounded text-sm transition-colors",
            isCurrent
              ? "font-bold bg-amber-100 text-amber-900" // 추가 기능 2번: 현재 위치 굵게 강조
              : "hover:bg-slate-100 text-slate-700",
          ].join(" ")}
        >
          {desc}
        </button>
      </li>
    );
  });

  const orderedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="min-h-[600px] flex items-center justify-center bg-slate-50 p-8">
      <div className="flex gap-8 items-start font-sans">
        <div className="flex flex-col gap-4">
          <Board
            squares={current.squares}
            onSquareClick={handleSquareClick}
            winningLine={winningLine}
          />
          <div className="text-lg font-semibold text-slate-800">{status}</div>
          <button
            onClick={handleRestart}
            className="self-start px-4 py-2 bg-slate-800 text-white rounded text-sm hover:bg-slate-700 transition-colors"
          >
            새 게임
          </button>
        </div>

        <div className="w-64 bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800">이동 기록</h2>
            <button
              onClick={() => setIsAscending((prev) => !prev)}
              className="text-xs px-2 py-1 border border-slate-300 rounded hover:bg-slate-50 text-slate-600"
            >
              {isAscending ? "오름차순 ▲" : "내림차순 ▼"}
            </button>
          </div>
          <ol className="flex flex-col gap-0.5">{orderedMoves}</ol>
        </div>
      </div>
    </div>
  );
}

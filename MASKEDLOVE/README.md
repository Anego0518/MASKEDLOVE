# MASKED LOVE

［加工］が当たり前の時代、本当の愛はどこにある？

マッチングアプリを題材にしたブラウザゲーム。条件設定 → 加工 → 第1マッチング（加工写真）→ デート（アンヴェール）→ 第2マッチング（素顔）→ エンディングの流れで、結婚して Happy END を目指す。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

## 技術スタック

- React 18 + TypeScript
- Vite
- React Router
- Zustand（状態管理）

## プロジェクト構成

- `src/phases/` — 各フェーズの画面（タイトル、条件設定、加工、マッチング、デート、エンディング）
- `src/store/` — ゲーム状態（Zustand）
- `src/data/` — キャラクター・条件・エンディングのデータ
- `src/utils/` — マッチング判定ロジック

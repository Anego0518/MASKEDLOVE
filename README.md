# MASKED LOVE

［加工］が当たり前の時代、本当の愛はどこにある？

マッチングアプリを題材にしたブラウザゲーム。条件設定 → 加工 → 第1マッチング（加工写真）→ デート（アンヴェール）→ 第2マッチング（素顔）→ エンディングの流れで、結婚して Happy END を目指す。

## 起動方法

```bash
npm install
npm run dev
```

表示された URL（例: `http://localhost:5173`）をブラウザで開く。

**注意**: Live Server や「index.html を直接開く」では動きません。必ず `npm run dev` で Vite の開発サーバーを起動してください（.tsx は Vite が変換してから配信する必要があります）。

### npm install が動かないとき

1. **Node.js を入れる**  
   https://nodejs.org/ から **LTS** をダウンロードしてインストール（npm は同梱されています）。

2. **ターミナルを開き直す**  
   インストール後は、Cursor や VS Code を一度閉じて開き直すか、「ターミナル → 新しいターミナル」で新しいターミナルを開く。

3. **プロジェクトのフォルダで実行する**  
   `package.json` があるフォルダ（この MASKEDLOVE フォルダ）で、次を実行する。
   ```bash
   npm install
   npm run dev
   ```
   Cursor で「ファイル → フォルダーを開く」で MASKEDLOVE を開いているなら、下のターミナルはそのフォルダが開いているはずなので、そのまま `npm install` でよい。

4. **「node が見つかりません」と出る場合**  
   Node を入れた直後は、PC を再起動するか、Cursor を完全に終了してから起動し直すと PATH が通ることが多い。

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

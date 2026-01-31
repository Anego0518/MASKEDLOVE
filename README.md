# MASKED LOVE

［加工］が当たり前の時代、本当の愛はどこにある？

マッチングアプリを題材にしたブラウザゲーム。条件設定 → 加工 → 第1マッチング（加工写真）→ デート（アンヴェール）→ 第2マッチング（素顔）→ エンディングの流れで、結婚して Happy END を目指す。

## 起動方法

### 方法1: Live Server（npm 不要・推奨）

変更をいつでもすぐ確認したいときや、npm を動かせないときは、**ルートの index.html** を Live Server で開きます。

1. **Live Server 拡張を入れる**  
   VS Code / Cursor の「拡張機能」で「Live Server」を検索してインストール。

2. **プロジェクトのルートを開いた状態で**  
   `index.html` を右クリック → **Open with Live Server**。ブラウザでゲームが開きます。

ルート（このリポジトリのトップ）をフォルダとして開いていれば、`index.html` が `css/style.css` と `js/app.js` を正しく読み込みます。

### 方法2: npm（Vite 開発サーバー）

```bash
npm install
npm run dev
```

表示された URL（例: `http://localhost:5173`）をブラウザで開く。React + TypeScript 版（`src/`）が動きます。

### npm install が動かないとき

1. **Node.js を入れる**  
   https://nodejs.org/ から **LTS** をダウンロードしてインストール（npm は同梱されています）。

2. **ターミナルを開き直す**  
   インストール後は、Cursor や VS Code を一度閉じて開き直すか、「ターミナル → 新しいターミナル」で新しいターミナルを開く。

3. **プロジェクトのフォルダで実行する**  
   `package.json` があるフォルダで、次を実行する。
   ```bash
   npm install
   npm run dev
   ```

4. **「node が見つかりません」と出る場合**  
   Node を入れた直後は、PC を再起動するか、Cursor を完全に終了してから起動し直すと PATH が通ることが多い。

## 技術スタック

- **ルート（Live Server）**: 静的 HTML + CSS + プレーン JavaScript（ビルド不要・`index.html` から起動）
- **開発版（`src/`）**: React 18 + TypeScript, Vite, React Router, Zustand

## 加工フェーズの「自分の写真」

加工フェーズで表示されるプレイヤー画像は、ルート選択に応じて次のファイルを参照します。

- **女性とマッチング** を選んだとき → `images/player-male.png`（男性＝あなた）
- **男性とマッチング** を選んだとき → `images/player-female.png`（女性＝あなた）

上記の PNG が無い場合は、同名的な SVG（`player-male.svg` / `player-female.svg`）が使われます。自分の顔写真を使う場合は、`images/` に **player-male.png** または **player-female.png** を置くと、そちらが優先して表示されます。

## プロジェクト構成

- **`index.html`** — 静的版のエントリ（Live Server で開く）
- **`css/style.css`** — 静的版のスタイル
- **`js/app.js`** — 静的版のロジック（データ・状態・ルート・描画）
- **`src/phases/`** — 各フェーズの画面（React 版）
- **`src/store/`** — ゲーム状態（Zustand）
- **`src/data/`** — キャラクター・条件・エンディングのデータ
- **`src/utils/`** — マッチング判定ロジック
- **`live/`** — 以前の静的版のコピー（ルートに移したので参照用）

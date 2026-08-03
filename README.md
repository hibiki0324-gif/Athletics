# Athletics 開発環境 README

## プロジェクト概要

草野球チーム「Athletics」Webサイト開発プロジェクトです。

Reactを利用したフロントエンド開発を中心に、Docker環境上で開発を行います。

---

# 開発環境

| 項目       | 内容                 |
| -------- | ------------------ |
| OS       | Mac                |
| エディタ     | Visual Studio Code |
| Frontend | React + Vite       |
| Backend  | 未定                 |
| Database | MySQL              |
| 開発環境     | Docker             |

---

# プロジェクト構成

```
Athletics
├── frontend              # Reactアプリケーション
├── backend               # Backendアプリケーション
├── docker-compose.yml    # Docker設定
└── README.md
```

---

# 初回参加時のセットアップ

## 1. 必要ツール

事前に以下をインストールしてください。

* Git
* Docker Desktop
* Visual Studio Code
* Node.js

確認コマンド：

```bash
node -v
```

```bash
npm -v
```

---

# 2. GitHubからclone

作業用ディレクトリへ移動します。

例：

```bash
cd ~/dev/web
```

リポジトリ取得：

```bash
git clone https://github.com/hibiki0324-gif/Athletics.git
```

プロジェクトへ移動：

```bash
cd Athletics
```

確認：

```bash
pwd
```

以下のようになればOKです。

```
/Users/ユーザー名/dev/web/Athletics
```

---

# 3. React環境セットアップ

frontendディレクトリへ移動します。

```bash
cd frontend
```

依存パッケージをインストールします。

```bash
npm install
```

`npm install`を実行すると、`package.json`に記載されたライブラリがインストールされます。

例：

```
package.json
      ↓
npm install
      ↓
node_modules作成
```

---

## node_modulesについて

`node_modules`にはReactや各種ライブラリの実体が保存されます。

例：

```
frontend
├── package.json
├── package-lock.json
└── node_modules
```

`node_modules`はGit管理対象外です。

理由：

* ファイル数が非常に多い
* 環境ごとの差異がある
* npm installで再生成可能

---

# 4. React起動

frontendディレクトリで実行します。

```bash
npm run dev
```

成功すると以下のように表示されます。

```
Local: http://localhost:5173/
```

ブラウザ：

```
http://localhost:5173
```

---

## React起動時の注意

`npm run dev`実行中のターミナルはReact開発サーバー専用になります。

別作業を行う場合は、新しいターミナルを開いてください。

停止する場合：

```bash
Ctrl + C
```

---

# Docker起動

プロジェクト直下へ移動します。

```bash
cd ~/dev/web/Athletics
```

確認：

```bash
ls
```

以下が存在することを確認してください。

```
docker-compose.yml
```

Docker起動：

```bash
docker compose up -d
```

状態確認：

```bash
docker ps
```

---

# VS Code起動

プロジェクト直下で実行します。

```bash
code .
```

またはVS CodeからAthleticsフォルダを開いてください。

---

# 毎日の作業開始手順

## 1. 最新コード取得

```bash
git pull
```

---

## 2. ブランチ確認

```bash
git branch
```

現在のブランチには`*`が表示されます。

例：

```
* feature/player-management
```

---

## 3. React依存確認

frontendへ移動します。

```bash
cd frontend
```

必要に応じて実行します。

```bash
npm install
```

通常、既に`node_modules`が存在する場合は不要です。

---

## npm install後のGit確認

npm install後は必ず確認します。

```bash
cd ..
git status
```

---

## package-lock.jsonが変更された場合

確認：

```bash
git diff frontend/package-lock.json
```

### 不要な変更例

```
ライブラリのパッチバージョン変更

7.29.7
 ↓
7.29.8
```

このような依存更新のみの場合は、基本的にコミット不要です。

戻す場合：

```bash
git restore frontend/package-lock.json
```

---

## 新しいライブラリを追加した場合

例：

```bash
npm install axios
```

この場合は以下が変更されます。

```
package.json
package-lock.json
```

両方Git管理します。

---

# ブランチ運用

## mainブランチ

mainは安定版です。

基本的に直接編集しません。

---

## 作業開始時

作業内容ごとにfeatureブランチを作成します。

例：

```bash
git checkout -b feature/player-management
```

確認：

```bash
git branch
```

---

# ブランチ命名ルール

形式：

```
feature/機能名
```

例：

```
feature/header
feature/login
feature/player-management
feature/game-result
```

---

# 開発中のGit操作

## 状態確認

```bash
git status
```

---

## 差分確認

```bash
git diff
```

---

## 変更追加

```bash
git add .
```

---

## Commit

```bash
git commit -m "変更内容"
```

例：

```bash
git commit -m "選手一覧画面追加"
```

---

## Push

初回：

```bash
git push -u origin feature/player-management
```

2回目以降：

```bash
git push
```

---

# Pull Requestについて

Pull Request(PR)とは、

「featureブランチの変更をmainへ取り込む申請」です。

開発フロー：

```
featureブランチ
        |
        ↓
開発
        |
        ↓
GitHubへpush
        |
        ↓
Pull Request作成
        |
        ↓
レビュー
        |
        ↓
main Merge
```

---

# Pull Request確認項目

レビュー時は以下を確認します。

* 動作確認済みか
* 不要なファイルがないか
* 命名が適切か
* 他機能への影響がないか

---

# 作業終了手順

## 1. 状態確認

```bash
git status
```

---

## 2. 差分確認

```bash
git diff
```

---

## 3. 変更追加

```bash
git add .
```

---

## 4. Commit

```bash
git commit -m "作業内容"
```

---

## 5. Push

```bash
git push
```

---

# Dockerコマンド一覧

| 目的   | コマンド                 |
| ---- | -------------------- |
| 起動   | docker compose up -d |
| 停止   | docker compose down  |
| 状態確認 | docker ps            |
| ログ確認 | docker logs コンテナ名    |

---

# Gitコマンド一覧

| 目的     | コマンド            |
| ------ | --------------- |
| 状態確認   | git status      |
| 差分確認   | git diff        |
| 追加     | git add .       |
| 保存     | git commit -m   |
| 送信     | git push        |
| 取得     | git pull        |
| ブランチ確認 | git branch      |
| 作成     | git checkout -b |

---

# 基本開発フロー

```
git pull
 ↓
ブランチ確認
 ↓
featureブランチ作成
 ↓
frontend npm install確認
 ↓
React開発
 ↓
git status
 ↓
git add .
 ↓
git commit
 ↓
git push
 ↓
Pull Request
 ↓
Merge
```

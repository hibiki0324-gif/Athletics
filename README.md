# Athletics 開発環境 README

## プロジェクト概要

草野球チーム「Athletics」Webサイト開発プロジェクトです。

## 開発環境

|項目|内容|
|-|-|
|OS|Mac|
|エディタ|Visual Studio Code|
|開発環境|Docker|
|Backend|PHP|
|Web Server|Apache|
|Database|MySQL|
|DB管理|phpMyAdmin|

---

# 初回参加時のセットアップ

## 1. 必要ツール

事前に以下をインストールしてください。

- Git
- Docker Desktop
- Visual Studio Code

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

# 3. Docker起動

プロジェクト直下で実行します。

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

以下のコンテナが起動していればOKです。

```
athletics-web
athletics-db
athletics-phpmyadmin
```

---

# 4. 動作確認

## Web

ブラウザ：

```
http://localhost:8080
```

---

## phpMyAdmin

ブラウザ：

```
http://localhost:8081
```

---

# VS Codeで開発開始

プロジェクト直下で：

```bash
code .
```

またはVS CodeからAthleticsフォルダを開いてください。

---

# 毎日の作業開始手順

## 1. プロジェクトへ移動

```bash
cd ~/dev/web/Athletics
```

---

## 2. 最新コード取得

作業開始前に必ず実行します。

```bash
git pull
```

GitHub上の最新変更を取得します。

---

## 3. ブランチ確認

現在のブランチ確認：

```bash
git branch
```

例：

```
* main
```

または

```
* feature/player-management
```

`*` が現在使用中のブランチです。

---

## 4. Docker起動

```bash
docker compose up -d
```

確認：

```bash
docker ps
```

---

## 5. VS Code起動

```bash
code .
```

---

# ブランチ運用

## mainブランチ

mainは安定版です。

基本的に直接編集しません。

---

## 作業開始時

作業内容ごとにブランチを作成します。

例：

選手管理機能の場合

```bash
git checkout -b feature/player-management
```

確認：

```bash
git branch
```

結果：

```
main
* feature/player-management
```

ならOKです。

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

## 変更確認

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

「この変更をmainへ取り込んでください」

という申請です。

開発フロー：

```
featureブランチ
        |
        |
        ↓
GitHubへpush
        |
        |
        ↓
Pull Request作成
        |
        |
        ↓
レビュー
        |
        |
        ↓
mainへMerge
```

---

# Pull Request確認項目

レビュー時は以下を確認します。

- 動作確認済みか
- 不要なファイルがないか
- 命名が適切か
- 他機能への影響がないか

問題なければMergeします。

---

# 作業終了手順

## 1. Git状態確認

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

例：

```bash
git commit -m "トップページレイアウト修正"
```

---

## 5. Push

```bash
git push
```

---

## 6. Docker停止

作業終了時は停止推奨です。

```bash
docker compose down
```

---

# Dockerコマンド一覧

|目的|コマンド|
|-|-|
|起動|docker compose up -d|
|停止|docker compose down|
|状態確認|docker ps|
|ログ確認|docker logs コンテナ名|

---

# Gitコマンド一覧

|目的|コマンド|
|-|-|
|状態確認|git status|
|差分確認|git diff|
|追加|git add .|
|保存|git commit -m|
|送信|git push|
|取得|git pull|
|ブランチ確認|git branch|
|ブランチ作成|git checkout -b|

---

# 基本開発フロー

```
git pull
 ↓
ブランチ確認
 ↓
featureブランチ作成
 ↓
開発
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
# Athletics 開発環境 README

## プロジェクト概要

草野球チーム「Athletics」のWebサイト開発プロジェクトです。

Reactを利用したフロントエンド、FastAPIを利用したバックエンド、MySQLを利用したデータベースで構成されています。

開発環境はDockerを利用して構築します。

---

# システム構成

現在のシステム構成は以下です。

```text
┌──────────────────────┐
│      Browser         │
│                      │
│  React + Vite        │
│  localhost:5173      │
└──────────┬───────────┘
           │ HTTP
           │ API Request
           ↓
┌──────────────────────┐
│      FastAPI         │
│                      │
│  localhost:8000      │
└──────────┬───────────┘
           │ SQLAlchemy
           ↓
┌──────────────────────┐
│       MySQL          │
│                      │
│  localhost:3307      │
└──────────────────────┘
```

フロントエンドから直接MySQLへ接続することはありません。

基本的には、

```text
React
  ↓
FastAPI API
  ↓
SQLAlchemy
  ↓
MySQL
```

という流れでデータを取得・登録します。

---

# 開発環境

| 項目        | 内容                 |
| --------- | ------------------ |
| OS        | Mac                |
| エディタ      | Visual Studio Code |
| Frontend  | React + Vite       |
| Backend   | FastAPI + Python   |
| ORM       | SQLAlchemy         |
| Database  | MySQL 8.0          |
| APIドキュメント | Swagger UI         |
| 開発環境      | Docker             |
| パッケージ管理   | npm / pip          |

---

# プロジェクト構成

```text
Athletics
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── types
│   │   └── assets
│   ├── package.json
│   └── package-lock.json
│
├── backend
│   ├── app
│   │   └── database.py
│   ├── models
│   │   ├── player.py
│   │   ├── player_position.py
│   │   └── position.py
│   ├── routers
│   │   └── players.py
│   ├── schemas
│   │   └── player.py
│   ├── main.py
│   └── requirements.txt
│
├── database
│   └── init.sql
│
├── docker
│   └── python
│       └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

# 使用ポート

| サービス       | URL / Port                 | 用途          |
| ---------- | -------------------------- | ----------- |
| React      | http://localhost:5173      | フロントエンド     |
| FastAPI    | http://localhost:8000      | Backend API |
| Swagger UI | http://localhost:8000/docs | API確認・操作    |
| MySQL      | localhost:3307             | Database    |
| phpMyAdmin | http://localhost:8081      | DB管理        |

---

# 初回参加時のセットアップ

## 1. 必要ツール

事前に以下をインストールしてください。

* Git
* Docker Desktop
* Visual Studio Code
* Node.js
* npm

確認コマンド：

```bash
node -v
npm -v
git --version
docker --version
docker compose version
```

---

# 2. GitHubからclone

作業用ディレクトリへ移動します。

```bash
cd ~/dev/web
```

リポジトリを取得します。

```bash
git clone https://github.com/hibiki0324-gif/Athletics.git
```

プロジェクトへ移動します。

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

# 3. mainブランチを最新化

clone直後はmainブランチになっていることを確認します。

```bash
git switch main
git pull origin main
```

確認：

```bash
git status
git branch
```

現在のブランチに `*` が表示されます。

---

# 4. Docker起動

プロジェクト直下で実行します。

```bash
docker compose up -d
```

起動状態を確認します。

```bash
docker compose ps
```

以下のようにBackend、DB、phpMyAdminなどが起動していればOKです。

```text
athletics-backend
athletics-db
athletics-phpmyadmin
```

---

# Dockerを起動する理由

Reactから選手情報などを取得する場合、Backend APIが必要です。

```text
React
 ↓
http://localhost:8000/players
 ↓
FastAPI
 ↓
MySQL
```

そのため、Frontendだけを起動してもAPIからデータを取得することはできません。

開発時は基本的に、

```text
Docker起動
    ↓
Backend + MySQL起動
    ↓
React起動
```

という順番で起動します。

---

# 5. React環境セットアップ

Frontendディレクトリへ移動します。

```bash
cd frontend
```

依存パッケージをインストールします。

```bash
npm install
```

`npm install`を実行すると、`package.json`に記載されたライブラリがインストールされます。

```text
package.json
      ↓
npm install
      ↓
node_modules作成
```

---

## node_modulesについて

`node_modules`にはReactや各種ライブラリの実体が保存されます。

```text
frontend
├── package.json
├── package-lock.json
└── node_modules
```

`node_modules`はGit管理対象外です。

理由：

* ファイル数が非常に多い
* 環境ごとの差異がある
* `npm install`で再生成可能

---

# 6. React起動

Frontendディレクトリで実行します。

```bash
npm run dev
```

成功すると以下のように表示されます。

```text
Local: http://localhost:5173/
```

ブラウザで以下を開きます。

```text
http://localhost:5173
```

---

## React起動時の注意

`npm run dev`実行中のターミナルはReact開発サーバー専用になります。

別作業を行う場合は、新しいターミナルを開いてください。

停止する場合：

```text
Ctrl + C
```

---

# Backend APIの確認

BackendはFastAPIで構築されています。

起動確認：

```bash
curl http://localhost:8000/
```

正常に起動していれば、以下のようなレスポンスが返ります。

```json
{
  "message": "Athletics API is running"
}
```

---

# Swagger UI

FastAPIにはSwagger UIが用意されています。

ブラウザで以下を開きます。

```text
http://localhost:8000/docs
```

Swagger UIでは、現在Backendに実装されているAPIを確認できます。

また、ブラウザ上からAPIを実際に実行することもできます。

```text
GET
POST
PUT
```

などのAPIを選択し、

```text
Try it out
```

を押すことでリクエストを送信できます。

---

# 選手API

現在、選手APIとして以下を実装しています。

| Method | Endpoint               | 内容     |
| ------ | ---------------------- | ------ |
| GET    | `/players`             | 選手一覧取得 |
| GET    | `/players/{player_id}` | 選手詳細取得 |
| POST   | `/players`             | 選手登録   |
| PUT    | `/players/{player_id}` | 選手更新   |

---

# 選手一覧を取得する

以下のURLへアクセスします。

```text
http://localhost:8000/players
```

またはターミナルから、

```bash
curl http://localhost:8000/players
```

実行します。

レスポンス例：

```json
[
  {
    "id": 1,
    "name": "今村 響",
    "uniform_number": 38,
    "batting_hand": "右",
    "throwing_hand": "右",
    "profile_image": null,
    "is_active": true
  },
  {
    "id": 2,
    "name": "岡嶋 竜也",
    "uniform_number": 6,
    "batting_hand": "右",
    "throwing_hand": "右",
    "profile_image": null,
    "is_active": true
  }
]
```

---

# Swagger UIから選手を登録する

開発中にテストデータを追加したい場合は、Swagger UIを利用できます。

## 1. Swagger UIを開く

```text
http://localhost:8000/docs
```

---

## 2. POST /playersを開く

Swagger UIで、

```text
POST /players
```

を探します。

---

## 3. Try it outを押す

右側の、

```text
Try it out
```

を押します。

---

## 4. JSONを入力

例えば、

```json
{
  "name": "テスト 太郎",
  "uniform_number": 10,
  "batting_hand": "右",
  "throwing_hand": "右",
  "profile_image": null
}
```

を入力します。

---

## 5. Executeを押す

`Execute`を押すとAPIへリクエストが送信されます。

正常に登録されると、HTTPステータス `201` が返ります。

---

# 選手登録時の注意

現在、背番号は重複できません。

例えば、すでに、

```text
背番号 10
```

の選手が登録されている状態で、もう一度10番を登録すると、

```json
{
  "detail": "その背番号は既に使用されています"
}
```

というエラーになります。

テストデータを追加するときは、既存選手と異なる背番号を使用してください。

---

# DBを直接確認する

MySQLのデータを確認したい場合は、phpMyAdminまたはMySQLコマンドを利用できます。

## phpMyAdmin

ブラウザで以下を開きます。

```text
http://localhost:8081
```

ログイン情報は `docker-compose.yml` の設定を確認してください。

---

## MySQLへコマンドラインから接続

Dockerコンテナ内のMySQLへ接続できます。

```bash
docker compose exec db mysql --default-character-set=utf8mb4 -u root -p athletics
```

パスワード入力後、MySQLへ接続できます。

---

## playersテーブルを確認

MySQLへ接続後、

```sql
SELECT * FROM players;
```

を実行します。

特定の選手を確認する場合：

```sql
SELECT * FROM players WHERE id = 1;
```

---

# テストデータを削除する

テストで登録した選手を削除したい場合は、MySQLから削除できます。

例えばIDが4の場合：

```bash
docker compose exec db mysql --default-character-set=utf8mb4 -u root -p athletics -e "DELETE FROM players WHERE id=4;"
```

注意：

この操作はDBのデータを直接削除します。

本番環境では使用せず、開発環境でのみ使用してください。

---

# init.sqlについて

`database/init.sql`には、DBを初期構築するときに使用するSQLが記載されています。

例えば、以下のような初期データが登録されています。

```text
今村 響
岡嶋 竜也
```

そのため、初めてDocker環境を構築する開発者は、初期状態としてこれらの選手データを利用できます。

---

## init.sqlが実行されるタイミング

`init.sql`は、MySQLのデータベースが初期化されるタイミングで実行されます。

重要なのは、

```text
docker compose up
```

を実行するたびに `init.sql` が実行されるわけではないということです。

既にMySQLのデータボリュームが存在する場合、基本的には既存のDBがそのまま使用されます。

そのため、

```text
GitHubからmainをpull
        ↓
docker compose up -d
```

を行っても、既存DBのデータが自動的に初期化されるわけではありません。

---

# DBを完全に初期化したい場合

開発環境でDBを作り直したい場合は、Dockerのボリュームを削除してから起動します。

注意：

**この操作を行うと、現在のDocker上のDBデータが削除されます。**

実行前に必要なデータがないことを確認してください。

```bash
docker compose down -v
```

その後、

```bash
docker compose up -d
```

を実行します。

これにより新しいMySQLデータベースが作成され、`database/init.sql`による初期構築が行われます。

---

# CORSについて

FrontendとBackendは異なるポートで動作します。

```text
Frontend
http://localhost:5173

Backend
http://localhost:8000
```

そのため、Backend側でCORSを設定しています。

現在は開発環境として、

```text
http://localhost:5173
```

からのアクセスを許可しています。

---

# 毎日の作業開始手順

## 1. プロジェクトへ移動

```bash
cd ~/dev/web/Athletics
```

---

## 2. mainを最新化

```bash
git switch main
git pull origin main
```

---

## 3. 作業ブランチを作成

作業内容ごとにfeatureブランチを作成します。

```bash
git switch -c feature/機能名
```

例：

```bash
git switch -c feature/player-management
```

---

## 4. Docker起動

```bash
docker compose up -d
```

---

## 5. Frontend起動

```bash
cd frontend
npm install
npm run dev
```

`npm install`は依存関係に変更がない場合、毎回実行する必要はありません。

---

# ブランチ運用

## mainブランチ

`main`は安定版として扱います。

基本的に直接編集しません。

作業するときは必ずfeatureブランチを作成します。

---

# ブランチ命名ルール

形式：

```text
feature/機能名
```

例：

```text
feature/header
feature/login
feature/player-management
feature/player-api
feature/game-result
feature/batting-stats
feature/update-readme-api
```

---

# 開発中のGit操作

## 状態確認

```bash
git status
```

---

## ブランチ確認

```bash
git branch
```

現在のブランチには `*` が表示されます。

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
git commit -m "feat: add player management"
```

---

## Push

初回：

```bash
git push -u origin feature/ブランチ名
```

2回目以降：

```bash
git push
```

---

# Pull Requestについて

Pull Request（PR）とは、

「featureブランチの変更をmainへ取り込む申請」です。

基本的な開発フロー：

```text
main
 ↓
featureブランチ作成
 ↓
開発
 ↓
動作確認
 ↓
commit
 ↓
GitHubへpush
 ↓
Pull Request作成
 ↓
レビュー
 ↓
mainへMerge
```

---

# Pull Request確認項目

レビュー時は以下を確認します。

* 動作確認済みか
* 不要なファイルがないか
* 命名が適切か
* 他機能への影響がないか
* APIの変更がある場合、既存機能に影響がないか
* DBの変更がある場合、`init.sql`なども更新されているか

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

| 目的           | コマンド                             |
| ------------ | -------------------------------- |
| 起動           | `docker compose up -d`           |
| 停止           | `docker compose down`            |
| 停止＋DBボリューム削除 | `docker compose down -v`         |
| 状態確認         | `docker compose ps`              |
| Backendログ確認  | `docker compose logs backend`    |
| DBログ確認       | `docker compose logs db`         |
| Backend再起動   | `docker compose restart backend` |

---

# API確認コマンド

## Backendの起動確認

```bash
curl http://localhost:8000/
```

---

## 選手一覧取得

```bash
curl http://localhost:8000/players
```

---

## 選手詳細取得

```bash
curl http://localhost:8000/players/1
```

存在しないIDを指定した場合は、

```bash
curl http://localhost:8000/players/999
```

以下のような404エラーになります。

```json
{
  "detail": "選手が見つかりません"
}
```

---

# Gitコマンド一覧

| 目的     | コマンド                        |
| ------ | --------------------------- |
| 状態確認   | `git status`                |
| 差分確認   | `git diff`                  |
| 追加     | `git add .`                 |
| Commit | `git commit -m "メッセージ"`     |
| Push   | `git push`                  |
| 初回Push | `git push -u origin ブランチ名`  |
| 取得     | `git pull`                  |
| ブランチ確認 | `git branch`                |
| ブランチ作成 | `git switch -c feature/機能名` |
| ブランチ切替 | `git switch ブランチ名`          |

---

# 基本開発フロー

```text
mainを最新化
 ↓
git pull origin main
 ↓
featureブランチ作成
 ↓
Docker起動
 ↓
Frontend起動
 ↓
開発
 ↓
動作確認
 ↓
git status
 ↓
git add
 ↓
git commit
 ↓
git push
 ↓
Pull Request
 ↓
レビュー
 ↓
mainへMerge
```

---

# 現在の開発方針

現在は以下の構成で開発しています。

```text
Frontend
React + Vite

Backend
FastAPI

Database
MySQL

開発環境
Docker

API
FastAPI + SQLAlchemy
```

現在は選手情報について、

```text
MySQL
 ↓
FastAPI
 ↓
GET /players
 ↓
React
 ↓
選手紹介ページ
```

というデータ取得の流れが実装されています。

今後、選手情報だけでなく、試合結果や打撃成績などについても同様にAPI連携を進めていきます。

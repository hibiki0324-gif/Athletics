# Athletics

草野球チーム「アスレチックス」のチームホームページ・管理システム開発プロジェクトです。

FrontendとBackendを分離し、Backend APIを介してMySQLのデータを取得・更新する構成で開発しています。

---

# 1. プロジェクト概要

本プロジェクトでは、草野球チームの以下の情報を管理・公開できるWebサイトを構築します。

- チーム情報
- 選手情報
- 選手の守備位置
- 試合結果
- 打撃成績
- 試合ごとの先発・出場情報
- 投手の勝敗・セーブ情報
- シーズン情報

システムは以下の3層構成を基本とします。

```text
React
  ↓
FastAPI
  ↓
SQLAlchemy
  ↓
MySQL
```

FrontendとBackendはそれぞれ独立して開発し、Backendが提供するREST APIを介してデータを連携します。

---

# 2. 開発方針

本プロジェクトでは、実務に近い開発フローを意識して開発を行います。

基本的な開発工程は以下です。

```text
要件定義
 ↓
基本設計
 ↓
DB設計
 ↓
Backend API設計・実装
 ↓
Frontend実装
 ↓
結合
 ↓
テスト
 ↓
公開
```

GitHubを使用してソースコードを管理し、機能単位でfeatureブランチを作成して開発します。

---

# 3. 技術構成

| 項目 | 技術 |
| --- | --- |
| Frontend | React |
| Frontend Build Tool | Vite |
| Backend | FastAPI |
| Backend Language | Python |
| ORM | SQLAlchemy |
| Database | MySQL 8.0 |
| API Documentation | Swagger UI |
| Container | Docker / Docker Compose |
| Package Management | npm / pip |
| Source Control | Git / GitHub |

---

# 4. 開発環境

| 項目 | 内容 |
| --- | --- |
| OS | macOS |
| Editor | Visual Studio Code |
| Frontend | React + Vite |
| Backend | FastAPI + Python |
| ORM | SQLAlchemy |
| Database | MySQL 8.0 |
| API Documentation | Swagger UI |
| Container | Docker |
| Package Management | npm / pip |

---

# 5. システム構成

開発環境では以下の構成で各サービスを起動します。

```text
┌─────────────────────────────┐
│          Browser            │
└─────────────┬───────────────┘
              │
              │ HTTP
              ▼
┌─────────────────────────────┐
│      React / Vite           │
│      localhost:5173         │
└─────────────┬───────────────┘
              │
              │ REST API
              ▼
┌─────────────────────────────┐
│      FastAPI Backend        │
│      localhost:8000         │
└─────────────┬───────────────┘
              │
              │ SQLAlchemy
              ▼
┌─────────────────────────────┐
│         MySQL 8.0           │
│      localhost:3307         │
└─────────────────────────────┘

        ┌─────────────────┐
        │    phpMyAdmin   │
        │ localhost:8081  │
        └─────────────────┘
```

Frontendから直接MySQLへ接続することはありません。

DatabaseへのアクセスはBackendが担当します。

---

# 6. 使用ポート

| サービス | URL / Port | 用途 |
| --- | --- | --- |
| React / Vite | http://localhost:5173 | Frontend |
| FastAPI | http://localhost:8000 | Backend API |
| Swagger UI | http://localhost:8000/docs | API確認 |
| MySQL | localhost:3307 | Database |
| phpMyAdmin | http://localhost:8081 | Database管理 |

---

# 7. プロジェクト構成

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
│   │   ├── match.py
│   │   ├── match_batting_stat.py
│   │   ├── match_battery.py
│   │   ├── match_inning.py
│   │   ├── match_lineup_entry.py
│   │   ├── match_pitching_decision.py
│   │   ├── match_team.py
│   │   ├── player.py
│   │   ├── player_position.py
│   │   ├── position.py
│   │   ├── season.py
│   │   └── team.py
│   ├── routers
│   │   ├── players.py
│   │   ├── positions.py
│   │   ├── seasons.py
│   │   └── teams.py
│   ├── schemas
│   │   ├── player.py
│   │   ├── position.py
│   │   ├── season.py
│   │   └── team.py
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

# 8. Backendの責務

BackendはFrontendとDatabaseの間に位置し、以下を担当します。

- REST APIの提供
- リクエストデータのバリデーション
- Databaseへのアクセス
- データの取得・登録・更新
- SQLAlchemyによるORM処理
- APIレスポンスの生成

データの流れは以下です。

```text
Frontend
   ↓
HTTP Request
   ↓
FastAPI Router
   ↓
Schema
   ↓
SQLAlchemy Model
   ↓
MySQL
   ↓
SQLAlchemy
   ↓
FastAPI
   ↓
JSON Response
   ↓
Frontend
```

Backend内部の詳細については、`backend/README.md`を参照してください。

---

# 9. Databaseの責務

Databaseには、チーム・選手・試合・成績などの永続データを保存します。

現在の主なテーブルは以下です。

| テーブル | 内容 |
| --- | --- |
| players | 選手情報 |
| positions | 守備位置マスタ |
| player_positions | 選手と守備位置の関連 |
| seasons | シーズン情報 |
| teams | チーム情報 |
| matches | 試合情報 |
| match_teams | 試合に参加するチーム |
| match_innings | イニング別得点 |
| match_lineup_entries | 試合の出場・守備情報 |
| match_batting_stats | 試合ごとの打撃成績 |
| match_pitching_decisions | 勝敗・セーブ情報 |
| match_batteries | 試合中のバッテリー履歴 |

詳細なDB設計については、`database/README.md`を参照してください。

---

# 10. 初回セットアップ

## 10.1 必要ツール

以下を事前にインストールしてください。

- Git
- Docker Desktop
- Visual Studio Code
- Node.js
- npm

確認コマンド：

```bash
node -v
npm -v
git --version
docker --version
docker compose version
```

---

# 11. GitHubからclone

作業用ディレクトリへ移動します。

```bash
cd ~/dev/web
```

リポジトリをcloneします。

```bash
git clone https://github.com/hibiki0324-gif/Athletics.git
```

プロジェクトへ移動します。

```bash
cd Athletics
```

現在位置を確認します。

```bash
pwd
```

---

# 12. mainブランチを最新化

mainブランチへ切り替えます。

```bash
git switch main
```

GitHub上の最新状態を取得します。

```bash
git pull origin main
```

状態を確認します。

```bash
git status
```

ブランチを確認します。

```bash
git branch
```

現在のブランチには `*` が表示されます。

---

# 13. Docker起動

プロジェクトルートで以下を実行します。

```bash
docker compose up -d
```

起動状態を確認します。

```bash
docker compose ps
```

以下のサービスが起動していることを確認します。

```text
athletics-backend
athletics-db
athletics-phpmyadmin
```

---

# 14. Dockerの役割

Docker Composeでは以下のサービスを管理しています。

```text
backend
 └─ FastAPI

db
 └─ MySQL 8.0

phpmyadmin
 └─ Database管理画面
```

BackendからDatabaseへはDocker内部ネットワークを利用して接続します。

```text
FastAPI
   ↓
db
   ↓
MySQL
```

BackendのDatabase接続先は、Docker Compose上では`db`というサービス名を使用します。

---

# 15. Frontendセットアップ

Frontendディレクトリへ移動します。

```bash
cd frontend
```

依存パッケージをインストールします。

```bash
npm install
```

`package.json`および`package-lock.json`を基準として必要なパッケージがインストールされます。

---

# 16. Frontend起動

Frontendディレクトリで以下を実行します。

```bash
npm run dev
```

起動後、以下へアクセスします。

```text
http://localhost:5173
```

停止する場合：

```text
Ctrl + C
```

---

# 17. Backend起動

BackendはDocker Composeから起動します。

```bash
docker compose up -d backend
```

起動状態：

```bash
docker compose ps
```

Backendは以下でアクセスできます。

```text
http://localhost:8000
```

---

# 18. Backend API確認

APIの確認にはSwagger UIを使用できます。

```text
http://localhost:8000/docs
```

FastAPIが提供するAPI一覧を確認できます。

Swagger UIでは、ブラウザ上からAPIを実行できます。

```text
GET
POST
PUT
```

などのAPIを選択し、`Try it out`からリクエストを送信できます。

---

# 19. API一覧

現在実装されている主なAPIは以下です。

## Players

| Method | Endpoint | 内容 |
| --- | --- | --- |
| GET | `/players` | 選手一覧取得 |
| GET | `/players/{player_id}` | 選手詳細取得 |
| POST | `/players` | 選手登録 |
| PUT | `/players/{player_id}` | 選手更新 |
| GET | `/players/{player_id}/positions` | 選手の守備位置取得 |
| PUT | `/players/{player_id}/positions` | 選手の守備位置更新 |

## Positions

| Method | Endpoint | 内容 |
| --- | --- | --- |
| GET | `/positions` | 守備位置一覧取得 |

## Seasons

| Method | Endpoint | 内容 |
| --- | --- | --- |
| GET | `/seasons` | シーズン一覧取得 |

## Teams

| Method | Endpoint | 内容 |
| --- | --- | --- |
| GET | `/teams` | チーム一覧取得 |

## Matches

| Method | Endpoint | 内容 |
| --- | --- | --- |
| POST | `/matches` | 試合登録 |

今後、試合結果・打撃成績・出場選手などのAPIを拡張していきます。

---

# 20. APIデータ連携

FrontendとBackendのデータ連携はREST APIを使用します。

例えば選手一覧の場合：

```text
React
 ↓
GET /players
 ↓
FastAPI
 ↓
MySQL
 ↓
FastAPI
 ↓
JSON
 ↓
React
```

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
  }
]
```

---

# 21. 選手情報

選手テーブルでは以下の情報を管理します。

| 項目 | 内容 |
| --- | --- |
| id | 選手ID |
| name | 選手名 |
| uniform_number | 背番号 |
| batting_hand | 打席 |
| throwing_hand | 利き腕 |
| profile_image | プロフィール画像 |
| is_active | 現役選手かどうか |

選手の守備位置は`player_positions`を介して管理します。

そのため、1人の選手が複数の守備位置を持つことができます。

```text
Player
  │
  └── PlayerPosition
        ├── 投手
        ├── 一塁手
        └── 外野手
```

---

# 22. 試合情報

試合情報は以下のような構造で管理します。

```text
Season
  │
  └── Match
        │
        ├── MatchTeam
        │     ├── Team
        │     ├── MatchInning
        │     ├── MatchLineupEntry
        │     ├── MatchBattingStats
        │     └── MatchBattery
        │
        └── MatchPitchingDecision
```

これにより、単純な試合結果だけではなく、

- イニング別得点
- 試合出場選手
- 守備位置
- 打撃成績
- バッテリー履歴
- 勝敗・セーブ

などを試合単位で管理できる構成としています。

---

# 23. DB初期構築

Databaseの初期構築SQLは以下にあります。

```text
database/init.sql
```

`init.sql`にはテーブル作成SQLおよび初期マスタ・初期データが定義されています。

初期データとして、

- 守備位置
- 2026年シーズン
- アスレチックス
- 初期選手

などを登録しています。

---

# 24. init.sqlの実行タイミング

`init.sql`はMySQLのデータディレクトリが初期化される際に実行されます。

Docker Composeでは以下のようにマウントしています。

```text
./database/init.sql
        ↓
/docker-entrypoint-initdb.d/init.sql
```

既にMySQLのデータボリュームが存在する場合、`docker compose up`を実行するだけでは`init.sql`は再実行されません。

そのため、通常の開発では既存DBのデータが維持されます。

---

# 25. DBを初期化する場合

開発環境のDatabaseを完全に作り直す場合：

```bash
docker compose down -v
```

その後、

```bash
docker compose up -d
```

を実行します。

注意：

```bash
docker compose down -v
```

を実行するとDocker Volumeが削除されるため、現在保存されているDatabaseのデータも削除されます。

必要なデータが存在する場合は、事前にバックアップしてください。

---

# 26. phpMyAdmin

DatabaseをGUIから確認する場合はphpMyAdminを使用できます。

```text
http://localhost:8081
```

接続先はDocker Composeの`db`サービスです。

ログイン情報は`docker-compose.yml`で管理しています。

---

# 27. MySQLへ接続

Dockerコンテナ内のMySQLへ接続する場合：

```bash
docker compose exec db mysql --default-character-set=utf8mb4 -u root -p athletics
```

Databaseへ接続後：

```sql
SHOW TABLES;
```

選手情報を確認：

```sql
SELECT * FROM players;
```

試合情報を確認：

```sql
SELECT * FROM matches;
```

---

# 28. Dockerコマンド

| 目的 | コマンド |
| --- | --- |
| 起動 | `docker compose up -d` |
| 停止 | `docker compose down` |
| 停止＋Volume削除 | `docker compose down -v` |
| 状態確認 | `docker compose ps` |
| Backendログ | `docker compose logs backend` |
| DBログ | `docker compose logs db` |
| Backend再起動 | `docker compose restart backend` |
| 全サービスログ | `docker compose logs` |

---

# 29. Git運用

本プロジェクトでは、mainブランチを安定版として扱います。

基本的にmainへ直接変更を加えず、featureブランチを作成して開発します。

基本フロー：

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
push
 ↓
Pull Request
 ↓
レビュー
 ↓
mainへMerge
```

---

# 30. ブランチ命名

基本形式：

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

修正の場合は必要に応じて、

```text
fix/修正内容
```

とします。

例：

```text
fix/player-api
fix/header-scroll
```

---

# 31. 作業開始手順

毎日の作業開始時は以下を基本とします。

## 1. プロジェクトへ移動

```bash
cd ~/dev/web/Athletics
```

## 2. mainを最新化

```bash
git switch main
git pull origin main
```

## 3. featureブランチ作成

```bash
git switch -c feature/機能名
```

## 4. Docker起動

```bash
docker compose up -d
```

## 5. Frontend起動

```bash
cd frontend
npm run dev
```

---

# 32. 作業中のGit操作

状態確認：

```bash
git status
```

差分確認：

```bash
git diff
```

変更をステージング：

```bash
git add .
```

Commit：

```bash
git commit -m "変更内容"
```

Push：

```bash
git push
```

初回Pushの場合：

```bash
git push -u origin feature/ブランチ名
```

---

# 33. Pull Request

Pull Request（PR）は、featureブランチの変更をmainへ取り込むために使用します。

基本的な流れ：

```text
featureブランチ
      ↓
    Push
      ↓
Pull Request作成
      ↓
    Review
      ↓
    Merge
      ↓
     main
```

---

# 34. Pull Request確認項目

PRを作成した際は、以下を確認します。

- 実装内容が目的に合っているか
- 動作確認が完了しているか
- 不要なファイルが含まれていないか
- 命名が適切か
- 既存機能へ影響がないか
- API変更がある場合、既存APIへの影響がないか
- DB変更がある場合、`database/init.sql`が更新されているか
- READMEなどのドキュメント更新が必要か

---

# 35. 作業終了手順

## 1. 状態確認

```bash
git status
```

## 2. 差分確認

```bash
git diff
```

## 3. Commit

```bash
git add .
git commit -m "変更内容"
```

## 4. Push

```bash
git push
```

---

# 36. Gitコマンド一覧

| 目的 | コマンド |
| --- | --- |
| 状態確認 | `git status` |
| 差分確認 | `git diff` |
| 追加 | `git add .` |
| Commit | `git commit -m "メッセージ"` |
| Push | `git push` |
| 初回Push | `git push -u origin ブランチ名` |
| Pull | `git pull` |
| main取得 | `git pull origin main` |
| ブランチ確認 | `git branch` |
| ブランチ作成 | `git switch -c feature/機能名` |
| ブランチ切替 | `git switch ブランチ名` |

---

# 37. 開発時の基本的なデータフロー

## 選手情報

```text
MySQL
 ↓
SQLAlchemy
 ↓
FastAPI
 ↓
GET /players
 ↓
React
 ↓
選手一覧・選手紹介
```

---

## 試合情報

```text
MySQL
 ↓
SQLAlchemy
 ↓
FastAPI
 ↓
試合API
 ↓
React
 ↓
試合結果ページ
```

---

## 打撃成績

```text
MySQL
 ↓
SQLAlchemy
 ↓
FastAPI
 ↓
打撃成績API
 ↓
React
 ↓
打撃成績ページ
```

---

# 38. 現在の実装状況

現在Backendでは、基本的なマスタ情報および選手情報についてAPI連携を実装しています。

## 実装済み

- FastAPI起動
- MySQL接続
- SQLAlchemyによるORM
- Swagger UI
- 選手一覧取得
- 選手詳細取得
- 選手登録
- 選手更新
- 選手の守備位置取得
- 選手の守備位置更新
- 守備位置一覧取得
- シーズン一覧取得
- チーム一覧取得
- 試合登録

---

# 39. 今後の実装予定

今後は以下の機能を段階的に実装します。

## 試合関連

- 試合一覧取得
- 試合詳細取得
- 試合結果更新
- イニング別得点管理
- 対戦チーム管理

## 出場選手関連

- スターティングメンバー登録
- 選手交代
- 守備位置変更
- 出場履歴管理

## 打撃成績関連

- 試合ごとの打撃成績登録
- 打撃成績更新
- シーズン成績集計
- 選手別成績取得

## 投手関連

- 勝利投手
- 敗戦投手
- セーブ投手
- バッテリー履歴

---

# 40. ドキュメント構成

本プロジェクトでは、ドキュメントを役割ごとに分離して管理します。

```text
README.md
│
├── プロジェクト概要
├── 開発環境
├── セットアップ
├── Git運用
└── 全体開発方針
```

Databaseについては、

```text
database/README.md
```

で以下を管理します。

```text
database/README.md
│
├── DB概要
├── テーブル一覧
├── ER構造
├── 各テーブル仕様
├── 主キー・外部キー
├── インデックス
├── 初期データ
└── DB運用ルール
```

Backendについては、

```text
backend/README.md
```

で以下を管理します。

```text
backend/README.md
│
├── Backend概要
├── FastAPI構成
├── ディレクトリ構成
├── Model
├── Schema
├── Router
├── API仕様
├── Database接続
└── 開発ルール
```

---

# 41. ドキュメント作成の方針

各READMEは、それぞれの担当範囲に応じて詳細を記載します。

```text
README.md
   ↓
プロジェクト全体

database/README.md
   ↓
Database・テーブル設計

backend/README.md
   ↓
FastAPI・API・ORM

frontend/README.md
   ↓
React・画面・コンポーネント
```

同じ内容を複数のREADMEに重複して記載するのではなく、それぞれの責務に応じて情報を分離します。

---

# 42. 開発環境と本番環境

現在はlocalhost上で開発を行います。

```text
開発環境

Mac
 ↓
Docker
 ├── FastAPI
 ├── MySQL
 └── phpMyAdmin

Mac
 ↓
React / Vite
```

開発完了後は、VPSなどのサーバー環境へ配置して公開する予定です。

本番環境の詳細な構成については、公開環境構築時に別途設計します。

---

# 43. 注意事項

## mainブランチへ直接Pushしない

原則としてfeatureブランチで作業してください。

---

## DBを不用意に初期化しない

以下のコマンドはDB Volumeを削除します。

```bash
docker compose down -v
```

開発環境のデータが削除されるため、使用する際は注意してください。

---

## node_modulesをCommitしない

`node_modules`はGit管理対象外です。

必要な場合は、

```bash
npm install
```

で再生成してください。

---

## 環境依存情報をCommitしない

パスワードや秘密情報などの機密情報をGitHubへCommitしないでください。

---

# 44. 現在のゴール

本プロジェクトの最終的な構成は以下を目指します。

```text
                Browser
                   │
                   ▼
          ┌─────────────────┐
          │ React / Vite    │
          └────────┬────────┘
                   │
                   │ REST API
                   ▼
          ┌─────────────────┐
          │ FastAPI         │
          │                 │
          │ Router          │
          │ Schema          │
          │ SQLAlchemy      │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ MySQL 8.0       │
          │                 │
          │ Players         │
          │ Teams           │
          │ Matches         │
          │ Statistics      │
          └─────────────────┘
```

最終的には、チームの選手情報・試合結果・成績などをDatabaseで一元管理し、FastAPIを通じてFrontendへ提供するWebシステムを構築します。
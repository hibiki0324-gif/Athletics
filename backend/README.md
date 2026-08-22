# Backend README

AthleticsプロジェクトのBackend開発に関するREADMEです。

Backendでは、FastAPIとSQLAlchemyを使用してAPIを構築し、MySQLに保存されたデータをFrontendへ提供します。

---

# Backendの役割

Backendは、FrontendとDatabaseの間に位置し、以下の役割を担当します。

```text
Frontend
   ↓
HTTP Request
   ↓
FastAPI
   ↓
SQLAlchemy
   ↓
MySQL
```

例えば選手一覧を取得する場合、

```text
React
 ↓
GET /players
 ↓
FastAPI
 ↓
SQLAlchemy
 ↓
MySQL
 ↓
選手データ
 ↓
FastAPI
 ↓
JSON Response
 ↓
React
```

という流れになります。

---

# 使用技術

| 項目 | 内容 |
| --- | --- |
| Language | Python |
| Framework | FastAPI |
| ORM | SQLAlchemy |
| Database | MySQL 8.0 |
| API Documentation | Swagger UI |
| Container | Docker |
| Web Server | Uvicorn |
| Package Management | pip |

---

# Backendディレクトリ構成

現在のBackendは以下の構成です。

```text
backend
├── app
│   └── database.py
│
├── models
│   ├── player.py
│   ├── player_position.py
│   ├── position.py
│   ├── season.py
│   ├── team.py
│   ├── match.py
│   ├── match_team.py
│   ├── match_inning.py
│   ├── match_lineup_entry.py
│   ├── match_batting_stats.py
│   ├── match_pitching_decision.py
│   └── match_batteries.py
│
├── routers
│   ├── players.py
│   ├── positions.py
│   ├── seasons.py
│   └── teams.py
│
├── schemas
│   ├── player.py
│   ├── position.py
│   ├── season.py
│   └── team.py
│
├── main.py
└── requirements.txt
```

※ 実際のファイル構成に変更があった場合は、このREADMEも更新してください。

---

# 各ディレクトリの役割

## app

Backend全体で使用する共通処理を配置します。

現在はDatabase接続処理を管理しています。

```text
backend/app/database.py
```

主に以下を担当します。

- SQLAlchemyの設定
- Database URLの生成
- Engineの作成
- Sessionの作成
- Baseクラスの定義

---

# models

Databaseのテーブル構造をSQLAlchemyのモデルとして定義します。

例えば、`players`テーブルは、

```text
backend/models/player.py
```

で管理します。

Database上のテーブルとPythonのクラスを対応させます。

```text
MySQL

players
    ↓
SQLAlchemy

Player
```

---

# 現在のModel

現在Backendでは、主に以下のModelを定義しています。

| Model | Database Table | 内容 |
| --- | --- | --- |
| Player | players | 選手 |
| Position | positions | 守備位置 |
| PlayerPosition | player_positions | 選手と守備位置の関連 |
| Season | seasons | シーズン |
| Team | teams | チーム |
| Match | matches | 試合 |
| MatchTeam | match_teams | 試合とチームの関連 |
| MatchInning | match_innings | イニング別得点 |
| MatchLineupEntry | match_lineup_entries | 試合時の出場・守備位置 |
| MatchBattingStats | match_batting_stats | 試合別打撃成績 |
| MatchPitchingDecision | match_pitching_decisions | 勝敗・セーブ等の投手記録 |
| MatchBatteries | match_batteries | 試合時のバッテリー履歴 |

---

# routers

APIのエンドポイントを定義します。

例えば選手APIの場合、

```text
backend/routers/players.py
```

で管理します。

Routerでは主に以下を担当します。

- HTTP Methodの定義
- URLの定義
- Requestの受け取り
- Schemaによる入力値の検証
- Databaseへのアクセス
- Responseの返却

---

# schemas

APIのRequest / Responseで使用するデータ形式を定義します。

例えば選手登録の場合、

```text
Request
    ↓
PlayerCreate
    ↓
FastAPI
    ↓
Database
```

という形で、APIに渡されるデータをSchemaによって検証します。

ResponseについてもSchemaを使用して、Frontendへ返却するデータ形式を管理します。

---

# main.py

FastAPIアプリケーションのエントリーポイントです。

主に以下を担当します。

- FastAPIアプリケーションの生成
- Routerの登録
- CORS設定
- ルートエンドポイント
- Backend全体のAPI設定

Backendの起動時には、

```text
main:app
```

がFastAPIアプリケーションとして使用されます。

---

# requirements.txt

Backendで使用するPythonパッケージを管理します。

主なパッケージは以下です。

```text
FastAPI
Uvicorn
SQLAlchemy
MySQL接続用ドライバ
```

環境構築時には、以下によってパッケージをインストールします。

    pip install -r requirements.txt

Docker環境ではDockerfileから自動的にインストールされます。

---

# DockerでのBackend起動

BackendはDocker Composeによって起動します。

プロジェクトルートで以下を実行します。

    docker compose up -d

Backendコンテナの状態を確認します。

    docker compose ps

Backendコンテナが起動していれば、

```text
athletics-backend
```

が表示されます。

---

# Backendのポート

Backend APIは以下のポートで公開しています。

```text
http://localhost:8000
```

---

# Backendの起動確認

以下を実行します。

    curl http://localhost:8000/

正常に起動していれば、APIからレスポンスが返ります。

例：

    {
      "message": "Athletics API is running"
    }

---

# Swagger UI

FastAPIにはSwagger UIが標準で用意されています。

以下へアクセスします。

```text
http://localhost:8000/docs
```

Swagger UIでは、

- API一覧確認
- Request Schema確認
- Response Schema確認
- API実行
- APIレスポンス確認

などを行うことができます。

Backend APIの開発・確認では、Swagger UIを積極的に利用します。

---

# OpenAPI

FastAPIではOpenAPI仕様書も自動生成されます。

以下から確認できます。

```text
http://localhost:8000/openapi.json
```

Swagger UIはこのOpenAPI定義をもとにAPIドキュメントを生成しています。

---

# 現在実装しているAPI

現在Backendでは、主に以下のAPIを実装しています。

## Players

| Method | Endpoint | 内容 |
| --- | --- | --- |
| GET | `/players` | 選手一覧取得 |
| GET | `/players/{player_id}` | 選手詳細取得 |
| POST | `/players` | 選手登録 |
| PUT | `/players/{player_id}` | 選手更新 |
| GET | `/players/{player_id}/positions` | 選手の守備位置取得 |
| PUT | `/players/{player_id}/positions` | 選手の守備位置更新 |

---

# Positions

| Method | Endpoint | 内容 |
| --- | --- | --- |
| GET | `/positions` | 守備位置一覧取得 |

---

# Seasons

| Method | Endpoint | 内容 |
| --- | --- | --- |
| GET | `/seasons` | シーズン一覧取得 |

---

# Teams

| Method | Endpoint | 内容 |
| --- | --- | --- |
| GET | `/teams` | チーム一覧取得 |

---

# Health Check

Databaseへの接続確認用APIを用意しています。

```text
GET /health/db
```

実行例：

    curl http://localhost:8000/health/db

正常にDatabaseへ接続できている場合、

    {
      "database": true
    }

のようなレスポンスが返ります。

---

# Players API

## 選手一覧取得

    curl http://localhost:8000/players

Response例：

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

---

# 選手詳細取得

    curl http://localhost:8000/players/1

指定したIDの選手情報を取得します。

---

# 選手登録

    curl -X POST http://localhost:8000/players \
      -H "Content-Type: application/json" \
      -d '{
        "name": "テスト 太郎",
        "uniform_number": 10,
        "batting_hand": "右",
        "throwing_hand": "右",
        "profile_image": null
      }'

登録に成功すると、登録された選手情報がResponseとして返されます。

---

# 選手更新

    curl -X PUT http://localhost:8000/players/1 \
      -H "Content-Type: application/json" \
      -d '{
        "name": "選手名",
        "uniform_number": 10,
        "batting_hand": "右",
        "throwing_hand": "右",
        "profile_image": null,
        "is_active": true
      }'

---

# 選手の守備位置取得

    curl http://localhost:8000/players/1/positions

選手に設定されている守備位置を取得します。

Response例：

    [
      {
        "id": 3,
        "name": "一塁手"
      }
    ]

---

# 選手の守備位置更新

    curl -X PUT http://localhost:8000/players/1/positions \
      -H "Content-Type: application/json" \
      -d '{
        "position_ids": [3, 5]
      }'

複数の守備位置を設定できます。

例えば、

```text
3 → 一塁手
5 → 三塁手
```

を指定すると、対象選手には一塁手と三塁手が設定されます。

---

# SQLAlchemyについて

Athleticsでは、DatabaseへのアクセスにSQLAlchemyを使用しています。

SQLを直接Routerへ記述するのではなく、SQLAlchemy Modelを利用してDatabaseを操作します。

基本的な構造は以下です。

```text
Router
 ↓
SQLAlchemy Session
 ↓
Model
 ↓
MySQL
```

これにより、

- Database処理の共通化
- PythonコードによるDatabase操作
- ModelとDatabaseテーブルの対応
- 型安全性の向上

などを実現します。

---

# Database Session

Database Sessionは、

```text
backend/app/database.py
```

で管理します。

APIからDatabaseへアクセスする場合は、基本的にSession Dependencyを利用します。

```text
API Request
    ↓
Session取得
    ↓
Database操作
    ↓
Session終了
```

---

# ModelとDatabaseの関係

BackendのModelは、Databaseのテーブルと対応しています。

例えば、

```text
models/player.py
        ↓
Player
        ↓
players
```

という関係になります。

Databaseの詳細なテーブル定義については、

```text
database/README.md
```

を参照してください。

---

# API開発の基本方針

新しいAPIを追加する場合は、基本的に以下の順番で実装します。

```text
1. Database設計
        ↓
2. SQLAlchemy Model
        ↓
3. Pydantic Schema
        ↓
4. Router
        ↓
5. main.pyへRouter登録
        ↓
6. Swagger UI確認
        ↓
7. API動作確認
```

---

# API追加時の基本構成

例えば試合結果APIを追加する場合、

```text
models
    ↓
match.py

schemas
    ↓
match.py

routers
    ↓
matches.py

main.py
    ↓
router登録
```

という構成を基本とします。

---

# APIの責務

Routerには、APIに必要な処理を記述します。

ただし、処理が複雑になった場合はRouterにすべてのロジックを記述せず、Service層などへ処理を分離することを検討します。

基本的な考え方は以下です。

```text
Router
    ↓
入力受付・レスポンス
    ↓
Service
    ↓
業務ロジック
    ↓
Model / Repository
    ↓
Database
```

現時点では機能規模に応じてシンプルな構成を採用します。

---

# エラーハンドリング

APIでは、処理結果に応じて適切なHTTPステータスを返します。

代表例：

| Status | 内容 |
| --- | --- |
| 200 | 正常取得・更新 |
| 201 | 新規登録成功 |
| 400 | 不正なリクエスト |
| 404 | 対象データが存在しない |
| 409 | データ重複などの競合 |
| 500 | Backend内部エラー |

例えば存在しない選手IDを指定した場合は、

```text
GET /players/999
```

404 Not Foundを返す設計とします。

---

# CORS

FrontendとBackendは異なるポートで動作します。

```text
Frontend
http://localhost:5173

Backend
http://localhost:8000
```

そのため、Backend側でCORS設定を行っています。

開発環境ではFrontendからBackend APIへアクセスできるように設定します。

---

# Backendのログ確認

Backendのログを確認する場合は、

    docker compose logs backend

最新のログを確認する場合は、

    docker compose logs backend --tail=100

リアルタイムでログを確認する場合は、

    docker compose logs -f backend

を使用します。

---

# Backendの再起動

Backendのみ再起動したい場合：

    docker compose restart backend

Dockerfileやrequirements.txtなどを変更してイメージの再ビルドが必要な場合：

    docker compose up -d --build backend

---

# Backend停止

Backendを含むDocker環境を停止する場合：

    docker compose down

Databaseのデータを保持したままコンテナを停止します。

---

# Databaseとの接続

BackendからMySQLへ接続する際の接続情報は、Docker Composeの環境変数から取得します。

現在の開発環境では、

```text
DB_HOST=db
DB_DATABASE=athletics
DB_USERNAME=athletics_user
DB_PASSWORD=secret
```

を使用しています。

BackendコンテナからDatabaseへ接続する場合、Hostは、

```text
db
```

となります。

これはDocker Compose上のMySQLサービス名です。

---

# localhostとdbの違い

BackendはDockerコンテナ内で動作しています。

そのためBackendからMySQLへ接続する場合、

```text
localhost
```

ではなく、

```text
db
```

を使用します。

構成としては、

```text
Mac
 │
 ├── localhost:8000
 │       ↓
 │   Backend Container
 │       ↓
 │      db:3306
 │       ↓
 │   MySQL Container
 │
 └── localhost:3307
         ↓
     MySQL Container
```

となります。

---

# Pythonバージョン

BackendではPythonを使用しています。

Docker環境ではPython 3.12系を使用します。

Dockerfile：

    FROM python:3.12-slim

ローカルでPythonを直接使用する場合は、プロジェクトで指定されているバージョンに合わせてください。

なお、通常のBackend開発ではDocker環境を利用することを基本とします。

---

# pyenvについて

ローカル環境でPythonのバージョンを切り替える場合はpyenvを使用できます。

例：

    pyenv shell 3.10.4

ただし、Docker環境のBackendはDockerfileで指定されたPython環境を使用します。

そのため、Backend APIの通常の動作環境としてはDockerを基準とします。

---

# Backend開発時の確認項目

APIを追加・変更した場合は、以下を確認します。

```text
□ Modelが正しく定義されている
□ Schemaが正しく定義されている
□ Routerが正しく定義されている
□ main.pyにRouterが登録されている
□ Swagger UIにAPIが表示される
□ 正常系のRequestが成功する
□ Responseが想定した形式になっている
□ Databaseへ正しくデータが保存される
□ Databaseから正しくデータが取得できる
□ エラー時に適切なHTTPステータスが返る
```

---

# API変更時の注意

APIのResponse形式を変更する場合、Frontend側にも影響する可能性があります。

例えば、

```json
{
  "id": 1,
  "name": "今村 響"
}
```

を、

```json
{
  "player_id": 1,
  "player_name": "今村 響"
}
```

のように変更すると、Frontend側の実装も変更が必要になります。

そのため、API仕様を変更する場合はFrontend担当者と事前に認識を合わせます。

---

# Database変更時の注意

Backend Modelだけを変更しても、MySQLのテーブル構造が自動的に変更されるわけではありません。

Database構造を変更する場合は、

```text
database/init.sql
```

との整合性を確認してください。

例えば新しいカラムを追加する場合、

```text
Database
    ↓
init.sql

Backend
    ↓
SQLAlchemy Model

API
    ↓
Schema
```

の整合性を確認します。

---

# Backend開発のGitフロー

Backendの機能追加・変更を行う場合も、mainへ直接コミットせずfeatureブランチを使用します。

```text
main
 ↓
git pull origin main
 ↓
featureブランチ作成
 ↓
Backend開発
 ↓
Swagger / API確認
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

# Backend開発開始

プロジェクトルートへ移動します。

    cd ~/dev/web/Athletics

mainを最新化します。

    git switch main
    git pull origin main

作業ブランチを作成します。

    git switch -c feature/backend-機能名

例：

    git switch -c feature/backend-match-api

---

# Backend開発終了

変更内容を確認します。

    git status

差分を確認します。

    git diff

Commitします。

    git add .
    git commit -m "feat: add match api"

Pushします。

    git push -u origin feature/backend-match-api

その後、GitHubでPull Requestを作成します。

---

# Commitメッセージ

Backendでは、変更内容が分かるCommitメッセージを使用します。

例：

    feat: add player api

    feat: add match api

    fix: fix player response

    fix: fix database connection

    refactor: separate player service

    docs: update backend readme

---

# Backend開発の基本方針

Backend開発では以下を意識します。

## 1. API仕様を明確にする

Frontendから何を要求され、何を返すAPIなのかを明確にします。

---

## 2. Databaseとの整合性を保つ

SQLAlchemy ModelとMySQLのテーブル構造が一致するように管理します。

---

## 3. Schemaを利用する

APIのRequest / ResponseはSchemaによって形式を明確にします。

---

## 4. Routerに処理を詰め込みすぎない

APIが複雑になった場合はServiceなどへ処理を分離します。

---

## 5. FrontendとのAPI仕様を共有する

APIのEndpoint、Method、Request、Responseを明確にし、Frontend担当者と共有します。

---

# 現在のBackend開発範囲

現在Backendでは、Frontendから利用するためのAPI基盤を構築しています。

現在実装済みの主な領域は、

```text
選手
 ↓
players

守備位置
 ↓
positions

シーズン
 ↓
seasons

チーム
 ↓
teams
```

です。

また、Database側では試合関連のModelも定義されています。

```text
matches
match_teams
match_innings
match_lineup_entries
match_batting_stats
match_pitching_decisions
match_batteries
```

今後これらの試合関連データについてもAPIを実装していきます。

---

# BackendとFrontendの連携

最終的には以下の構成を目指します。

```text
                    ┌──────────────┐
                    │   Frontend   │
                    │ React + Vite │
                    └──────┬───────┘
                           │
                           │ HTTP / JSON
                           ↓
                    ┌──────────────┐
                    │   Backend    │
                    │   FastAPI    │
                    └──────┬───────┘
                           │
                       SQLAlchemy
                           │
                           ↓
                    ┌──────────────┐
                    │   Database   │
                    │    MySQL     │
                    └──────────────┘
```

FrontendはBackend APIを利用してデータを取得・登録・更新します。

BackendはDatabaseへのアクセスを担当し、FrontendからDatabaseへ直接アクセスすることはありません。

---

# 今後のAPI開発

今後は以下のようなAPIを段階的に実装していきます。

```text
選手
├── 一覧
├── 詳細
├── 登録
├── 更新
└── 守備位置管理

試合
├── 一覧
├── 詳細
├── 登録
└── 更新

試合チーム
├── チーム登録
├── スコア管理
└── イニング管理

打撃成績
├── 試合別成績
└── シーズン成績

投手記録
└── 勝敗・セーブ

バッテリー
└── 試合中の投手・捕手履歴
```

実装するAPIについては、Frontendの画面要件とDatabase設計を確認したうえで決定します。

---

# 関連ドキュメント

プロジェクト全体の開発環境・Git運用については、プロジェクトルートのREADMEを参照してください。

```text
README.md
```

Databaseの構造やSQLについては、以下を参照してください。

```text
database/README.md
```

Frontendについては、以下を参照してください。

```text
frontend/README.md
```

---

# Backend開発の基本フロー

最終的なBackend開発フローは以下です。

```text
要件確認
 ↓
API仕様設計
 ↓
Database設計確認
 ↓
SQLAlchemy Model
 ↓
Pydantic Schema
 ↓
FastAPI Router
 ↓
main.pyへ登録
 ↓
Swagger UI確認
 ↓
API動作確認
 ↓
Frontendとの連携確認
 ↓
Commit
 ↓
Push
 ↓
Pull Request
 ↓
Review
 ↓
Merge
```

この流れを基本としてBackend APIを追加・変更していきます。
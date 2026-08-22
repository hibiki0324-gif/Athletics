# database

Athleticsプロジェクトで使用するMySQLデータベースの定義・初期データを管理するディレクトリです。

データベースのテーブル構成や初期データは、基本的に `init.sql` で管理します。

---

# 役割

`database` ディレクトリでは、主に以下を管理します。

- MySQLデータベースのテーブル定義
- 外部キー制約
- インデックス
- UNIQUE制約
- CHECK制約
- 初期マスターデータ
- 開発環境用の初期データ

現在の構成では、DockerでMySQLを起動した際に `init.sql` を使用してデータベースを初期構築します。

---

# ディレクトリ構成

```text
database
└── init.sql
```

---

# 使用DB

| 項目 | 内容 |
|---|---|
| DBMS | MySQL |
| Version | 8.0 |
| Database | athletics |
| Character Set | utf8mb4 |
| Collation | utf8mb4_unicode_ci |

---

# データベース構成

現在のデータベースには以下のテーブルがあります。

```text
players
    │
    ├── player_positions
    │       │
    │       └── positions
    │
    └── match_lineup_entries
            │
            └── positions

seasons
    │
    └── matches
            │
            ├── match_teams
            │       │
            │       ├── match_innings
            │       ├── match_lineup_entries
            │       ├── match_batting_stats
            │       └── match_batteries
            │
            └── match_pitching_decisions

teams
    │
    └── match_teams
```

---

# テーブル一覧

| テーブル | 内容 |
|---|---|
| `players` | 選手情報 |
| `positions` | 守備位置マスタ |
| `player_positions` | 選手と守備位置の紐付け |
| `seasons` | シーズン情報 |
| `teams` | チーム情報 |
| `matches` | 試合情報 |
| `match_teams` | 試合に参加するチーム情報 |
| `match_innings` | イニングごとの得点 |
| `match_lineup_entries` | 試合ごとの出場選手・守備位置履歴 |
| `match_batting_stats` | 試合ごとの打撃成績 |
| `match_pitching_decisions` | 勝敗・セーブなどの投手結果 |
| `match_batteries` | 試合中の投手・捕手の組み合わせ履歴 |

---

# 1. players

選手情報を管理するテーブルです。

## 主な用途

- 選手名
- 背番号
- 打席
- 投球
- プロフィール画像
- 現役・非現役状態

などを管理します。

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | 選手ID |
| `name` | VARCHAR(100) | NO | 選手名 |
| `uniform_number` | INT UNSIGNED | NO | 背番号 |
| `batting_hand` | VARCHAR(10) | NO | 打席 |
| `throwing_hand` | VARCHAR(10) | NO | 投球 |
| `profile_image` | VARCHAR(255) | YES | プロフィール画像 |
| `is_active` | BOOLEAN | NO | 現役状態 |
| `created_at` | DATETIME | NO | 作成日時 |
| `updated_at` | DATETIME | NO | 更新日時 |

## 制約

```text
PRIMARY KEY
    id

UNIQUE
    uniform_number
```

背番号は重複できない仕様です。

---

# 2. positions

守備位置のマスターデータを管理します。

## 初期データ

現在は以下の守備位置を登録しています。

```text
投手
捕手
一塁手
二塁手
三塁手
遊撃手
左翼手
中堅手
右翼手
```

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | 守備位置ID |
| `name` | VARCHAR(50) | NO | 守備位置名 |

## 制約

```text
PRIMARY KEY
    id

UNIQUE
    name
```

守備位置名は重複できません。

---

# 3. player_positions

選手と守備位置を紐付ける中間テーブルです。

1人の選手が複数の守備位置を担当できるため、多対多の関係を管理します。

例えば、

```text
今村 響
    ↓
一塁手
三塁手
```

のようなデータを登録できます。

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `player_id` | BIGINT UNSIGNED | NO | 選手ID |
| `position_id` | BIGINT UNSIGNED | NO | 守備位置ID |

## 主キー

```text
PRIMARY KEY
    (player_id, position_id)
```

同じ選手と守備位置の組み合わせは重複できません。

## 外部キー

```text
player_id
    ↓
players.id

position_id
    ↓
positions.id
```

選手が削除された場合、紐付いている `player_positions` も削除されます。

---

# 4. seasons

シーズン情報を管理します。

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | シーズンID |
| `year` | SMALLINT UNSIGNED | NO | 年 |
| `name` | VARCHAR(50) | NO | シーズン名 |
| `created_at` | DATETIME | NO | 作成日時 |
| `updated_at` | DATETIME | NO | 更新日時 |

## 制約

```text
PRIMARY KEY
    id

UNIQUE
    year
```

1つの年度につき1つのシーズンを管理します。

## 初期データ

現在は以下を登録しています。

```text
2026
2026年シーズン
```

---

# 5. teams

チーム情報を管理します。

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | チームID |
| `name` | VARCHAR(100) | NO | チーム名 |
| `is_active` | BOOLEAN | NO | 使用状態 |
| `created_at` | DATETIME | NO | 作成日時 |
| `updated_at` | DATETIME | NO | 更新日時 |

## 制約

```text
PRIMARY KEY
    id

UNIQUE
    name
```

## 初期データ

現在は開発用として、

```text
アスレチックス
```

を登録しています。

---

# 6. matches

試合そのものの情報を管理します。

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | 試合ID |
| `season_id` | BIGINT UNSIGNED | NO | シーズンID |
| `match_date` | DATE | NO | 試合日 |
| `start_time` | TIME | YES | 試合開始時刻 |
| `venue` | VARCHAR(255) | YES | 球場 |
| `created_at` | DATETIME | NO | 作成日時 |
| `updated_at` | DATETIME | NO | 更新日時 |

## 外部キー

```text
season_id
    ↓
seasons.id
```

シーズンに紐付いて試合を管理します。

---

# 7. match_teams

1試合に参加するチームを管理します。

試合とチームを紐付ける中間的な役割を持ちます。

例えば、

```text
試合ID: 1

ホーム
    アスレチックス

ビジター
    対戦相手
```

のような構造になります。

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | 試合チームID |
| `match_id` | BIGINT UNSIGNED | NO | 試合ID |
| `team_id` | BIGINT UNSIGNED | NO | チームID |
| `is_home` | BOOLEAN | NO | ホームかどうか |
| `final_score` | INT UNSIGNED | NO | 最終得点 |
| `created_at` | DATETIME | NO | 作成日時 |
| `updated_at` | DATETIME | NO | 更新日時 |

## 制約

1試合に同じチームを重複登録できません。

また、1試合につきホームチームは1つだけです。

```text
UNIQUE
    (match_id, team_id)

UNIQUE
    (match_id, is_home)
```

---

# 8. match_innings

試合のイニングごとの得点を管理します。

例えば、

```text
1回  0
2回  1
3回  0
4回  2
...
```

のようなデータを保持します。

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | イニングID |
| `match_team_id` | BIGINT UNSIGNED | NO | 試合チームID |
| `inning_number` | SMALLINT UNSIGNED | NO | イニング番号 |
| `runs` | INT UNSIGNED | NO | 得点 |

## 制約

```text
UNIQUE
    (match_team_id, inning_number)
```

同じチームの同じイニングを重複登録できません。

---

# 9. match_lineup_entries

試合における選手の出場履歴を管理します。

単純なスタメン情報だけではなく、

- 打順
- 守備位置
- 途中出場
- 交代
- 交代したイニング

などを管理できます。

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | 出場履歴ID |
| `match_team_id` | BIGINT UNSIGNED | NO | 試合チームID |
| `player_id` | BIGINT UNSIGNED | NO | 選手ID |
| `position_id` | BIGINT UNSIGNED | NO | 守備位置ID |
| `batting_order` | TINYINT UNSIGNED | NO | 打順 |
| `entry_sequence` | SMALLINT UNSIGNED | NO | 出場順 |
| `entry_inning` | SMALLINT UNSIGNED | NO | 出場イニング |
| `exit_inning` | SMALLINT UNSIGNED | YES | 交代イニング |
| `is_starter` | BOOLEAN | NO | スタメンかどうか |
| `created_at` | DATETIME | NO | 作成日時 |
| `updated_at` | DATETIME | NO | 更新日時 |

---

# 10. match_batting_stats

試合ごとの打撃成績を管理します。

## 管理項目

```text
打数
安打
二塁打
三塁打
本塁打
打点
四球
死球
犠打
犠飛
三振
盗塁
```

## カラム

| カラム | 内容 |
|---|---|
| `id` | 成績ID |
| `match_team_id` | 試合チームID |
| `player_id` | 選手ID |
| `at_bats` | 打数 |
| `hits` | 安打 |
| `doubles` | 二塁打 |
| `triples` | 三塁打 |
| `home_runs` | 本塁打 |
| `runs_batted_in` | 打点 |
| `walks` | 四球 |
| `hit_by_pitch` | 死球 |
| `sacrifice_bunts` | 犠打 |
| `sacrifice_flies` | 犠飛 |
| `strikeouts` | 三振 |
| `stolen_bases` | 盗塁 |

## 制約

```text
UNIQUE
    (match_team_id, player_id)
```

1試合の1チームにおいて、同じ選手の打撃成績は1件にします。

---

# 11. match_pitching_decisions

投手の勝敗・セーブなどの結果を管理します。

現時点では詳細な投球成績ではなく、試合結果における投手の決定だけを管理します。

## decision

現在使用できる値は以下です。

```text
WIN
LOSS
SAVE
```

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | ID |
| `match_id` | BIGINT UNSIGNED | NO | 試合ID |
| `player_id` | BIGINT UNSIGNED | NO | 選手ID |
| `decision` | VARCHAR(10) | NO | 勝敗・セーブ |
| `created_at` | DATETIME | NO | 作成日時 |

## 制約

```text
CHECK
    decision IN ('WIN', 'LOSS', 'SAVE')
```

また、同じ試合で同じ選手の投手結果を重複登録できません。

```text
UNIQUE
    (match_id, player_id)
```

---

# 12. match_batteries

試合中の投手・捕手の組み合わせを管理します。

投手や捕手が途中交代する可能性があるため、1試合につき複数の履歴を登録できます。

例えば、

```text
1回～5回
投手A
捕手B

6回～9回
投手C
捕手B
```

のようなデータを管理できます。

## カラム

| カラム | 型 | NULL | 内容 |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | NO | バッテリー履歴ID |
| `match_team_id` | BIGINT UNSIGNED | NO | 試合チームID |
| `pitcher_id` | BIGINT UNSIGNED | NO | 投手ID |
| `catcher_id` | BIGINT UNSIGNED | NO | 捕手ID |
| `sequence_no` | SMALLINT UNSIGNED | NO | 履歴順 |
| `entry_inning` | SMALLINT UNSIGNED | NO | 出場開始イニング |
| `exit_inning` | SMALLINT UNSIGNED | YES | 交代イニング |
| `created_at` | DATETIME | NO | 作成日時 |
| `updated_at` | DATETIME | NO | 更新日時 |

---

# テーブル間の関係

主要なテーブル間の関係は以下です。

```text
seasons
  │
  │ 1:N
  ▼
matches
  │
  │ 1:N
  ▼
match_teams
  │
  ├───────────────┐
  │               │
  │ 1:N           │ 1:N
  ▼               ▼
match_innings   match_batting_stats
                    │
                    │ N:1
                    ▼
                 players


players
  │
  │ 1:N
  ▼
player_positions
  │
  │ N:1
  ▼
positions
```

---

# 外部キーの削除ルール

外部キーには、データの整合性を保つために削除時のルールを設定しています。

## CASCADE

親データが削除された場合、関連データも削除します。

主に、

```text
players
    ↓
player_positions
```

や、

```text
matches
    ↓
match_teams
    ↓
match_innings
```

などで使用しています。

---

## RESTRICT

関連データが存在する場合、親データの削除を禁止します。

例えば、

```text
players
    ↑
match_batting_stats
```

のように試合成績が残っている選手を削除できないようにしています。

これにより、過去の試合データが参照できなくなることを防ぎます。

---

# 文字コード

Athleticsでは日本語データを扱うため、MySQLの文字コードとして `utf8mb4` を使用します。

テーブル定義では、

```sql
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci
```

を使用しています。

日本語の選手名やチーム名などを正しく保存するため、文字コードの設定を変更しないでください。

---

# init.sql

`init.sql`には、以下をまとめて定義しています。

```text
1. テーブル作成
2. 外部キー
3. インデックス
4. UNIQUE制約
5. CHECK制約
6. 初期マスターデータ
7. 開発用初期データ
```

そのため、Athleticsの開発環境では基本的に `init.sql` をデータベース構成の基準とします。

---

# init.sqlの実行タイミング

Docker Composeでは、以下のように `init.sql` をMySQLコンテナへマウントしています。

```yaml
volumes:
  - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
```

MySQL公式Dockerイメージでは、データベースが初期化される際に `/docker-entrypoint-initdb.d/` 配下のSQLが実行されます。

重要なのは、**MySQLコンテナを再起動するたびに実行されるわけではない**という点です。

既に `db_data` ボリュームが存在する場合、既存データが使用されます。

---

# DBを初期化する場合

開発環境でデータベースを完全に作り直す場合は、プロジェクトルートから以下を実行します。

```bash
docker compose down -v
```

その後、

```bash
docker compose up -d
```

を実行します。

これにより、

```text
既存コンテナ停止
        ↓
DBボリューム削除
        ↓
MySQL再作成
        ↓
init.sql実行
        ↓
初期データ登録
```

という流れになります。

---

# ⚠️ DB初期化時の注意

以下のコマンドはDBのデータを削除します。

```bash
docker compose down -v
```

開発中に登録したデータやテストデータも削除されます。

そのため、必要なデータが存在する場合は実行前に確認してください。

---

# DBの確認

Docker起動後、MySQLへ接続できます。

```bash
docker compose exec db mysql --default-character-set=utf8mb4 -u athletics_user -p athletics
```

パスワード：

```text
secret
```

---

# テーブル一覧確認

MySQLへ接続後、

```sql
SHOW TABLES;
```

を実行します。

現在は以下のテーブルが作成されます。

```text
match_batteries
match_batting_stats
match_innings
match_lineup_entries
match_pitching_decisions
match_teams
matches
player_positions
players
positions
seasons
teams
```

---

# テーブル定義確認

例えば `players` の定義を確認する場合、

```sql
SHOW CREATE TABLE players;
```

を実行します。

---

# データ確認

選手一覧：

```sql
SELECT
    id,
    name,
    uniform_number,
    batting_hand,
    throwing_hand,
    is_active
FROM players;
```

守備位置：

```sql
SELECT
    id,
    name
FROM positions;
```

シーズン：

```sql
SELECT
    id,
    year,
    name
FROM seasons;
```

チーム：

```sql
SELECT
    id,
    name,
    is_active
FROM teams;
```

---

# 開発時のDB操作について

通常のアプリケーション開発では、APIを通してデータを操作します。

基本的な流れは、

```text
React
 ↓
FastAPI
 ↓
SQLAlchemy
 ↓
MySQL
```

です。

そのため、通常の機能開発ではMySQLへ直接INSERTやUPDATEを行うのではなく、Backend APIを使用します。

---

# DBを直接操作するケース

以下のような場合は、MySQLへ直接接続して操作することがあります。

- DB構造の確認
- 開発用データの確認
- テストデータの削除
- DB障害の調査
- SQLの動作確認
- データ移行作業

ただし、アプリケーションの通常処理ではBackend APIからDBを操作します。

---

# データ変更時のルール

DB構造を変更する場合は、以下を確認してください。

```text
1. init.sqlを変更
        ↓
2. BackendのModelを確認・変更
        ↓
3. Schemaを確認・変更
        ↓
4. APIを確認・変更
        ↓
5. 必要に応じてFrontend側を変更
        ↓
6. 動作確認
```

特に、DBのカラムを追加・変更した場合は、SQLAlchemyのModelとの整合性に注意してください。

---

# DB変更時のGit管理

DB構造を変更した場合は、`database/init.sql` の変更もGitに含めます。

例：

```bash
git status
```

変更を確認します。

```bash
git diff database/init.sql
```

問題がなければ、

```bash
git add database/init.sql
```

Commit：

```bash
git commit -m "feat: update database schema"
```

Push：

```bash
git push
```

その後、Pull Requestを作成します。

---

# Backendとの関係

BackendではSQLAlchemyを使用してMySQLへアクセスします。

```text
database/init.sql
        │
        │ DB構造
        ▼
      MySQL
        ▲
        │ SQLAlchemy
        │
     FastAPI
        ▲
        │
     Frontend
```

Backend側のModelは、基本的にDBテーブルと対応します。

例えば、

```text
players
   ↕
backend/models/player.py
```

のような関係です。

---

# 現在の対応関係

| DBテーブル | Backend Model |
|---|---|
| `players` | `Player` |
| `positions` | `Position` |
| `player_positions` | `PlayerPosition` |
| `seasons` | `Season` |
| `teams` | `Team` |
| `matches` | `Match` |
| `match_teams` | `MatchTeam` |
| `match_innings` | `MatchInning` |
| `match_lineup_entries` | `MatchLineupEntry` |
| `match_batting_stats` | `MatchBattingStats` |
| `match_pitching_decisions` | `MatchPitchingDecision` |
| `match_batteries` | `MatchBattery` |

---

# 今後のDB開発

今後、以下のような機能追加に応じてDBを拡張する可能性があります。

```text
試合結果
    ↓
試合詳細
    ↓
打撃成績
    ↓
投手成績
    ↓
シーズン成績
    ↓
選手ランキング
```

DBを変更する場合は、既存データとの互換性を考慮して設計します。

---

# 開発時の基本方針

Databaseについては、以下を基本方針とします。

1. DB構造は `init.sql` を基準として管理する
2. 日本語データを扱うため `utf8mb4` を使用する
3. 外部キーでテーブル間の整合性を保つ
4. 不要な直接DB操作は避ける
5. 通常のデータ操作はBackend APIから行う
6. DB構造変更時はBackend Modelとの整合性を確認する
7. DB構造変更時は `init.sql` を更新する
8. 開発環境のDB初期化には `docker compose down -v` を使用する
9. 本番環境ではDBデータを不用意に削除しない

---

# 関連ドキュメント

プロジェクト全体の開発環境・Git運用については、プロジェクトルートのREADMEを参照してください。

```text
Athletics/
├── README.md
├── database/
│   ├── README.md
│   └── init.sql
└── backend/
    └── README.md
```

BackendのAPI・SQLAlchemy・Model・Schemaについては、`backend/README.md` を参照してください。
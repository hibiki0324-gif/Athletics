# CLAUDE.md

草野球チーム「アスレチックス」のチームHP・管理システム。
React（frontend）→ FastAPI（backend）→ SQLAlchemy → MySQL の3層構成。

詳細は各READMEが正（ここでは重複させない）:
- 全体・セットアップ・Git運用: `README.md`
- API・ORM・開発ルール: `backend/README.md`
- テーブル設計: `database/README.md`

## 構成

| ディレクトリ | 内容 |
| --- | --- |
| `frontend/` | React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7（React Compiler有効） |
| `backend/` | FastAPI + SQLAlchemy 2.x + PyMySQL（Python 3.12） |
| `database/init.sql` | テーブル定義と初期データ（スキーマの正） |
| `docker-compose.yml` | backend / db(MySQL 8.0) / phpmyadmin |

`app/`, `assets/`, `public/index.php`, `docker/php`, `docker/apache` は旧構成の名残で、現在の compose では使っていない。

## よく使うコマンド

```bash
# Backend / DB（プロジェクトルートで）
docker compose up -d
docker compose logs backend
docker compose restart backend
docker compose exec db mysql --default-character-set=utf8mb4 -u root -p athletics

# Frontend（frontend/ で）
npm run dev      # http://localhost:5173
npm run build    # tsc -b による型チェック込み
npm run lint     # oxlint
```

- API: http://localhost:8000 / Swagger: http://localhost:8000/docs
- MySQL（ホストから）: localhost:3307 / phpMyAdmin: http://localhost:8081
- Backend は Docker 内でのみ動かす想定（`--reload` 付き、`./backend` をマウント）。DB接続先ホストは `db`。
- 自動テストは未整備。動作確認は Swagger UI と画面での確認が基本。

## Backend の実装ルール

API追加は次の順で行う:
1. `database/init.sql` にテーブル定義
2. `backend/models/` に SQLAlchemy Model
3. `backend/schemas/` に Pydantic Schema
4. `backend/routers/` に Router（`APIRouter(prefix=..., tags=[...])`）
5. `backend/main.py` で `include_router` 登録（リレーション解決のため Model の import が必要な場合もここ）

- 既存 Router に倣い、`get_db()` を `Depends` で使う。
- エラーは `HTTPException` で返し、`detail` は日本語メッセージ（例: `"選手が見つかりません"`）。
- 選手の削除は論理削除（`is_active`）。
- 複雑な業務ロジックは `backend/services/` への切り出しを検討（現状は Router に直接記述）。

## DB変更時の注意

- Model を変えても MySQL のテーブルは変わらない。**`init.sql` / Model / Schema の3つを必ず揃える。**
- `init.sql` はDBボリューム初回作成時にしか実行されない。反映には `docker compose down -v` が必要だが、**ローカルDBのデータが全て消えるため、実行前に必ずユーザーに確認すること。**

## Frontend の実装ルール

- ページ: `src/pages/public/`（公開）, `src/pages/admin/`（管理画面）。ルーティングは `src/App.tsx`。
- コンポーネント: `src/components/<機能名>/`、型定義: `src/types/`。
- API呼び出しは `fetch("http://localhost:8000/...")` を各コンポーネントで直接記述している（共通クライアントなし）。
- スタイルは Tailwind のユーティリティクラス。
- APIのレスポンス形式を変える場合は `src/types/` と利用箇所も合わせて修正する。

## Git 運用

- `main` は安定版。直接コミットせず `feature/機能名` / `fix/修正内容` ブランチ → PR → マージ。
- コミットメッセージは英語で `<type>: <内容>` 形式（type: `feat` / `fix` / `refactor` / `docs` / `chore`）。例: `feat: add match api`, `docs: update backend readme`
- DB変更を含むPRでは `init.sql` の更新、API変更ではREADMEの更新要否を確認する。

# vscode-kylint

公用文に求められている表記となっているかチェックを行うVisual Studio Codeの拡張機能です。

開いたファイル及び編集中のファイルに対してルールセットに基づくLint（表記チェック）をリアルタイムで実行し、Visual Studio Codeの診断機能を用いて警告やエラーとして表示します。

## 📚 ルールについて

ルールは`rules/`ディレクトリ内のJSONファイルとして管理されています。

構造

```json
{
    "id": "1-2-e-exception",
    "message": "接続詞の４語（及び 並びに 又は 若しくは）は，原則として，漢字で書く。",
    "severity": "warning",
    "pattern": "および|ならびに|または|もしくは",
    "code": "平成22年内閣訓令第1号 別紙 1 (2) オ ただし書き",
    "codeDescription": "https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/pdf/joyokanjihyobesi_20101130.pdf"
}
```

フィールド

| フィールド名 | 説明 |
| ----------- | ---- |
| `id` | ルール識別子（ハイフン区切りの小文字英数字） |
| `message` | 表示されるメッセージ |
| `severity` | `error`/`warning`/`info`/`hint`（ルールが「原則」の場合は`warning`） |
| `pattern` | 正規表現（マッチした語句を診断） |
| `code` | ルールの記載元 |
| `codeDescription` | ルールの記載元URL |

## 🧩 実装概要

### 拡張機能のエントリポイント

`src/extension.ts`にて以下を実行：

- ルールの読み込み（`loadRules()`）
- DiagnosticCollectionの作成
- 文書オープン・変更イベントの監視
- `lintDocument()`による診断生成

### ルール読み込み

`src/rulesLoader.ts`にて`rules/`ディレクトリ内のJSONを全て読み込み、`rules`配列として返します。

### Lint 処理

`lintDocument()`では：

- 文書全体を取得
- 各ルールの正規表現でマッチング
- マッチ箇所をDiagnosticとして登録
- Problemsパネルに反映

## 🚀 開発方法

依存関係のインストール

```bash
npm install
```

パッケージ化ツールのインストール

```bash
npm install -g @vscode/vsce
```

パッケージ化

```bash
vsce package
```

## ライセンス

[MITライセンス](./LICENSE)

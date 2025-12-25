import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface Rule {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'hint';
  pattern: string;
  code: string;
  codeDescription: string;
}

export function loadRules(): Rule[] {
  const rulesDir = path.join(__dirname, '../rules');
  const files = fs.readdirSync(rulesDir);
  let rules: Rule[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(rulesDir, file), 'utf-8');
    try {
      const parsed = JSON.parse(content);
      rules = rules.concat(parsed.rules);
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
      vscode.window.showErrorMessage(`ルールファイル ${file} の読み込みに失敗しました。`);
    }
  }
  return rules;
}

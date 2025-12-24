import * as vscode from 'vscode';
import { loadRules, Rule } from './rulesLoader';

let rules: Rule[] = [];
let diagnosticCollection: vscode.DiagnosticCollection | undefined;

export function activate(context: vscode.ExtensionContext) {
  rules = loadRules();

  diagnosticCollection = vscode.languages.createDiagnosticCollection('kylint');
  context.subscriptions.push(diagnosticCollection);

  vscode.workspace.textDocuments.forEach(doc => {
    lintDocument(doc, diagnosticCollection!);
  });

  vscode.workspace.onDidOpenTextDocument(doc => {
    lintDocument(doc, diagnosticCollection!);
  });

  vscode.workspace.onDidChangeTextDocument(event => {
    lintDocument(event.document, diagnosticCollection!);
  });
}

function lintDocument(doc: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
  const diagnostics: vscode.Diagnostic[] = [];

  for (const rule of rules) {
    const regex = new RegExp(rule.pattern, 'g');
    let match;
    while ((match = regex.exec(doc.getText())) !== null) {
      const range = new vscode.Range(
        doc.positionAt(match.index),
        doc.positionAt(match.index + match[0].length)
      );

      const severity = {
        error: vscode.DiagnosticSeverity.Error,
        warning: vscode.DiagnosticSeverity.Warning,
        info: vscode.DiagnosticSeverity.Information,
        hint: vscode.DiagnosticSeverity.Hint
      }[rule.severity];

      let code: vscode.Diagnostic["code"] = rule.code;
      try {
        const uri = vscode.Uri.parse(rule.codeDescription);
        code = { value: rule.code, target: uri };
      } catch {
        code = rule.code;
      }

      const diagnostic: vscode.Diagnostic = {
        message: rule.message,
        range,
        severity,
        code
      };


      diagnostics.push(diagnostic);
    }
  }

  collection.set(doc.uri, diagnostics);
}

export function deactivate() {
  if (diagnosticCollection) {
    diagnosticCollection.dispose();
  }
}

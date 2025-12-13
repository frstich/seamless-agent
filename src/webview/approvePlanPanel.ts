import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { strings } from '../localization';

// Comment structure for feedback
export interface PlanComment {
    citation: string;
    comment: string;
}

// Result from the approve plan action
export interface ApprovePlanResult {
    approved: boolean;
    comments: PlanComment[];
}

// Message types for communication
type ToWebviewMessage =
    | { type: 'showPlan'; content: string; title: string }
    | { type: 'updateComments'; comments: PlanComment[] };

type FromWebviewMessage =
    | { type: 'approve'; comments: PlanComment[] }
    | { type: 'reject'; comments: PlanComment[] }
    | { type: 'addComment'; citation: string; comment: string }
    | { type: 'editComment'; index: number; comment: string }
    | { type: 'removeComment'; index: number };

/**
 * Webview Panel for reviewing and approving AI plans
 * Opens as a document-like panel in the center of VS Code (like GitHub Copilot Chat Editor)
 */
export class ApprovePlanPanel {
    public static readonly viewType = 'seamlessAgent.approvePlan';

    private static _panels: Map<string, ApprovePlanPanel> = new Map();

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private _comments: PlanComment[] = [];
    private _resolvePromise?: (result: ApprovePlanResult) => void;

    private constructor(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,
        content: string,
        title: string,
        resolve: (result: ApprovePlanResult) => void
    ) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._resolvePromise = resolve;

        // Set panel HTML
        this._panel.webview.html = this._getHtmlContent();

        // Listen for panel disposal
        this._panel.onDidDispose(() => this._dispose(), null, this._disposables);

        // Handle messages from webview
        this._panel.webview.onDidReceiveMessage(
            (message: FromWebviewMessage) => this._handleMessage(message),
            null,
            this._disposables
        );

        // Send initial content after a short delay to ensure webview is ready
        setTimeout(() => {
            this._panel.webview.postMessage({
                type: 'showPlan',
                content,
                title
            } as ToWebviewMessage);
        }, 100);
    }

    /**
     * Create or show an approve plan panel
     */
    public static async show(
        extensionUri: vscode.Uri,
        content: string,
        title: string = 'Review Plan'
    ): Promise<ApprovePlanResult> {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        return new Promise<ApprovePlanResult>((resolve) => {
            // Create a new panel
            const panel = vscode.window.createWebviewPanel(
                ApprovePlanPanel.viewType,
                title,
                column || vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [
                        vscode.Uri.joinPath(extensionUri, 'media'),
                        vscode.Uri.joinPath(extensionUri, 'dist'),
                        vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode', 'codicons', 'dist')
                    ]
                }
            );

            // Set icon using a file-based icon (ThemeIcon not assignable to iconPath)
            // panel.iconPath = new vscode.ThemeIcon('checklist');

            const panelId = `plan_${Date.now()}`;
            const approvePlanPanel = new ApprovePlanPanel(panel, extensionUri, content, title, resolve);
            ApprovePlanPanel._panels.set(panelId, approvePlanPanel);

            // Clean up when panel is closed
            panel.onDidDispose(() => {
                ApprovePlanPanel._panels.delete(panelId);
            });
        });
    }

    private _handleMessage(message: FromWebviewMessage): void {
        switch (message.type) {
            case 'approve':
                this._resolve({ approved: true, comments: message.comments });
                break;
            case 'reject':
                this._resolve({ approved: false, comments: message.comments });
                break;
            case 'addComment':
                this._comments.push({
                    citation: message.citation,
                    comment: message.comment
                });
                this._updateComments();
                break;
            case 'editComment':
                if (message.index >= 0 && message.index < this._comments.length) {
                    this._comments[message.index].comment = message.comment;
                    this._updateComments();
                }
                break;
            case 'removeComment':
                if (message.index >= 0 && message.index < this._comments.length) {
                    this._comments.splice(message.index, 1);
                    this._updateComments();
                }
                break;
        }
    }

    private _updateComments(): void {
        this._panel.webview.postMessage({
            type: 'updateComments',
            comments: this._comments
        } as ToWebviewMessage);
    }

    private _resolve(result: ApprovePlanResult): void {
        if (this._resolvePromise) {
            this._resolvePromise(result);
            this._resolvePromise = undefined;
        }
        this._panel.dispose();
    }

    private _dispose(): void {
        // If panel is disposed without approval/rejection, treat as rejection
        if (this._resolvePromise) {
            this._resolvePromise({ approved: false, comments: this._comments });
            this._resolvePromise = undefined;
        }

        // Clean up disposables
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getHtmlContent(): string {
        const webview = this._panel.webview;

        // Get URIs for resources
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'approvePlan.css')
        );
        const highlightStyleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'highlight.css')
        );
        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode', 'codicons', 'dist', 'codicon.css')
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'dist', 'approvePlan.js')
        );

        // Generate nonce for CSP
        const nonce = this._getNonce();

        // Read template file
        const templatePath = path.join(this._extensionUri.fsPath, 'media', 'approvePlan.html');
        let template = fs.readFileSync(templatePath, 'utf8');

        // Replace placeholders
        const replacements: Record<string, string> = {
            '{{cspSource}}': webview.cspSource,
            '{{nonce}}': nonce,
            '{{styleUri}}': styleUri.toString(),
            '{{highlightStyleUri}}': highlightStyleUri.toString(),
            '{{codiconsUri}}': codiconsUri.toString(),
            '{{scriptUri}}': scriptUri.toString(),
            '{{approve}}': strings.approvePlanApprove || 'Approve',
            '{{reject}}': strings.approvePlanReject || 'Request Changes',
            '{{addComment}}': strings.approvePlanAddCommentAction || 'Add Comment',
            '{{editComment}}': strings.approvePlanEditComment || 'Edit',
            '{{removeComment}}': strings.approvePlanRemoveComment || 'Remove',
            '{{commentPlaceholder}}': strings.approvePlanCommentPlaceholder || 'Enter your feedback...',
            '{{save}}': strings.approvePlanSave || 'Save',
            '{{cancel}}': strings.approvePlanCancel || 'Cancel',
            '{{comments}}': strings.approvePlanComments || 'Comments',
            '{{noComments}}': strings.approvePlanNoComments || 'No comments yet. Hover over a line to add feedback.',
            '{{paneTitle}}': strings.approvePlanPanelTitle || 'Review Plan'
        };

        for (const [placeholder, value] of Object.entries(replacements)) {
            template = template.split(placeholder).join(value);
        }

        return template;
    }

    private _getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}

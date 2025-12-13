// Approve Plan Webview Script
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';

// Register only the languages we need
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import csharp from 'highlight.js/lib/languages/csharp';
import java from 'highlight.js/lib/languages/java';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('cs', csharp);
hljs.registerLanguage('java', java);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sql', sql);

// Configure markdown-it with highlight.js
const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight: function (str: string, lang: string): string {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
            } catch (_) {
                // Fall through
            }
        }
        try {
            return hljs.highlightAuto(str).value;
        } catch (_) {
            // Fall through
        }
        return '';
    }
});

// Types
interface PlanComment {
    citation: string;
    comment: string;
}

// Strings interface specific to approvePlan webview
interface ApprovePlanStrings {
    addComment: string;
    editComment: string;
    removeComment: string;
    noComments: string;
}

declare global {
    interface Window {
        __APPROVE_PLAN_STRINGS__: ApprovePlanStrings;
    }
}

// Webview initialization
(function () {
    const vscode = acquireVsCodeApi();

    // State
    let comments: PlanComment[] = [];
    let currentCitation: string = '';
    let editingIndex: number = -1;

    // DOM Elements
    const planTitle = document.getElementById('plan-title') as HTMLHeadingElement;
    const planContent = document.getElementById('plan-content') as HTMLDivElement;
    const commentsList = document.getElementById('comments-list') as HTMLDivElement;
    const commentDialog = document.getElementById('comment-dialog') as HTMLDivElement;
    const dialogTitle = document.getElementById('dialog-title') as HTMLHeadingElement;
    const citationPreview = document.getElementById('citation-preview') as HTMLDivElement;
    const commentInput = document.getElementById('comment-input') as HTMLTextAreaElement;
    const approveBtn = document.getElementById('approve-btn') as HTMLButtonElement;
    const rejectBtn = document.getElementById('reject-btn') as HTMLButtonElement;
    const dialogSave = document.getElementById('dialog-save') as HTMLButtonElement;
    const dialogCancel = document.getElementById('dialog-cancel') as HTMLButtonElement;
    const dialogClose = document.getElementById('dialog-close') as HTMLButtonElement;

    /**
     * Render markdown content with hoverable lines
     */
    function renderPlanContent(content: string): void {
        // Parse markdown to HTML
        const html = md.render(content);

        // Create a temporary container to process the HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Wrap each block element with a line-wrapper for hover functionality
        const processedHtml = wrapBlockElements(temp);
        planContent.innerHTML = processedHtml;

        // Bind click events to add-comment buttons
        bindCommentButtons();
    }

    /**
     * Wrap block elements with hoverable line wrappers
     */
    function wrapBlockElements(container: HTMLElement): string {
        const result: string[] = [];

        container.childNodes.forEach((node, index) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                const tagName = element.tagName.toLowerCase();

                // Get a meaningful citation from the content
                const citation = extractCitation(element);
                const escapedCitation = escapeAttr(citation);

                // Wrap the element
                result.push(`
                    <div class="line-wrapper" data-citation="${escapedCitation}" data-index="${index}">
                        ${element.outerHTML}
                        <button class="add-comment-btn" data-citation="${escapedCitation}" title="${window.__APPROVE_PLAN_STRINGS__?.addComment || 'Add Comment'}">
                            <span class="codicon codicon-comment"></span>
                        </button>
                    </div>
                `);
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                result.push(node.textContent);
            }
        });

        return result.join('');
    }

    /**
     * Extract a meaningful citation from an element
     */
    function extractCitation(element: HTMLElement): string {
        const tagName = element.tagName.toLowerCase();
        const text = element.textContent?.trim() || '';

        // For headings, use the full text
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
            const level = tagName.charAt(1);
            const hashes = '#'.repeat(parseInt(level));
            return `${hashes} ${text}`;
        }

        // For other elements, truncate if too long
        if (text.length > 100) {
            return text.substring(0, 100) + '...';
        }

        return text || `[${tagName}]`;
    }

    /**
     * Bind click events to add-comment buttons
     */
    function bindCommentButtons(): void {
        planContent.querySelectorAll('.add-comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const citation = (btn as HTMLElement).getAttribute('data-citation') || '';
                openCommentDialog(citation);
            });
        });
    }

    /**
     * Open the comment dialog
     */
    function openCommentDialog(citation: string, editIndex: number = -1): void {
        currentCitation = citation;
        editingIndex = editIndex;

        citationPreview.textContent = citation;

        if (editIndex >= 0 && comments[editIndex]) {
            dialogTitle.textContent = window.__APPROVE_PLAN_STRINGS__?.editComment || 'Edit Comment';
            commentInput.value = comments[editIndex].comment;
        } else {
            dialogTitle.textContent = window.__APPROVE_PLAN_STRINGS__?.addComment || 'Add Comment';
            commentInput.value = '';
        }

        commentDialog.classList.remove('hidden');
        commentInput.focus();
    }

    /**
     * Close the comment dialog
     */
    function closeCommentDialog(): void {
        commentDialog.classList.add('hidden');
        commentInput.value = '';
        currentCitation = '';
        editingIndex = -1;
    }

    /**
     * Save the current comment
     */
    function saveComment(): void {
        const comment = commentInput.value.trim();
        if (!comment) {
            closeCommentDialog();
            return;
        }

        if (editingIndex >= 0) {
            // Edit existing comment
            vscode.postMessage({
                type: 'editComment',
                index: editingIndex,
                comment: comment
            });
        } else {
            // Add new comment
            vscode.postMessage({
                type: 'addComment',
                citation: currentCitation,
                comment: comment
            });
        }

        closeCommentDialog();
    }

    /**
     * Render the comments list
     */
    function renderComments(): void {
        if (comments.length === 0) {
            commentsList.innerHTML = `<p class="no-comments">${window.__APPROVE_PLAN_STRINGS__?.noComments || 'No comments yet. Hover over a line to add feedback.'}</p>`;
            return;
        }

        commentsList.innerHTML = comments.map((c, index) => `
            <div class="comment-card" data-index="${index}">
                <div class="comment-citation">${escapeHtml(c.citation)}</div>
                <div class="comment-text">${escapeHtml(c.comment)}</div>
                <div class="comment-actions">
                    <button class="edit-btn" data-index="${index}">
                        <span class="codicon codicon-edit"></span>
                        ${window.__APPROVE_PLAN_STRINGS__?.editComment || 'Edit'}
                    </button>
                    <button class="remove-btn" data-index="${index}">
                        <span class="codicon codicon-trash"></span>
                        ${window.__APPROVE_PLAN_STRINGS__?.removeComment || 'Remove'}
                    </button>
                </div>
            </div>
        `).join('');

        // Bind edit/remove buttons
        commentsList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt((btn as HTMLElement).getAttribute('data-index') || '-1');
                if (index >= 0 && comments[index]) {
                    openCommentDialog(comments[index].citation, index);
                }
            });
        });

        commentsList.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt((btn as HTMLElement).getAttribute('data-index') || '-1');
                if (index >= 0) {
                    vscode.postMessage({
                        type: 'removeComment',
                        index: index
                    });
                }
            });
        });

        // Update line wrappers with comment indicators
        updateLineWrapperHighlights();
    }

    /**
     * Highlight lines that have comments
     */
    function updateLineWrapperHighlights(): void {
        // Remove all existing highlights
        planContent.querySelectorAll('.line-wrapper').forEach(wrapper => {
            wrapper.classList.remove('has-comment');
        });

        // Add highlights for lines with comments
        comments.forEach(comment => {
            const citation = comment.citation;
            planContent.querySelectorAll('.line-wrapper').forEach(wrapper => {
                if ((wrapper as HTMLElement).getAttribute('data-citation') === citation) {
                    wrapper.classList.add('has-comment');
                }
            });
        });
    }

    // Utility functions
    function escapeHtml(str: string): string {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str: string): string {
        return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // Event Listeners
    approveBtn?.addEventListener('click', () => {
        vscode.postMessage({ type: 'approve', comments });
    });

    rejectBtn?.addEventListener('click', () => {
        vscode.postMessage({ type: 'reject', comments });
    });

    dialogSave?.addEventListener('click', saveComment);
    dialogCancel?.addEventListener('click', closeCommentDialog);
    dialogClose?.addEventListener('click', closeCommentDialog);

    // Close dialog on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !commentDialog.classList.contains('hidden')) {
            closeCommentDialog();
        }
    });

    // Save on Enter (Ctrl+Enter for new line)
    commentInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            saveComment();
        }
    });

    // Listen for messages from the Extension Host
    window.addEventListener('message', (event: MessageEvent) => {
        const message = event.data;

        switch (message.type) {
            case 'showPlan':
                if (message.title) {
                    planTitle.textContent = message.title;
                }
                renderPlanContent(message.content);
                break;

            case 'updateComments':
                comments = message.comments || [];
                renderComments();
                break;
        }
    });
})();

// Type declaration for VS Code API
declare function acquireVsCodeApi(): {
    postMessage(message: unknown): void;
    getState(): unknown;
    setState(state: unknown): void;
};

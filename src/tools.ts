import * as vscode from 'vscode';
import { l10n } from './localization';


interface Input {
    question: string;
    title?: string;
}

/**
 * Registers the native VS Code LM Tools
 */


export function registerNativeTools(context: vscode.ExtensionContext) {

    // Register the tool defined in package.json
    const confirmationTool = vscode.lm.registerTool('ask_user', {
        async invoke(options: vscode.LanguageModelToolInvocationOptions<Input>, token: vscode.CancellationToken) {

            // 1. Parse parameters
            const params = options.input
            const question = params.question;
            const title = params.title || 'Confirmation Required';

            // 2. Execute Logic (Ask the user)
            const result = await askViaVSCode(question, title);

            // 3. Return result to the AI
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify({
                        responded: result.responded,
                        response: result.response
                    })
                )
            ]);
        }
    });

    context.subscriptions.push(confirmationTool);
}

/**
 * Shows a visible warning notification, then opens the input box
 */
async function askViaVSCode(question: string, title: string): Promise<{ responded: boolean; response: string }> {
    const buttonText = l10n.respond;

    // Use showWarningMessage which is more prominent and stays visible
    // Also focus the VS Code window to ensure user sees it
    await vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');

    const selection = await vscode.window.showWarningMessage(
        `${l10n.confirmationRequired}: ${question}`,
        { modal: false },
        buttonText
    );

    // If user dismissed notification
    if (selection !== buttonText) {
        return { responded: false, response: '' };
    }

    // Show Input Box
    const response = await vscode.window.showInputBox({
        title: title,
        prompt: question,
        placeHolder: l10n.inputPlaceholder,
        ignoreFocusOut: true
    });

    if (response === undefined) {
        return { responded: false, response: '' };
    }

    return { responded: response.trim().length > 0, response };
}
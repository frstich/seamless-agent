import * as vscode from 'vscode';

// Load localized strings
const bundle = JSON.parse(
    JSON.stringify(require('../package.nls.json'))
);

try {
    const locale = vscode.env.language;
    if (locale && locale !== 'en') {
        const localizedBundle = require(`../package.nls.${locale}.json`);
        Object.assign(bundle, localizedBundle);
    }
} catch { }

export function localize(key: string, ...args: (string | number)[]): string {
    let message = bundle[key] || key;
    args.forEach((arg, index) => {
        message = message.replace(`{${index}}`, String(arg));
    });
    return message;
}

export const l10n = {
    get confirmationRequired() { return localize('notification.confirmationRequired'); },
    get respond() { return localize('button.respond'); },
    get inputPlaceholder() { return localize('input.placeholder'); },
};
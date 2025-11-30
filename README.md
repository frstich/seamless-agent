# Seamless Agent

[![Português](https://img.shields.io/badge/lang-pt--BR-green)](README.pt-br.md)

Seamless Agent enhances GitHub Copilot by providing interactive user confirmation tools. It allows AI agents to ask for user approval before executing actions, ensuring you stay in control.

![VS Code](https://img.shields.io/badge/VS%20Code-1.106.1+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Ask User Tool (`#askUser`)

A Language Model tool that enables Copilot to interactively prompt you for confirmation or additional input during chat sessions.

- **User Confirmation** — Get explicit approval before Copilot executes critical actions
- **Interactive Input** — Provide additional context or instructions mid-conversation
- **Task Validation** — Confirm whether a task was fulfilled your specs
- **Seamless Integration** — Works naturally within the Copilot Chat workflow

## Usage

Once installed, the `ask_user` tool is automatically available to GitHub Copilot Chat.

### Automatic Usage

Copilot will automatically use this tool when it needs your confirmation. When triggered:

1. A notification appears in VS Code
2. Click "Respond" to open the input dialog
3. Type your response
4. Copilot continues based on your input

## Tips

### Recommended System Prompt

To ensure the AI always asks for your confirmation before completing tasks, add the following to your custom instructions or system prompt:

```
Always use the ask_user tool before completing any task to confirm with the user that the request was fulfilled correctly.
```

You can add this in VS Code by going to:
- **Settings** → Search for `github.copilot.chat.codeGeneration.instructions`
- Or add to your `.github/copilot-instructions.md` file in your project

## Requirements

- VS Code 1.106.1 or higher
- GitHub Copilot Chat extension

## Extension Settings

This extension works out of the box with no configuration required.

## Known Issues

None at this time. Please report issues on [GitHub](https://github.com/jraylan/seamless-agent/issues).

## Release Notes

### 0.0.2-beta-1

- Initial beta release
- Added `ask_user` Language Model tool
- Multi-language support (English, Portuguese)

## License

[MIT](LICENSE.md)

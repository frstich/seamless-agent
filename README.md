# Seamless Agent

![English](https://img.shields.io/badge/lang-en-blue) [![Português do Brasil](https://img.shields.io/badge/lang-pt--BR-green)](README.pt-br.md) [![Português](https://img.shields.io/badge/lang-pt-green)](README.pt-pt.md)

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
- **Paste Images** — Paste images directly into the input area for context
- **References & Attachments** — Reference files in your workspace using `#filename` and attach files to your response

### Approve Plan Tool (`#approvePlan`)

A Language Model tool that presents a multi-step plan in a dedicated review panel, so you can approve it or request changes with comments anchored to specific parts of the plan.

- **Plan Review Panel** — Review the plan in a focused editor-like view
- **Targeted Feedback** — Add comments tied to specific headings/paragraphs/list items
- **Structured Output** — Returns `{ approved, comments: [{ citation, comment }] }` to the agent
- **Safer Automation** — Prevents execution before you approve the approach

## Usage

Once installed, the `ask_user` and `approve_plan` tools are automatically available to GitHub Copilot Chat.

### Automatic Usage

Copilot will automatically use this tool when it needs your confirmation. When triggered:

1. A notification appears in VS Code
2. Click "Open Console" to open the request panel
3. Type your response
4. Copilot continues based on your input

### Reviewing a Plan with `approve_plan`

Copilot will use this tool when it wants your sign-off on a plan before proceeding. When triggered:

1. A “Review Plan” editor panel opens
2. Hover a heading/paragraph/list item and click the comment icon to add feedback
3. Click **Approve** to proceed, or **Request Changes** to send feedback back to the agent
4. Copilot continues based on `{ approved, comments }`

## Tips

### Recommended System Prompt

To ensure the AI requests approval at the right times, add the following to your custom instructions or system prompt:

```
When the task requires multiple steps or non-trivial changes, present a detailed plan using #approvePlan and wait for approval before executing.
If the plan is rejected, incorporate the comments and submit an updated plan with #approvePlan.
Always use #askUser before completing any task to confirm the result matches what the user asked for.
```

You can add this into your `.github/copilot-instructions.md` file in your project

### Quick tutorial: using `approve_plan`

If you want to explicitly trigger plan review from the start, ask Copilot something like:

```
Before you change anything, write a step-by-step plan and present it with #approvePlan.
Wait for my approval (or requested changes). Only then implement the plan.
```

## Requirements

- VS Code 1.104.1 or higher
- GitHub Copilot Chat extension

## Extension Settings

This extension works out of the box with no configuration required. You only need to instruct your agent to use it.

## Known Issues

None at this time. Please report issues on [GitHub](https://github.com/jraylan/seamless-agent/issues).

## License

[MIT](LICENSE.md)

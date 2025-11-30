# Seamless Agent

[![English](https://img.shields.io/badge/lang-en-blue)](README.md)

Seamless Agent aprimora o GitHub Copilot fornecendo ferramentas interativas de confirmação do usuário. Permite que agentes de IA solicitem aprovação antes de executar ações, garantindo que você mantenha o controle.

![VS Code](https://img.shields.io/badge/VS%20Code-1.106.1+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Funcionalidades

### Ferramenta Ask User (`#askUser`)

Uma ferramenta de Language Model que permite ao Copilot solicitar confirmação ou informações adicionais durante sessões de chat.

- **Confirmação do Usuário** — Obtenha aprovação explícita antes do Copilot executar ações críticas
- **Input Interativo** — Forneça contexto adicional ou instruções durante a conversa
- **Validação de Tarefas** — Confirme se uma tarefa foi concluída conforme suas especificações
- **Integração Seamless** — Funciona naturalmente dentro do fluxo do Copilot Chat

## Como Usar

Após a instalação, a ferramenta `ask_user` está automaticamente disponível para o GitHub Copilot Chat.

### Uso Automático

O Copilot usará automaticamente esta ferramenta quando precisar da sua confirmação. Quando acionada:

1. Uma notificação aparece no VS Code
2. Clique em "Responder" para abrir o diálogo de input
3. Digite sua resposta
4. O Copilot continua baseado na sua resposta

## Dicas

### Prompt de Sistema Recomendado

Para garantir que a IA sempre peça sua confirmação antes de concluir tarefas, adicione o seguinte às suas instruções personalizadas ou prompt de sistema:

```
Sempre use a ferramenta ask_user antes de concluir qualquer tarefa para confirmar com o usuário que a solicitação foi atendida corretamente.
```

Você pode adicionar isso no VS Code indo em:
- **Configurações** → Pesquise por `github.copilot.chat.codeGeneration.instructions`
- Ou adicione ao arquivo `.github/copilot-instructions.md` no seu projeto

## Requisitos

- VS Code 1.106.1 ou superior
- Extensão GitHub Copilot Chat

## Configurações

Esta extensão funciona imediatamente sem necessidade de configuração.

## Problemas Conhecidos

Nenhum até o momento. Por favor, reporte problemas no [GitHub](https://github.com/jraylan/seamless-agent/issues).

## Notas de Versão

### 0.0.3

- Lançamento beta inicial
- Adicionada ferramenta `ask_user` para Language Model
- Suporte multi-idioma (Inglês, Português)

## Licença

[MIT](LICENSE.md)

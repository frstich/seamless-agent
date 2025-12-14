# Seamless Agent

![Português do Brasil](https://img.shields.io/badge/lang-pt--BR-blue) [![English](https://img.shields.io/badge/lang-en-green)](README.md) [![Português Europeu](https://img.shields.io/badge/lang-pt--PT-green)](README.pt-pt.md)

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

### Ferramenta Approve Plan (`#approvePlan`)

Uma ferramenta de Language Model que apresenta um plano em um painel dedicado de revisão, para você aprovar ou pedir mudanças com comentários vinculados a partes específicas do plano.

- **Revisão de Plano** — Painel focado para ler o plano com calma
- **Feedback Direcionado** — Comente em títulos/parágrafos/itens de lista específicos
- **Retorno Estruturado** — Retorna `{ approved, comments: [{ citation, comment }] }` para o agente
- **Mais Segurança** — Evita execução antes da sua aprovação

## Como Usar

Após a instalação, as ferramentas `ask_user` e `approve_plan` estão automaticamente disponíveis para o GitHub Copilot Chat.

### Uso Automático

O Copilot usará automaticamente esta ferramenta quando precisar da sua confirmação. Quando acionada:

1. Uma notificação aparece no VS Code
2. Clique em "Responder" para abrir o diálogo de input
3. Digite sua resposta
4. O Copilot continua baseado na sua resposta

### Revisando um plano com `approve_plan`

O Copilot usará esta ferramenta quando quiser sua aprovação em um plano antes de prosseguir. Quando acionada:

1. Um painel “Review Plan” (Revisar Plano) abre no editor
2. Passe o mouse sobre um título/parágrafo/item de lista e clique no ícone de comentário para adicionar feedback
3. Clique em **Approve** para seguir, ou **Request Changes** para pedir ajustes
4. O Copilot continua com base em `{ approved, comments }`

## Dicas

### Prompt de Sistema Recomendado

Para garantir que a IA peça aprovação nos momentos certos, adicione o seguinte às suas instruções personalizadas ou prompt de sistema:

```
Quando a tarefa exigir múltiplos passos ou mudanças não triviais, apresente um plano detalhado usando #approvePlan e aguarde aprovação antes de executar.
Se o plano for rejeitado, incorpore os comentários e envie um plano atualizado com #approvePlan.
Sempre use #askUser antes de concluir qualquer tarefa para confirmar com o usuário que a solicitação foi atendida corretamente.
```

Você pode adicionar isso ao arquivo `.github/copilot-instructions.md` do seu projeto

### Tutorial rápido: usando `approve_plan`

Se você quiser forçar a revisão do plano desde o começo, peça algo como:

```
Antes de mudar qualquer coisa, escreva um plano passo a passo e apresente com #approvePlan.
Aguarde minha aprovação (ou pedidos de ajuste). Só então implemente o plano.
```

## Requisitos

- VS Code 1.106.1 ou superior
- Extensão GitHub Copilot Chat

## Configurações

Esta extensão funciona imediatamente sem necessidade de configuração.

## Problemas Conhecidos

Nenhum até o momento. Por favor, reporte problemas no [GitHub](https://github.com/jraylan/seamless-agent/issues).

## Licença

[MIT](LICENSE.md)

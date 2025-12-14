# Seamless Agent

[![English](https://img.shields.io/badge/lang-en-green)](README.md) [![Português Brasileiro](https://img.shields.io/badge/lang-pt--BR-green)](README.pt-br.md) ![Português Europeu](https://img.shields.io/badge/lang-pt--PT-blue)

Seamless Agent aprimora o GitHub Copilot fornecendo ferramentas interativas de confirmação do utilizador. Permite que agentes de IA solicitem aprovação antes de executar ações, garantindo que mantenha o controlo.

![VS Code](https://img.shields.io/badge/VS%20Code-1.106.1+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Funcionalidades

### Ferramenta Ask User (`#askUser`)

Uma ferramenta de Language Model que permite ao Copilot solicitar confirmação ou informações adicionais durante sessões de chat.

- **Confirmação do Utilizador** — Obtenha aprovação explícita antes do Copilot executar ações críticas
- **Input Interativo** — Forneça contexto adicional ou instruções durante a conversa
- **Validação de Tarefas** — Confirme se uma tarefa foi concluída conforme as suas especificações
- **Integração Seamless** — Funciona naturalmente dentro do fluxo do Copilot Chat

### Ferramenta Approve Plan (`#approvePlan`)

Uma ferramenta de Language Model que apresenta um plano num painel dedicado de revisão, para poder aprovar ou pedir alterações com comentários associados a partes específicas do plano.

- **Revisão do Plano** — Painel focado para analisar o plano
- **Feedback Direcionado** — Comentários em títulos/parágrafos/itens de lista específicos
- **Retorno Estruturado** — Devolve `{ approved, comments: [{ citation, comment }] }` ao agente
- **Mais Segurança** — Evita execução antes da sua aprovação

## Como Usar

Após a instalação, as ferramentas `ask_user` e `approve_plan` estão automaticamente disponíveis para o GitHub Copilot Chat.

### Uso Automático

O Copilot usará automaticamente esta ferramenta quando precisar da sua confirmação. Quando acionada:

1. Uma notificação aparece no VS Code
2. Clique em "Responder" para abrir a caixa de diálogo de input
3. Escreva a sua resposta
4. O Copilot continua baseado na sua resposta

### Rever um plano com `approve_plan`

O Copilot usará esta ferramenta quando precisar da sua aprovação sobre um plano antes de avançar. Quando acionada:

1. Abre um painel “Review Plan” (Rever Plano) no editor
2. Passe o rato sobre um título/parágrafo/item de lista e clique no ícone de comentário para adicionar feedback
3. Clique em **Approve** para continuar, ou **Request Changes** para pedir ajustes
4. O Copilot continua com base em `{ approved, comments }`

## Dicas

### Prompt de Sistema Recomendado

Para garantir que a IA peça aprovação nos momentos certos, adicione o seguinte às suas instruções personalizadas ou prompt de sistema:

```
Quando a tarefa exigir múltiplos passos ou alterações não triviais, apresente um plano detalhado usando #approvePlan e aguarde aprovação antes de executar.
Se o plano for rejeitado, incorpore os comentários e submeta um plano atualizado com #approvePlan.
Utilize sempre #askUser antes de concluir qualquer tarefa para confirmar com o utilizador que o pedido foi atendido corretamente.
```

Pode adicionar isto ao ficheiro `.github/copilot-instructions.md` no seu projeto

### Tutorial rápido: usar `approve_plan`

Se quiser forçar a revisão do plano desde o início, peça algo como:

```
Antes de mudar qualquer coisa, escreva um plano passo a passo e apresente com #approvePlan.
Aguarde a minha aprovação (ou pedidos de ajuste). Só depois implemente o plano.
```

## Requisitos

- VS Code 1.104.1 ou superior
- Extensão GitHub Copilot Chat

## Definições

Esta extensão funciona imediatamente sem necessidade de configuração.

## Problemas Conhecidos

Nenhum até ao momento. Por favor, reporte problemas no [GitHub](https://github.com/jraylan/seamless-agent/issues).

## Licença

[MIT](LICENSE.md)

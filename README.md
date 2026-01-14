# 🤖 Chatbot de Suporte de TI - WhatsApp

Este é um chatbot automatizado para WhatsApp desenvolvido em Node.js utilizando a biblioteca `whatsapp-web.js`. O bot foi projetado para gerenciar fluxos de atendimento de suporte técnico, permitindo que usuários registrem chamados de forma organizada.

## 🚀 Funcionalidades

- **Sistema de Estados:** O bot identifica em qual etapa da conversa o usuário está (Menu, Seleção de Opção ou Descrição).
- **Menu Interativo:** Opções numeradas para facilitar a escolha do usuário.
- **Simulação Humana:** Utiliza funções de "delay" e status de "digitando..." para uma experiência mais natural.
- **Registro de Chamados:** Captura o tipo de problema e a descrição enviada pelo usuário, exibindo o resumo no terminal.
- **Segurança de Sessão:** Utiliza `LocalAuth` para manter o bot conectado mesmo após reiniciar o serviço.

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [whatsapp-web.js](https://wwebjs.dev/)
- [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal) (para autenticação via QR Code)

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- Node.js (versão 16 ou superior)
- npm (gerenciador de pacotes do Node)

## 🔧 Instalação e Uso

1. **Clone o repositório:**
   git clone [https://github.com/KaykyDS/chatbot.git](https://github.com/KaykyDS/chatbot.git)

2. Entre na pasta do projeto:
   cd chatbot

3. Instale as dependências:
   npm install
   Inicie o bot: 

4. Inicie o bot:
   node chatbot.js
   Autenticação: Escaneie o QR Code que aparecerá no terminal com o seu WhatsApp (Aparelhos Conectados).

📂 Estrutura do Fluxo
Início: O bot responde a saudações (Oi, Olá, Menu).

Seleção: O usuário escolhe entre Computador, Internet, Impressora ou Equipamentos.

Descrição: O usuário detalha o problema.

Finalização: O bot confirma o registro e limpa o estado do usuário para um novo atendimento.

🛡️ Segurança
Este projeto utiliza um arquivo .gitignore para garantir que pastas sensíveis como node_modules/ e .wwebjs_auth/ (que contém sua sessão do WhatsApp) não sejam enviadas para o repositório público.
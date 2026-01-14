// IMPORTAÇÕES
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

// CONFIGURAÇÃO DO CLIENTE
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
    ],
  },
});

// CONTROLE DE ESTADOS DOS USUÁRIOS
const estados = {};

// QR CODE
client.on("qr", (qr) => {
  console.log("📲 Escaneie o QR Code abaixo:");
  qrcode.generate(qr, { small: true });
});

// WHATSAPP CONECTADO
client.on("ready", () => {
  console.log("✅ Tudo certo! WhatsApp conectado.");
});

// DESCONEXÃO
client.on("disconnected", (reason) => {
  console.log("⚠️ Desconectado:", reason);
});

// INICIALIZA
client.initialize();

// FUNÇÃO DE DELAY
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// FUNIL DE MENSAGENS (SOMENTE PRIVADO)
client.on("message", async (msg) => {
  try {
    // ❌ IGNORA GRUPOS
    if (!msg.from || msg.from.endsWith("@g.us")) return;

    const chat = await msg.getChat();
    if (chat.isGroup) return;

    const texto = msg.body ? msg.body.trim().toLowerCase() : "";

    // Simulação de digitação
    const typing = async () => {
      await delay(1500);
      await chat.sendStateTyping();
      await delay(1500);
    };

    // INÍCIO / MENU
    if (!estados[msg.from] && /^(menu|oi|olá|ola|Olá|Bom dia|bom dia|Boa tarde|boa tarde|Boa noite|boa noite|Oi,tudo bem?|Olá,tudo bem?|Oi, tudo bem?|Olá, tudo bem?)$/i.test(texto)) {
      estados[msg.from] = { etapa: "menu" };

      await typing();
      await client.sendMessage(
        msg.from,
        `Olá! 👋 Sou o *Chatbot de Suporte de TI*.\n\n` +
        `Selecione uma opção:\n` +
        `1️⃣ Problema com computador\n` +
        `2️⃣ Internet / Rede\n` +
        `3️⃣ Impressora / Periféricos\n` +
        `4️⃣ Solicitação de equipamento`
      );
      return;
    }

    // CAPTURA DA OPÇÃO
    if (estados[msg.from]?.etapa === "menu") {
      let tipo = "";

      if (texto === "1") tipo = "Problema com computador";
      else if (texto === "2") tipo = "Internet / Rede";
      else if (texto === "3") tipo = "Impressora / Periféricos";
      else if (texto === "4") tipo = "Solicitação de equipamento";
      else {
        await client.sendMessage(msg.from, "❌ Opção inválida. Digite *menu* para começar novamente.");
        delete estados[msg.from];
        return;
      }

      estados[msg.from].tipo = tipo;
      estados[msg.from].etapa = "descricao";

      await typing();
      await client.sendMessage(
        msg.from,
        `📝 Você selecionou: *${tipo}*\n\nDescreva o problema ou solicitação:`
      );
      return;
    }

    // REGISTRO DO CHAMADO
    if (estados[msg.from]?.etapa === "descricao") {
      estados[msg.from].descricao = msg.body;
      estados[msg.from].data = new Date().toLocaleString("pt-BR");

      console.log("📋 NOVO CHAMADO REGISTRADO:");
      console.log(estados[msg.from]);

      await typing();
      await client.sendMessage(
        msg.from,
        `✅ *Chamado registrado com sucesso!*\n\n` +
        `📌 Tipo: ${estados[msg.from].tipo}\n` +
        `📝 Descrição: ${estados[msg.from].descricao}\n\n` +
        `Nossa equipe de TI entrará em contato em breve.`
      );

      delete estados[msg.from];
      return;
    }

  } catch (error) {
    console.error("❌ Erro no processamento da mensagem:", error);
  }
});
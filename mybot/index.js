import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"

const startSock = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state
  })

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) qrcode.generate(qr, { small: true })
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log("Connection closed. Reconnecting:", shouldReconnect)
      if (shouldReconnect) startSock()
    } else if (connection === "open") {
      console.log("✅ Connected to WhatsApp!")
    }
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    const from = msg.key.remoteJid
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text
    console.log("📩 From:", from, "Text:", text)

    if (text?.toLowerCase() === "ping") {
      await sock.sendMessage(from, { text: "pong 🏓" })
    }
  })
}

startSock()
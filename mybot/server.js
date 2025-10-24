import express from "express"
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"

const app = express()
app.use(express.json())

let sock

// --- Mulai koneksi WhatsApp ---
const startSock = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state
  })

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("Pindai QR code ini untuk terhubung:");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log("Koneksi terputus. Menyambungkan kembali:", shouldReconnect)
      if (shouldReconnect) {
        startSock()
      }
    } else if (connection === "open") {
      console.log("✅ WhatsApp Terhubung!")
    }
  })

  sock.ev.on("creds.update", saveCreds)
}

startSock()

// --- Endpoint API: kirim pesan ---
app.post("/send", async (req, res) => {
  try {
    const { to, message } = req.body
    if (!sock || sock.ws.readyState !== 1) {
      return res.status(500).json({ error: "WhatsApp belum terhubung" })
    }
    if (!to || !message) {
        return res.status(400).json({ error: "Mohon sertakan 'to' dan 'message'" });
    }
    const jid = `${to}@s.whatsapp.net`
    await sock.sendMessage(jid, { text: message })
    res.json({ success: true, sent_to: to, message })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// --- Rute pengecekan sederhana ---
app.get("/", (req, res) => {
  res.send("🚀 WhatsApp API sedang berjalan")
})

const PORT = 3001
app.listen(PORT, () => console.log(`✅ Server API berjalan di port ${PORT}`))
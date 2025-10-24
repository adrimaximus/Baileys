import express from "express"
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"

const app = express()
app.use(express.json())

let sock

const startSock = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  sock = makeWASocket({ 
    printQRInTerminal: true, 
    auth: state 
  })

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("QR code received, please scan:");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log("Connection closed. Reconnecting:", shouldReconnect)
      if (shouldReconnect) {
        startSock()
      }
    } else if (connection === "open") {
      console.log("✅ Connected to WhatsApp!")
    }
  })

  sock.ev.on("creds.update", saveCreds)
}

// Mulai koneksi socket
startSock()

// Endpoint API untuk mengirim pesan
app.post("/send", async (req, res) => {
  const { to, message } = req.body
  
  if (!sock || sock.ws.readyState !== 1) {
      return res.status(500).json({ success: false, message: "Socket belum siap atau tidak terhubung" })
  }
  
  if (!to || !message) {
      return res.status(400).json({ success: false, message: "Mohon sertakan 'to' dan 'message' di body request" });
  }

  try {
    const jid = `${to}@s.whatsapp.net`
    // Cek apakah JID ada di WhatsApp
    const [result] = await sock.onWhatsApp(jid);
    if (!result?.exists) {
        return res.status(404).json({ success: false, message: `Nomor ${to} tidak ditemukan di WhatsApp` });
    }
    await sock.sendMessage(jid, { text: message })
    res.json({ success: true, message: `Pesan terkirim ke ${to}` })
  } catch (error) {
    console.error("Gagal mengirim pesan:", error);
    res.status(500).json({ success: false, message: "Gagal mengirim pesan", error: error.message });
  }
})

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ WhatsApp API berjalan di port ${PORT}`))
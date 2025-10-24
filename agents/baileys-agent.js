import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"

let sock

export async function setup() {
  console.log("🚀 Initializing Baileys Agent...")

  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  sock = makeWASocket({ printQRInTerminal: true, auth: state })

  sock.ev.on("connection.update", ({ connection, qr }) => {
    if (qr) qrcode.generate(qr, { small: true })
    if (connection === "open") console.log("✅ WhatsApp Connected!")
  })

  sock.ev.on("creds.update", saveCreds)
  return "✅ Baileys Agent aktif dan siap menerima perintah"
}

export async function handle(command) {
  if (!sock) return "❌ WhatsApp belum terhubung. Jalankan `setup` dulu dan scan QR di terminal."

  const lower = command.toLowerCase().trim()

  if (lower.startsWith("kirim ke")) {
    const [_, rest] = command.split("kirim ke")
    const [number, ...msgParts] = rest.trim().split(":")
    const message = msgParts.join(":").trim()
    await sock.sendMessage(`${number}@s.whatsapp.net`, { text: message })
    return `✅ Pesan terkirim ke ${number}: ${message}`
  }

  if (lower === "status") {
    return sock?.user ? `✅ Terhubung sebagai ${sock.user.id}` : "❌ Belum terkoneksi"
  }

  if (lower === "restart bot") {
    await sock.ws.close()
    sock = null
    await setup()
    return "♻️ Bot direstart dan menunggu koneksi baru"
  }

  return "❓ Perintah tidak dikenali. Gunakan: kirim ke 628xxx: Halo"
}
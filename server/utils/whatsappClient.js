import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', (qr) => {
    console.log("👇 Apne WhatsApp se is QR code ko scan karein 👇");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("✅ WhatsApp Bot is Ready and Connected!");
});

client.initialize();

export const sendDirectWhatsApp = async (phone, message) => {
    try {
        const formattedNumber = `${phone.replace('+', '')}@c.us`; 
        await client.sendMessage(formattedNumber, message);
        console.log(`WhatsApp message sent successfully to ${phone}`);
    } catch (error) {
        console.error("WhatsApp sending error:", error);
    }
};

export default client;
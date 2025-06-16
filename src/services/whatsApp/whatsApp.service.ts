import { WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TOKEN } from '@/config';
import axios from 'axios';

export const sendWhatsAppMessage = async (phone_number: number, data) => {
  try {
    const url = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const TEMPLATE_NAME = 'booking_confirmation';
    const payload = {
      messaging_product: 'whatsapp',
      to: `91${phone_number}`, // India code assumed
      type: 'template',
      template: {
        name: TEMPLATE_NAME,
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: phone_number },
              { type: 'text', text: `${amount / 100} INR` },
            ],
          },
        ],
      },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('WhatsApp sent:', response.data);
  } catch (error) {
    console.log('🚀 ~ :33 ~ sendWhatsAppMessage ~ error:', error);
  }
};

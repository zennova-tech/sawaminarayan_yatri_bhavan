import { WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TOKEN } from '@/config';
import axios from 'axios';
import { format } from 'date-fns';

export const sendWhatsAppMessage = async (phone_number: number, data) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const fullName = `${data.first_name} ${data.last_name}`;
    const formattedCheckIn = format(new Date(data.check_in), 'dd-MM-yyyy');
    const formattedCheckOut = format(new Date(data.check_out), 'dd-MM-yyyy');
    const exploreURL = `https://beytdwarka.com/`;
    const TEMPLATE_NAME = 'customer_booking_confirmation';
    const payload = {
      messaging_product: 'whatsapp',
      to: `91${phone_number}`, // India code assumed
      type: 'template',
      template: {
        name: 'customer_booking_confirmation',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: `${fullName}` },
              {
                type: 'text',
                text: `${formattedCheckIn} 10:00 AM`,
              },
              {
                type: 'text',
                text: `${formattedCheckOut} 09:00 AM`,
              },
              { type: 'text', text: `${data.rooms}` },
              {
                type: 'text',
                text: `${data.rooms * data.guest_per_room}`,
              },
              { type: 'text', text: `${data.mattress}` },
              { type: 'text', text: `${data.amount}` },
              { type: 'text', text: `+91 63537 32585` },
              { type: 'text', text: `+91 72010 60500` },
              { type: 'text', text: `${exploreURL}` },
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

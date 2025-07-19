import {
  BASE_URL,
  EXPLORE_URL,
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_TOKEN,
  WHATSAPP_WEBHOOK_TOKEN,
} from '@/config';
import { generalResponse } from '@/utils/generalResponse';
import axios from 'axios';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import FormData from 'form-data';
import * as fs from 'fs';

const uploadMedia = async () => {
  const formData = new FormData();
  formData.append(
    'file',
    fs.createReadStream('src/assets/whatsapp_banner.jpeg')
  );
  formData.append('type', 'image/jpeg');
  formData.append('messaging_product', 'whatsapp');

  const response = await axios.post(
    `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/media`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.id;
};

export const sendWhatsAppMessage = async (phone_number: number, data) => {
  try {
    const mediaId = await uploadMedia();
    const url = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const fullName = `${data.first_name} ${data.last_name}`;
    const formattedCheckIn = format(new Date(data.check_in), 'dd/MM/yyyy');
    const formattedCheckOut = format(new Date(data.check_out), 'dd/MM/yyyy');
    const TEMPLATE_NAME = 'customer_booking_confirmation';
    // const IMAGE_URL = `${BASE_URL}/images/whatsapp_banner.jpeg`;

    const payload = {
      messaging_product: 'whatsapp',
      to: `91${phone_number}`, // India code assumed
      type: 'template',
      template: {
        name: TEMPLATE_NAME,
        language: { code: 'en_US' },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  // link: IMAGE_URL,
                  id: mediaId,
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              { type: 'text', text: fullName },
              { type: 'text', text: `${formattedCheckIn} 10:00 AM` },
              { type: 'text', text: `${formattedCheckOut} 09:00 AM` },
              { type: 'text', text: data.rooms.toString() }, // Ensure string
              {
                type: 'text',
                text: (data.rooms * data.guest_per_room).toString(),
              },
              { type: 'text', text: data.mattress.toString() },
              { type: 'text', text: data.amount.toString() },
              { type: 'text', text: '+91 63537 32585' },
              { type: 'text', text: '+91 72010 60500' },
              { type: 'text', text: EXPLORE_URL },
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
    console.error('WhatsApp error details:', error.response?.data);
    console.error('Status:', error.response?.status);
  }
};

export const whatsAppVerification = async (req: Request, res: Response) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Your verify token (set this in Facebook)

    if (mode && token) {
      if (mode === 'subscribe' && token === WHATSAPP_WEBHOOK_TOKEN) {
        console.log('Webhook verified successfully!');
        return generalResponse(
          req,
          res,
          challenge,
          'Webhook verified successfully!',
          false
        );
      } else {
        return generalResponse(
          req,
          res,
          null,
          'Webhook secret not configured',
          false,
          'error',
          403
        );
      }
    }
  } catch (error) {
    console.log('🚀 ~ whatsAppVerification ~ error:', error);
  }
};

export const whatsAppStatus = async (req: Request, res: Response) => {
  const body = req.body;

  // Check for message status updates
  if (body.entry && body.entry[0].changes) {
    const changes = body.entry[0].changes[0];

    if (changes.value.statuses) {
      const status = changes.value.statuses[0];
      return generalResponse(
        req,
        res,
        {
          messageId: status.id,
          status: status.status, // sent, delivered, read, failed
          timestamp: status.timestamp,
          recipientId: status.recipient_id,
          errors: status.errors || 'No errors',
        },
        'Message Status Update',
        false
      );
    }

    if (changes.value.messages) {
      console.log('📨 Incoming Message:', changes.value.messages[0]);
    }
  }
  return generalResponse(req, res, null, 'Message Sent Successfully', false);
};

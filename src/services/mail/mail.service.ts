import { MAIL_PASS, MAIL_USER } from '@/config';
import { bookingPayload, ContactPayload } from '@/interfaces/types/bookingInterfaces';
import { format } from 'date-fns';
import nodemailer from 'nodemailer';

export const sendMail = async (
  email: string,
  subject: string,
  data: bookingPayload | ContactPayload,
  isCustomer = false,
  isContact = false,
) => {
  try {
    let html = '';

    if (isContact) {
      const contact = data as ContactPayload;
      html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #e65100;">Swaminarayan Yatri Bhavan</h2>
            <p>You have received a new inquiry from the contact form.</p>

            <hr style="border: none; border-top: 1px solid #ccc;" />

            <p><strong>Full Name:</strong> ${contact.full_name}</p>
            <p><strong>Phone Number:</strong> ${contact.phone_number}</p>
            <p><strong>Email:</strong> ${contact.email}</p>

            <p><strong>Message:</strong></p>
            <p style="margin-left: 16px;">${contact.message}</p>
            
            <hr style="border: none; border-top: 1px solid #ccc;" />

            <p style="font-size: 0.9rem; color: #888;">
            This message was submitted via the Swaminarayan Yatri Bhavan website.
            </p>
            </div>`;
    } else {
      const booking = data as bookingPayload;
      html = `
        <h2 style="color: #e65100;">Swaminarayan Yatri Bhavan</h2>
        <h2>${isCustomer ? 'New Booking Received' : 'Hi ' + booking.first_name + ','}</h2>
        <p>Here are the booking details:</p>
        <ul>
          <li><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</li>
          <li><strong>Phone:</strong> ${booking.phone_number}</li>
          <li><strong>Email:</strong> ${booking.email}</li>
          <li><strong>Check-in:</strong> ${format(new Date(booking.check_in), 'dd/MM/yyyy')}</li>
          <li><strong>Check-out:</strong> ${format(new Date(booking.check_out), 'dd/MM/yyyy')}</li>
          <li><strong>Rooms:</strong> ${booking.rooms}</li>
          <li><strong>Total Guests:</strong> ${booking.total_guests}</li>
          <li><strong>Extra Mattress:</strong> ${booking.mattress || '-'}</li>
          <li><strong>Amount:</strong> ₹${booking.amount}/-</li>
        </ul>
        <p>${isCustomer ? '' : 'We look forward to hosting you!'}</p>
      `;
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Swaminarayan Yatri Bhavan" <${MAIL_USER}>`,
      to: email,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send mail to ${email}:`, error);
    throw error;
  }
};

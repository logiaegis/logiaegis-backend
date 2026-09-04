import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async createContact(data: { name: string; email: string; company?: string; message: string }) {
    // 1. Save the data to the database
    const saved = await this.prisma.contactSubmission.create({
      data,
    });

    // 2. Send the auto-reply email via Resend (using built-in fetch)
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL,
          to: [data.email],
          subject: 'Thank you for contacting LogiAegis',
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #0b5cff;">Thank you, ${data.name}!</h2>
              <p>We have received your message.</p>
              <p>Our team will review your inquiry and get back to you shortly.</p>
              <br>
              <p>Best regards,<br>
              <strong>The LogiAegis Team</strong></p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        console.error('Email failed:', await response.text());
      }
    } catch (error) {
      console.error('Email sending error:', error);
    }

    // Return the saved data (proof it was saved)
    return saved;
  }
}
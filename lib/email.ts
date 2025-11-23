// Email sending utility using Nodemailer
// Works with Gmail, Outlook, SendGrid, AWS SES, or any SMTP server

import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  // Check if SMTP is configured
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASSWORD

  // If no SMTP configured, create a test transporter (won't send real emails)
  if (!smtpHost || !smtpUser || !smtpPass) {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'test',
        pass: 'test',
      },
    })
    return transporter
  }

  // Create real SMTP transporter
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort || '587'),
    secure: smtpPort === '465', // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  return transporter
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASSWORD
    const fromEmail = process.env.FROM_EMAIL || smtpUser || 'noreply@quantro.com'

    // Check if SMTP is configured
    if (!smtpHost || !smtpUser || !smtpPass) {
      // In development, log to console
      console.log('\n' + '='.repeat(60))
      console.log('📧 EMAIL (Not sent - SMTP not configured)')
      console.log('='.repeat(60))
      console.log('To:', to)
      console.log('Subject:', subject)
      console.log('Body:', text || html.replace(/<[^>]*>/g, '').substring(0, 200) + '...')
      console.log('='.repeat(60))
      
      // Show setup instructions
      console.log('\n💡 To enable email sending, add to .env.local:')
      console.log('   SMTP_HOST=smtp.gmail.com (or your SMTP server)')
      console.log('   SMTP_PORT=587')
      console.log('   SMTP_USER=your-email@gmail.com')
      console.log('   SMTP_PASSWORD=your-app-password')
      console.log('   FROM_EMAIL=noreply@yourdomain.com (optional)')
      console.log('\n📖 See EMAIL_SETUP.md for detailed instructions\n')
      
      return false
    }

    const mailTransporter = getTransporter()

    // Send email
    const info = await mailTransporter.sendMail({
      from: `Quantro <${fromEmail}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''),
    })

    console.log('✅ Email sent successfully! Message ID:', info.messageId)
    return true
  } catch (error: any) {
    console.error('❌ Error sending email:', error.message || error)
    // Fallback: log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent to:', to)
      console.log('Subject:', subject)
    }
    return false
  }
}

export async function send2FACode(email: string, code: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #0f172a;
          color: #e2e8f0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        .code-box {
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid #3b82f6;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #60a5fa;
          font-family: 'Courier New', monospace;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
        }
        .warning {
          background: rgba(239, 68, 68, 0.1);
          border-left: 4px solid #ef4444;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Quantro</div>
          <h1 style="color: #e2e8f0; margin: 10px 0;">Two-Factor Authentication</h1>
        </div>
        
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">
          Your verification code is:
        </p>
        
        <div class="code-box">
          <div class="code">${code}</div>
        </div>
        
        <div class="warning">
          <strong style="color: #fca5a5;">⚠️ Security Notice:</strong>
          <p style="margin: 5px 0 0 0; color: #cbd5e1; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong>. 
            Never share this code with anyone. Quantro will never ask for your code.
          </p>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
          If you didn't request this code, please ignore this email or contact support if you're concerned.
        </p>
        
        <div class="footer">
          <p>This is an automated message from Quantro. Please do not reply.</p>
          <p>© ${new Date().getFullYear()} Quantro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Quantro - Two-Factor Authentication

Your verification code is: ${code}

This code will expire in 10 minutes.

⚠️ Security Notice:
Never share this code with anyone. Quantro will never ask for your code.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} Quantro. All rights reserved.
  `

  return sendEmail({
    to: email,
    subject: 'Your Quantro 2FA Verification Code',
    html: html,
    text: text,
  })
}


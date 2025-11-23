# Email Setup Guide for 2FA

Currently, 2FA codes are being logged to the console but not actually sent via email. To enable real email sending, configure SMTP settings below.

## Quick Setup with Gmail

### 1. Enable App Password in Gmail
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to "App passwords" 
4. Create a new app password for "Mail"
5. Copy the 16-character password

### 2. Create `.env.local` file
Create a file named `.env.local` in your project root:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
FROM_EMAIL=your-email@gmail.com
```

### 3. Restart your server
```bash
npm run dev
```

Now emails will actually be sent!

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
FROM_EMAIL=your-email@outlook.com
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
```

### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
FROM_EMAIL=noreply@yourdomain.com
```

### Custom SMTP
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@yourdomain.com
```

## Testing

1. After configuring, try logging in with 2FA enabled
2. Choose "Email" as your 2FA method
3. Check your email inbox (and spam folder)
4. The email should arrive within seconds

## Development Mode

If SMTP is not configured:
- ✅ Codes will be logged to the console
- ✅ Codes will be shown in the UI for testing
- ✅ Setup instructions will be displayed in the console

## Email Template

The 2FA email includes:
- ✅ Professional HTML design matching Quantro's brand
- ✅ Large, easy-to-read code
- ✅ Security warnings
- ✅ 10-minute expiration notice
- ✅ Plain text fallback

## Troubleshooting

**Emails not sending?**
- Check that all SMTP variables are set correctly in `.env.local`
- Verify your SMTP credentials
- Check spam folder
- Look at server console logs for errors
- For Gmail: Make sure you're using an App Password, not your regular password

**Gmail not working?**
- Use App Passwords (not regular password)
- Enable "Less secure app access" (if App Passwords unavailable)
- Check that 2-Step Verification is enabled

**Rate limits?**
- Gmail: 500 emails/day for free accounts
- Use a dedicated email service for production (SendGrid, AWS SES, etc.)

## Production Recommendations

For production, use a dedicated email service:
- **SendGrid**: Easy setup, free tier available
- **AWS SES**: Very cheap, reliable
- **Mailgun**: Good free tier
- **Postmark**: Best for transactional emails

# Email Setup Instructions

To make the contact form actually send emails, follow these steps:

## 1. Get a Resend API Key

1. Sign up for a free account at [https://resend.com](https://resend.com)
2. Go to the API Keys section in your dashboard
3. Create a new API key
4. Copy the API key (it starts with `re_`)

## 2. Set Up Environment Variables

### For Local Development:
1. Copy the example file: `cp .dev.vars.example .dev.vars`
2. Edit `.dev.vars` and replace `re_your_api_key_here` with your actual Resend API key

### For Production:
1. Deploy to Cloudflare Workers
2. Set the secret in your terminal:
   ```bash
   wrangler secret put RESEND_API_KEY
   ```
3. Paste your Resend API key when prompted

## 3. Verify Your Domain (Optional but Recommended)

To send emails from your own domain (`noreply@phillipdeeley.com`):

1. Go to Resend dashboard → Domains
2. Add your domain `phillipdeeley.com`
3. Add the DNS records provided by Resend to your domain's DNS settings
4. Wait for domain verification

## 4. Test the Contact Form

1. Deploy the worker: `wrangler deploy`
2. Visit your contact page
3. Fill out the form and submit
4. Check your email at phillipdeeley@gmail.com

## 5. Alternative Email Services

If you prefer not to use Resend, you can modify the worker.js to use:
- SendGrid
- Mailgun
- AWS SES
- Any other email API service

## Security Notes

- Never commit your actual API key to version control
- The `.dev.vars` file is already in `.gitignore`
- Use environment variables for production secrets
- Consider implementing rate limiting for production use

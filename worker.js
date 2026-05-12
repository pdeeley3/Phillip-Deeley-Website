// Cloudflare Worker for handling contact form submissions
export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return handleCORS();
        }

        // Only handle POST requests to /contact
        if (request.method !== 'POST' || !request.url.includes('/contact')) {
            return new Response('Not Found', { status: 404 });
        }

        try {
            const formData = await request.json();
            
            // Validate required fields
            const { name, email, subject, message } = formData;
            if (!name || !email || !subject || !message) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: 'All fields are required' 
                }), {
                    status: 400,
                    headers: getCORSHeaders()
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: 'Invalid email format' 
                }), {
                    status: 400,
                    headers: getCORSHeaders()
                });
            }

            // Send email using Resend API
            const resendApiKey = env.RESEND_API_KEY;
            
            
            // Prepare email content
            const emailData = {
                from: 'noreply@phillipdeeley.com',
                to: ['phillipdeeley@gmail.com'],
                subject: `Contact Form: ${subject}`,
                reply_to: email,
                text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
                `.trim(),
                html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject}</p>
<hr>
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
<hr>
<p><small>This message was sent from the contact form on phillipdeeley.com</small></p>
                `.trim()
            };

            // Send email using Resend API
            const emailResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });

            if (!emailResponse.ok) {
                const errorData = await emailResponse.text();
                console.error('Email sending failed:', errorData);
                throw new Error('Failed to send email');
            }

            const emailResult = await emailResponse.json();
            console.log('Email sent successfully:', emailResult);

            return new Response(JSON.stringify({ 
                success: true, 
                message: 'Your message has been sent successfully!' 
            }), {
                status: 200,
                headers: getCORSHeaders()
            });

        } catch (error) {
            console.error('Contact form error:', error);
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Failed to send message. Please try again.' 
            }), {
                status: 500,
                headers: getCORSHeaders()
            });
        }
    }
};

function handleCORS() {
    return new Response(null, {
        status: 200,
        headers: getCORSHeaders()
    });
}

function getCORSHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
}

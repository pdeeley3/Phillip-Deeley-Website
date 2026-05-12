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

            // Send email using Cloudflare Email API or external service
            // For now, we'll log the submission and return success
            console.log('Contact form submission:', {
                name,
                email,
                subject,
                message,
                timestamp: new Date().toISOString()
            });

            // In a real implementation, you would:
            // 1. Use an email service like SendGrid, Mailgun, or Resend
            // 2. Store the submission in a database
            // 3. Send notification to the site owner
            
            // For demo purposes, we'll simulate successful email sending
            const emailContent = {
                to: 'phillipdeeley@gmail.com',
                from: email,
                subject: `Contact Form: ${subject}`,
                text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
                `.trim()
            };

            // Simulate email sending delay
            await new Promise(resolve => setTimeout(resolve, 100));

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

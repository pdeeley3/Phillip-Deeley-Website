/* ========================================= */
/* File Name: scripts.js                      */
/* Project: Phillip Deeley Website            */
/* Author: Phillip Deeley                     */
/* Created: 24/04/2026                        */
/* Last Edited: 12/05/2026                    */
/* Version: 1.1.5                             */
/* Notes: Main JavaScript file for website    */
/* ========================================= */


// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeBtn = document.querySelector('.header-btn');
    
    if (darkModeBtn) {
        // Check for saved preference or default to dark mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = savedTheme === 'light' ? false : true;
        
        // Apply saved theme on load
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            darkModeBtn.innerHTML = '&#9790;'; // Moon symbol for toggling dark mode
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeBtn.innerHTML = '&#9788;'; // Sun symbol for toggling light mode
        }
        
        // Toggle theme on click
        darkModeBtn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update button symbol
            if (newTheme === 'light') {
                darkModeBtn.innerHTML = '&#9790;'; // Moon
            } else {
                darkModeBtn.innerHTML = '&#9788;'; // Sun
            }
        });
    }

    // Contact form functionality
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate form
            if (!name || !email || !subject || !message) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Disable submit button during submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                // Send form data to Cloudflare Worker
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        subject,
                        message
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage(result.message || 'Your message has been sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    showMessage(result.error || 'Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Contact form submission error:', error);
                showMessage('Failed to send message. Please check your connection and try again.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});
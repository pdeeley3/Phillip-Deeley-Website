/* ========================================= */
/* File Name: scripts.js                      */
/* Project: Phillip Deeley Website            */
/* Author: Phillip Deeley                     */
/* Created: 24/04/2026                        */
/* Last Edited: 24/04/2026                    */
/* Version: 1.1.1                             */
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
});
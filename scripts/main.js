document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. Theme Toggle
    // =========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkTheme();
    } else {
        enableLightTheme();
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.contains('light-theme') ? enableDarkTheme() : enableLightTheme();
        });
    }

    function enableLightTheme() {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        localStorage.setItem('theme', 'light');
    }

    function enableDarkTheme() {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', 'dark');
    }



    // =========================================
    // 3. Scroll Handling (Observer + Progress)
    // =========================================
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progress.style.width = scrolled + "%";
    });

    const scrollElements = document.querySelectorAll('[data-scroll], .fade-in-up, .fade-in, .fade-in-left, .fade-in-right, .scale-in');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else if (entry.boundingClientRect.top > 0) {
                // Remove visible class when scrolling back up for re-animation
                // but only if it's below the fold to avoid flashing
                // entry.target.classList.remove('visible'); 
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    scrollElements.forEach(el => scrollObserver.observe(el));

    // =========================================
    // 4. Parallax Hero Content
    // =========================================
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        }

        const blobs = document.querySelectorAll('.blob');
        blobs.forEach((blob, i) => {
            const speed = (i + 1) * 30;
            blob.style.transform = `translate(${(e.clientX / window.innerWidth - 0.5) * speed}px, ${(e.clientY / window.innerHeight - 0.5) * speed}px)`;
        });
    });

    // =========================================
    // 5. Form Handling (Email vs WhatsApp Choice)
    // =========================================
    const contactForm = document.getElementById('contact-form');
    const sendBtn = document.getElementById('send-message-btn');
    const contactMethodInline = document.getElementById('contact-method-inline');
    const whatsappBtn = document.getElementById('contact-whatsapp');
    const emailBtn = document.getElementById('contact-email');

    if (contactForm && sendBtn && contactMethodInline && whatsappBtn && emailBtn) {
        // Submit handler for the "Send Message" button
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check form validity
            if (contactForm.checkValidity()) {
                // Hide the "Send Message" button
                sendBtn.style.display = 'none';
                
                // Show the WhatsApp & Email options in its place
                contactMethodInline.style.display = 'block';
                contactMethodInline.classList.add('highlight-pulse');
                
                // Smoothly scroll the container into view
                contactMethodInline.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                contactForm.reportValidity();
            }
        });

        // Helper function to get form data and trigger validation
        const getFormDataIfValid = () => {
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                // Smoothly scroll to the first invalid field
                const firstInvalid = contactForm.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return null;
            }
            
            const formData = new FormData(contactForm);
            return {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
        };

        // WhatsApp Redirection
        whatsappBtn.addEventListener('click', () => {
            const data = getFormDataIfValid();
            if (!data) return; // Form is invalid

            const text = `Hi Visswa Happy to contact you\n\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`;
            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/919840415281?text=${encodedText}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Cleanup and success feedback
            resetFormToDefault();
            showSuccessFeedback();
        });

        // Email Redirection (mailto:)
        emailBtn.addEventListener('click', () => {
            const data = getFormDataIfValid();
            if (!data) return; // Form is invalid

            const subject = `Contact from ${data.name}`;
            const body = `Hi Visswa Happy to contact you\n\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`;
            const mailtoUrl = `mailto:visswaaravind@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            window.location.href = mailtoUrl;
            
            // Cleanup and success feedback
            resetFormToDefault();
            showSuccessFeedback();
        });

        // Reset the form action buttons to show the Send Message button again
        const resetFormToDefault = () => {
            sendBtn.style.display = 'block';
            contactMethodInline.style.display = 'none';
            contactMethodInline.classList.remove('highlight-pulse');
        };

        // Show feedback message after success
        const showSuccessFeedback = () => {
            const successMsg = contactForm.querySelector('.success-message');
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }
            contactForm.reset();
        };

        // If the user starts typing or edits, restore the Send Message button and hide choices
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                if (sendBtn.style.display === 'none') {
                    resetFormToDefault();
                }
            });
        });
    }

    // =========================================
    // 6. Mobile Menu Toggle
    // =========================================
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            const isVisible = navLinks.classList.toggle('active');
            if (isVisible) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-color)';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }
    // =========================================
    // 7. ScrollSpy for Pill Nav
    // =========================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-section-link');

    function scrollSpy() {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute("id");
            }
        });

        navItems.forEach((item) => {
            item.classList.remove("active");
            if (item.getAttribute("data-section") === currentSection) {
                item.classList.add("active");
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Run once on load

    // =========================================
    // 8. Live Clock
    // =========================================
    function updateClock() {
        const timeEl = document.getElementById('live-time');
        const dateEl = document.getElementById('live-date');
        if (!timeEl || !dateEl) return;

        const now = new Date();
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
        const optionsDate = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };

        timeEl.textContent = now.toLocaleTimeString('en-US', optionsTime);
        dateEl.textContent = now.toLocaleDateString('en-US', optionsDate);
    }

    setInterval(updateClock, 10 * 1000); // Update every 10 seconds
    updateClock();
});

// =========================================
// 7. RICE Calculator
// =========================================
window.calculateRICE = function () {
    const reach = parseFloat(document.getElementById('reach').value) || 0;
    const impact = parseFloat(document.getElementById('impact').value) || 0;
    const confidence = parseFloat(document.getElementById('confidence').value) || 0;
    const effort = parseFloat(document.getElementById('effort').value) || 1; // Avoid division by zero

    const score = (reach * impact * (confidence / 100)) / effort;

    const scoreElement = document.getElementById('rice-score');
    if (scoreElement) {
        // Animate the number change
        const start = parseInt(scoreElement.innerText);
        const end = Math.round(score);
        animateNumber(scoreElement, start, end, 500);
    }
}

function animateNumber(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


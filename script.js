document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Custom Cursor - more visible
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursorFollower.style.display = 'block';
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            cursorFollower.style.left = `${e.clientX}px`;
            cursorFollower.style.top = `${e.clientY}px`;
        });

        // Hide cursor initially
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';

        // Cursor hover effects - more contrast
        const hoverElements = document.querySelectorAll('a, button, .work-item, input, textarea, select, .social-icon');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
                cursor.style.backgroundColor = 'rgba(196, 171, 8, 0.9)';
                cursor.style.borderColor = 'var(--dark)';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
                cursorFollower.style.borderColor = 'var(--primary)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'rgba(255, 223, 0, 0.8)';
                cursor.style.borderColor = 'var(--dark)';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // Mobile menu toggle - fixed above everything
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }

    // Close menu when clicking a link - ensure clickable
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't prevent default for resume link
            if (!link.href.includes('resume.pdf')) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.menu-toggle').classList.remove('active');
        });
    });

    // Resume link tracking
    document.querySelectorAll('a[href*="resume.pdf"]').forEach(link => {
        link.addEventListener('click', () => {
            console.log('Resume downloaded');
            // You can add analytics tracking here
        });
    });

    // Video Background - Slow playback
    const videoBg = document.querySelector('.video-background');
    if (videoBg) {
        videoBg.playbackRate = 0.7;
        videoBg.addEventListener('error', function() {
            document.body.style.background = 'radial-gradient(circle, #2a0845 0%, #1a0630 100%)';
        });
    }

    // Scroll progress indicator
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollProgress + '%';
        });
    }

    // Scroll to top button - always visible
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const progressCircleFill = document.querySelector('.progress-circle-fill');
    
    if (scrollToTopBtn && progressCircleFill) {
        scrollToTopBtn.classList.add('visible');
        
        window.addEventListener('scroll', function() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            
            // Update circle progress
            const offset = 126 - (126 * scrollProgress / 100);
            progressCircleFill.style.strokeDashoffset = offset;
        });

        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Section animations - sliding effect
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Button ripple effects
    document.querySelectorAll('.hero-btn, .resume-btn, .submit-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Dynamic form
    const contactForm = document.getElementById('clientForm');
    if (contactForm) {
        const subjectField = contactForm.querySelector('#subject');
        const dynamicFieldContainer = contactForm.querySelector('.dynamic-fields');

        subjectField.addEventListener('change', function() {
            dynamicFieldContainer.innerHTML = '';
            
            if (this.value === 'Project Inquiry') {
                const projectTypeField = document.createElement('div');
                projectTypeField.className = 'form-group';
                projectTypeField.innerHTML = `
                    <label for="projectType">Project Type</label>
                    <select id="projectType" name="projectType" required>
                        <option value="">Select project type</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Web Application">Web Application</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Other">Other</option>
                    </select>
                `;
                dynamicFieldContainer.appendChild(projectTypeField);

                const budgetField = document.createElement('div');
                budgetField.className = 'form-group';
                budgetField.innerHTML = `
                    <label for="budget">Project Budget (USD)</label>
                    <select id="budget" name="budget" required>
                        <option value="">Select budget range</option>
                        <option value="300-500">$300 - $500</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="1000-5000">$1,000 - $5,000</option>
                        <option value="5000+">$5,000+</option>
                        <option value="undecided">Undecided</option>
                    </select>
                `;
                dynamicFieldContainer.appendChild(budgetField);
                
                const timelineField = document.createElement('div');
                timelineField.className = 'form-group';
                timelineField.innerHTML = `
                    <label for="timeline">Project Timeline</label>
                    <select id="timeline" name="timeline" required>
                        <option value="">Select timeline</option>
                        <option value="1-2 weeks">1-2 weeks</option>
                        <option value="1 month">1 month</option>
                        <option value="2-3 months">2-3 months</option>
                        <option value="3+ months">3+ months</option>
                        <option value="flexible">Flexible</option>
                    </select>
                `;
                dynamicFieldContainer.appendChild(timelineField);
            } 
            else if (this.value === 'Job Opportunity') {
                const positionField = document.createElement('div');
                positionField.className = 'form-group';
                positionField.innerHTML = `
                    <label for="position">Position Type</label>
                    <select id="position" name="position" required>
                        <option value="">Select position type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                    </select>
                `;
                dynamicFieldContainer.appendChild(positionField);

                const companyField = document.createElement('div');
                companyField.className = 'form-group';
                companyField.innerHTML = `
                    <label for="company">Company Name</label>
                    <input type="text" id="company" name="company" placeholder="Your company name" required>
                `;
                dynamicFieldContainer.appendChild(companyField);
            }
            else if (this.value === 'Collaboration') {
                const collabTypeField = document.createElement('div');
                collabTypeField.className = 'form-group';
                collabTypeField.innerHTML = `
                    <label for="collabType">Collaboration Type</label>
                    <select id="collabType" name="collabType" required>
                        <option value="">Select collaboration type</option>
                        <option value="Open Source">Open Source Project</option>
                        <option value="Design Partnership">Design Partnership</option>
                        <option value="Development Partnership">Development Partnership</option>
                        <option value="Other">Other</option>
                    </select>
                `;
                dynamicFieldContainer.appendChild(collabTypeField);

                const detailsField = document.createElement('div');
                detailsField.className = 'form-group';
                detailsField.innerHTML = `
                    <label for="collabDetails">Collaboration Details</label>
                    <textarea id="collabDetails" name="collabDetails" placeholder="Tell me more about the collaboration..." required></textarea>
                `;
                dynamicFieldContainer.appendChild(detailsField);
            }
            else if (this.value === 'Other') {
                const otherField = document.createElement('div');
                otherField.className = 'form-group';
                otherField.innerHTML = `
                    <label for="otherDetails">Please specify</label>
                    <input type="text" id="otherDetails" name="otherDetails" placeholder="What would you like to discuss?" required>
                `;
                dynamicFieldContainer.appendChild(otherField);
            }
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create form data object
            const formData = {
                subject: this.subject.value,
                name: this.name.value,
                phone: this.phone.value,
                email: this.email.value,
                message: this.message.value
            };

            // Add dynamic fields to form data
            const dynamicFields = this.querySelectorAll('.dynamic-fields input, .dynamic-fields select, .dynamic-fields textarea');
            dynamicFields.forEach(field => {
                formData[field.name] = field.value;
            });

            // Here you would typically send the form data to a server
            console.log('Form submitted:', formData);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            this.reset();
            dynamicFieldContainer.innerHTML = '';
        });
    }

    // Fix for social links in navbar
    document.querySelectorAll('.social-links a, .contact-social a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow default link behavior
        });
    });
});

// Testimonials
const testimonialItems = document.querySelectorAll('.testimonial-item');
testimonialItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 0.1}s`;
});

const sections = document.querySelectorAll('section, .testimonials');
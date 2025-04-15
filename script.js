// ======================
// Firebase Configuration
// ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDt0xz7tycajvU3PHNoIQ6Jgs6h6ZBvLGE",
  authDomain: "elikibaprtfolio.firebaseapp.com",
  projectId: "elikibaprtfolio",
  storageBucket: "elikibaprtfolio.appspot.com",
  messagingSenderId: "185552597230",
  appId: "1:185552597230:web:57af44ea255bf6895903ff"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ======================
// DOM Elements
// ======================
const elements = {
  year: document.getElementById('currentYear'),
  cursor: document.querySelector('.cursor'),
  cursorFollower: document.querySelector('.cursor-follower'),
  menuToggle: document.querySelector('.menu-toggle'),
  navLinks: document.querySelector('.nav-links'),
  videoBg: document.querySelector('.video-background'),
  progressBar: document.querySelector('.progress-bar'),
  scrollToTopBtn: document.querySelector('.scroll-to-top'),
  progressCircleFill: document.querySelector('.progress-circle-fill'),
  contactForm: document.getElementById('clientForm'),
  dynamicFieldContainer: document.querySelector('.dynamic-fields'),
  testimonialItems: document.querySelectorAll('.testimonial-item'),
  skillElements: document.querySelectorAll('.skill'),
  newsletterModal: null,
  newsletterForm: null,
  newsletterSuccess: null,
  closeNewsletter: null,
  newsletterTimer: null
};

// ======================
// Utility Functions
// ======================
const utils = {
  setCurrentYear: () => {
    if (elements.year) elements.year.textContent = new Date().getFullYear();
  },

  trackEvent: (category, action, label) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, { event_category: category, event_label: label });
    }
  },

  createSuccessToast: () => {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-check-circle"></i>
        <span>Message sent successfully! I'll get back to you soon.</span>
      </div>
      <div class="toast-progress"></div>
    `;
    document.body.appendChild(toast);
    return toast;
  },

  showSuccessToast: (toastElement) => {
    const existingToasts = document.querySelectorAll('.success-toast');
    existingToasts.forEach(toast => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    });
    
    setTimeout(() => {
      toastElement.classList.add('show');
      
      const progressBar = toastElement.querySelector('.toast-progress');
      if (progressBar) {
        progressBar.style.width = '100%';
      }
    }, 50);

    setTimeout(() => {
      toastElement.classList.remove('show');
      setTimeout(() => toastElement.remove(), 500);
    }, 10000);
  }
};

// ======================
// Cursor Control
// ======================
const cursor = {
  init: () => {
    if (!elements.cursor || !elements.cursorFollower) return;

    elements.cursor.style.display = 'none';
    elements.cursorFollower.style.display = 'none';

    document.addEventListener('mousemove', cursor.handleMouseMove);

    const hoverElements = document.querySelectorAll(
      'a, button, .work-item, input, textarea, select, .social-icon'
    );
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', cursor.handleHoverEnter);
      el.addEventListener('mouseleave', cursor.handleHoverLeave);
    });
  },

  handleMouseMove: (e) => {
    elements.cursor.style.display = 'block';
    elements.cursorFollower.style.display = 'block';
    elements.cursor.style.left = `${e.clientX}px`;
    elements.cursor.style.top = `${e.clientY}px`;
    elements.cursorFollower.style.left = `${e.clientX}px`;
    elements.cursorFollower.style.top = `${e.clientY}px`;
  },

  handleHoverEnter: () => {
    elements.cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
    elements.cursor.style.backgroundColor = 'rgba(161, 141, 8, 0.9)';
    elements.cursor.style.borderColor = 'var(--dark)';
    elements.cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
    elements.cursorFollower.style.borderColor = 'var(--primary)';
  },

  handleHoverLeave: () => {
    elements.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    elements.cursor.style.backgroundColor = 'rgba(160, 139, 6, 0.8)';
    elements.cursor.style.borderColor = 'var(--dark)';
    elements.cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
  }
};

// ======================
// Navigation
// ======================
const navigation = {
  init: () => {
    if (elements.menuToggle) {
      elements.menuToggle.addEventListener('click', navigation.toggleMenu);
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', navigation.handleNavLinkClick);
    });

    document.querySelectorAll('a[href*="resume.pdf"]').forEach(link => {
      link.addEventListener('click', navigation.trackResumeDownload);
    });
  },

  toggleMenu: function() {
    this.classList.toggle('active');
    elements.navLinks.classList.toggle('active');
  },

  handleNavLinkClick: (e) => {
    if (!e.currentTarget.href.includes('resume.pdf')) {
      e.preventDefault();
      const target = document.querySelector(e.currentTarget.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
    elements.navLinks.classList.remove('active');
    document.querySelector('.menu-toggle').classList.remove('active');
  },

  trackResumeDownload: function() {
    utils.trackEvent('PDF', 'download', this.getAttribute('download'));
    const downloadCount = parseInt(localStorage.getItem('resumeDownloads') || 0) + 1;
    localStorage.setItem('resumeDownloads', downloadCount);
  }
};

// ======================
// Scroll Effects
// ======================
const scrollEffects = {
  init: () => {
    if (elements.progressBar) {
      window.addEventListener('scroll', scrollEffects.updateProgressBar);
    }

    if (elements.scrollToTopBtn && elements.progressCircleFill) {
      elements.scrollToTopBtn.classList.add('visible');
      window.addEventListener('scroll', scrollEffects.updateScrollProgress);
      elements.scrollToTopBtn.addEventListener('click', scrollEffects.scrollToTop);
    }

    scrollEffects.setupIntersectionObserver();
  },

  updateProgressBar: () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    elements.progressBar.style.width = scrollProgress + '%';
  },

  updateScrollProgress: () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    const offset = 126 - (126 * scrollProgress / 100);
    elements.progressCircleFill.style.strokeDashoffset = offset;
  },

  scrollToTop: () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  setupIntersectionObserver: () => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => {
      observer.observe(section);
    });
  }
};

// ======================
// Form Handling
// ======================
const formHandler = {
  fieldTemplates: {
    'Project Inquiry': `
      <div class="form-group">
        <label for="projectType">Project Type</label>
        <select id="projectType" name="projectType" required>
          <option value="">Select project type</option>
          <option value="Website Development">Website Development</option>
          <option value="Web Application">Web Application</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label for="budget">Project Budget (USD)</label>
        <select id="budget" name="budget" required>
          <option value="">Select budget range</option>
          <option value="300-500">$300 - $500</option>
          <option value="500-1000">$500 - $1,000</option>
          <option value="1000-5000">$1,000 - $5,000</option>
          <option value="5000+">$5,000+</option>
          <option value="undecided">Undecided</option>
        </select>
      </div>
      <div class="form-group">
        <label for="timeline">Project Timeline</label>
        <select id="timeline" name="timeline" required>
          <option value="">Select timeline</option>
          <option value="1-2 weeks">1-2 weeks</option>
          <option value="1 month">1 month</option>
          <option value="2-3 months">2-3 months</option>
          <option value="3+ months">3+ months</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>
    `,
    'Job Opportunity': `
      <div class="form-group">
        <label for="position">Position Type</label>
        <select id="position" name="position" required>
          <option value="">Select position type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
          <option value="Internship">Internship</option>
        </select>
      </div>
      <div class="form-group">
        <label for="company">Company Name</label>
        <input type="text" id="company" name="company" placeholder="Your company name" required>
      </div>
    `,
    'Collaboration': `
      <div class="form-group">
        <label for="collabType">Collaboration Type</label>
        <select id="collabType" name="collabType" required>
          <option value="">Select collaboration type</option>
          <option value="Open Source">Open Source Project</option>
          <option value="Design Partnership">Design Partnership</option>
          <option value="Development Partnership">Development Partnership</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label for="collabDetails">Collaboration Details</label>
        <textarea id="collabDetails" name="collabDetails" placeholder="Tell me more about the collaboration..." required></textarea>
      </div>
    `,
    'Other': `
      <div class="form-group">
        <label for="otherDetails">Please specify</label>
        <input type="text" id="otherDetails" name="otherDetails" placeholder="What would you like to discuss?" required>
      </div>
    `
  },

  init: () => {
    if (!elements.contactForm) return;

    const subjectField = elements.contactForm.querySelector('#subject');
    if (subjectField) {
      subjectField.addEventListener('change', formHandler.updateDynamicFields);
    }

    elements.contactForm.addEventListener('submit', formHandler.handleSubmit);
    formHandler.setupValidation();
  },

  updateDynamicFields: function() {
    elements.dynamicFieldContainer.innerHTML = '';
    if (formHandler.fieldTemplates[this.value]) {
      elements.dynamicFieldContainer.innerHTML = formHandler.fieldTemplates[this.value];
    }
  },

  setupValidation: () => {
    const fields = {
      name: { element: elements.contactForm.querySelector('#name'), errorId: 'nameError', validator: formHandler.validateName },
      email: { element: elements.contactForm.querySelector('#email'), errorId: 'emailError', validator: formHandler.validateEmail },
      phone: { element: elements.contactForm.querySelector('#phone'), errorId: 'phoneError', validator: formHandler.validatePhone },
      message: { element: elements.contactForm.querySelector('#message'), errorId: 'messageError', validator: formHandler.validateMessage },
      subject: { element: elements.contactForm.querySelector('#subject'), errorId: 'subjectError', validator: formHandler.validateSubject }
    };

    Object.values(fields).forEach(({ element, errorId, validator }) => {
      if (element) {
        element.addEventListener('blur', () => formHandler.validateField(element, errorId, validator));
        element.addEventListener('input', () => formHandler.validateField(element, errorId, validator));
      }
    });
  },

  validateAllFields: () => {
    const fields = [
      { element: elements.contactForm.querySelector('#name'), errorId: 'nameError', validator: formHandler.validateName },
      { element: elements.contactForm.querySelector('#email'), errorId: 'emailError', validator: formHandler.validateEmail },
      { element: elements.contactForm.querySelector('#phone'), errorId: 'phoneError', validator: formHandler.validatePhone },
      { element: elements.contactForm.querySelector('#message'), errorId: 'messageError', validator: formHandler.validateMessage },
      { element: elements.contactForm.querySelector('#subject'), errorId: 'subjectError', validator: formHandler.validateSubject }
    ];

    let isValid = true;
    fields.forEach(({ element, errorId, validator }) => {
      if (!formHandler.validateField(element, errorId, validator)) {
        isValid = false;
      }
    });

    if (!isValid) {
      const firstError = document.querySelector('.invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }

    return isValid;
  },

  validateField: (field, errorId, validationFn) => {
    const errorElement = document.getElementById(errorId);
    const isValid = validationFn(field.value);
    
    if (!isValid) {
      field.classList.add('invalid');
      field.classList.remove('valid');
      return false;
    } else {
      field.classList.remove('invalid');
      field.classList.add('valid');
      if (errorElement) errorElement.textContent = '';
      return true;
    }
  },

  validateName: (value) => {
    if (value.trim().length < 2) {
      document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
      return false;
    }
    return true;
  },

  validateEmail: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      document.getElementById('emailError').textContent = 'Please enter a valid email address';
      return false;
    }
    return true;
  },

  validatePhone: (value) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(value)) {
      document.getElementById('phoneError').textContent = 'Please enter 10-15 digit phone number';
      return false;
    }
    return true;
  },

  validateMessage: (value) => {
    if (value.trim().length < 20) {
      document.getElementById('messageError').textContent = 'Message should be at least 20 characters';
      return false;
    }
    return true;
  },

  validateSubject: (value) => {
    if (!value) {
      document.getElementById('subjectError').textContent = 'Please select a subject';
      return false;
    }
    return true;
  },

  handleSubmit: async function(e) {
    e.preventDefault();
    
    if (!formHandler.validateAllFields()) return;

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
    submitBtn.querySelector('.spinner').classList.remove('hidden');

    try {
      const formData = {
        name: this.name.value,
        email: this.email.value,
        phone: this.phone.value,
        message: this.message.value,
        subject: this.subject.value,
        timestamp: new Date()
      };

      this.querySelectorAll('.dynamic-fields input, .dynamic-fields select, .dynamic-fields textarea').forEach(field => {
        formData[field.name] = field.value;
      });

      await addDoc(collection(db, "submissions"), formData);
      utils.trackEvent('Contact', 'submit', 'Portfolio Form');
      
      const successToast = utils.createSuccessToast();
      utils.showSuccessToast(successToast);
      
      this.reset();
      elements.dynamicFieldContainer.innerHTML = '';
      
      this.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
        field.classList.remove('valid', 'invalid');
      });

    } catch (error) {
      console.error("Error saving message:", error);
      alert("Failed to send message. Please email me directly at ovenserisosa@gmail.com");
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      submitBtn.querySelector('.spinner').classList.add('hidden');
    }
  }
};

// ======================
// Ripple Effects
// ======================
const rippleEffects = {
  init: () => {
    document.querySelectorAll('.hero-btn, .resume-btn, .submit-btn').forEach(btn => {
      btn.addEventListener('click', rippleEffects.createRipple);
    });
  },

  createRipple: function(e) {
    const x = e.clientX - e.target.getBoundingClientRect().left;
    const y = e.clientY - e.target.getBoundingClientRect().top;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
};

// ======================
// Video Background
// ======================
const videoBackground = {
  init: () => {
    if (!elements.videoBg) return;
    
    elements.videoBg.playbackRate = 0.7;
    elements.videoBg.addEventListener('error', videoBackground.handleVideoError);
  },

  handleVideoError: () => {
    document.body.style.background = 'radial-gradient(circle, #2a0845 0%, #1a0630 100%)';
  }
};

// ======================
// Testimonials
// ======================
const testimonials = {
  init: () => {
    elements.testimonialItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.1}s`;
    });
  }
};

// ======================
// Skills Initialization
// ======================
const skills = {
  init: () => {
    elements.skillElements.forEach(skill => {
      const level = skill.getAttribute('data-level');
      skill.style.setProperty('--skill-level', `${level}%`);
    });
  }
};

// ======================
// Newsletter Functionality
// ======================
const newsletter = {
  init: () => {
    // Initialize newsletter elements
    newsletter.createModal();
    
    elements.newsletterModal = document.getElementById('newsletterModal');
    elements.newsletterForm = document.getElementById('newsletterForm');
    elements.newsletterSuccess = document.querySelector('.newsletter-success');
    elements.closeNewsletter = document.querySelector('.close-newsletter');

    // Set up event listeners
    if (elements.closeNewsletter) {
      elements.closeNewsletter.addEventListener('click', newsletter.closeModal);
    }

    if (elements.newsletterForm) {
      elements.newsletterForm.addEventListener('submit', newsletter.handleSubmit);
    }

    // Only show newsletter if user hasn't subscribed
    if (!localStorage.getItem('newsletterSubscribed')) {
      newsletter.startTimer();
    }
  },

  createModal: () => {
    const modalHTML = `
      <div id="newsletterModal" class="newsletter-modal">
        <div class="newsletter-content">
          <button class="close-newsletter" aria-label="Close Newsletter">
            <i class="fas fa-times"></i>
          </button>
          <div class="newsletter-header">
            <h3>Stay Updated</h3>
            <p>I write about tech, fitness, and I also analyze real-world events in real time.
            Subscribe to get free updates.</p>
          </div>
          <form id="newsletterForm" class="newsletter-form">
            <div class="form-group">
              <input type="email" id="newsletterEmail" placeholder="Your best email" required>
              <span class="error-message" id="newsletterError"></span>
            </div>
            <button type="submit" class="submit-btn btn-ripple">
              <span class="btn-text">Subscribe</span>
              <div class="spinner hidden"></div>
            </button>
          </form>
          <div class="newsletter-success">
            <i class="fas fa-check-circle"></i>
            <span>Thanks for subscribing! You'll hear from me soon.</span>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  },

  startTimer: () => {
    elements.newsletterTimer = setTimeout(() => {
      newsletter.showModal();
    }, 30000); // 30 seconds
  },

  showModal: () => {
    if (elements.newsletterModal) {
      elements.newsletterModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal: () => {
    if (elements.newsletterModal) {
      elements.newsletterModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  handleSubmit: async function(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('#newsletterEmail');
    const errorElement = document.getElementById('newsletterError');
    const submitBtn = this.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    // Validate email
    if (!newsletter.validateEmail(emailInput.value)) {
      errorElement.textContent = 'Please enter a valid email address';
      emailInput.classList.add('invalid');
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Subscribing...';
    spinner.classList.remove('hidden');
    
    try {
      // Save to Firebase
      await addDoc(collection(db, "newsletterSubscribers"), {
        email: emailInput.value,
        timestamp: new Date(),
        source: "Portfolio Website"
      });
      
      // Track the subscription
      utils.trackEvent('Newsletter', 'subscribe', 'Modal');
      
      // Store in localStorage to prevent showing again
      localStorage.setItem('newsletterSubscribed', 'true');
      localStorage.setItem('subscriberEmail', emailInput.value);
      
      // Hide form and show success message
      this.style.display = 'none';
      elements.newsletterSuccess.style.display = 'flex';
      
      // Close modal after 5 seconds
      setTimeout(() => {
        newsletter.closeModal();
      }, 5000);
      
    } catch (error) {
      console.error("Error saving subscriber:", error);
      errorElement.textContent = "Subscription failed. Please try again later.";
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Subscribe';
      spinner.classList.add('hidden');
    }
  }
};

// ======================
// Initialize Everything
// ======================
document.addEventListener('DOMContentLoaded', () => {
  utils.setCurrentYear();
  cursor.init();
  navigation.init();
  scrollEffects.init();
  formHandler.init();
  rippleEffects.init();
  videoBackground.init();
  testimonials.init();
  skills.init();
  newsletter.init();
});

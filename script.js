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
  newsletterModal: document.getElementById('newsletterModal'),
  newsletterForm: document.querySelector('.newsletter-form'),
  closeNewsletter: document.querySelector('.close-newsletter')
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

  createSuccessToast: (message = 'Message sent successfully! I\'ll get back to you soon.') => {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
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
    }, 7000); // Changed from 10000 to 7000 for form messages
  },

  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  showError: (element, message) => {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = message;
      element.classList.add('invalid');
      element.classList.remove('valid');
    }
  },

  clearError: (element) => {
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = '';
      element.classList.remove('invalid');
      element.classList.add('valid');
    }
  }
};

// ======================
// Newsletter Handling
// ======================
const newsletter = {
    init: () => {
      if (!elements.newsletterModal || !elements.newsletterForm) return;
  
      // Show modal after delay
      setTimeout(() => {
        if (!sessionStorage.getItem('newsletterShown')) {
          newsletter.showModal();
          sessionStorage.setItem('newsletterShown', 'true');
        }
      }, 30000);
  
      // Only allow closing via the close button
      elements.closeNewsletter.addEventListener('click', newsletter.hideModal);
  
      // Form submission handler
      elements.newsletterForm.addEventListener('submit', newsletter.handleSubmit);
    },
  
    showModal: () => {
      elements.newsletterModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        elements.newsletterModal.style.opacity = '1';
      }, 10);
    },
  
    hideModal: () => {
      elements.newsletterModal.style.opacity = '0';
      setTimeout(() => {
        elements.newsletterModal.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    },
  
    handleSubmit: async (e) => {
      e.preventDefault();
      const emailInput = e.target.querySelector('input[type="email"]');
      
      if (newsletter.validateEmail(emailInput)) {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
  
        try {
          await addDoc(collection(db, "newsletterSubscribers"), {
            email: emailInput.value.trim(),
            timestamp: new Date()
          });
          
          const toast = utils.createSuccessToast('Thanks for subscribing!');
          utils.showSuccessToast(toast);
          e.target.reset();
          
          // Auto-close after 4 seconds
          setTimeout(() => {
            newsletter.hideModal();
          }, 4000);
          
        } catch (error) {
          console.error("Error saving subscriber:", error);
          const toast = utils.createSuccessToast('Subscription failed. Please try again.');
          utils.showSuccessToast(toast);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Subscribe';
        }
      }
    },
  
    validateEmail: (input) => {
      const email = input.value.trim();
      if (!email) {
        utils.showError(input, 'Email is required');
        return false;
      }
      if (!utils.validateEmail(email)) {
        utils.showError(input, 'Please enter a valid email');
        return false;
      }
      utils.clearError(input);
      return true;
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
      formHandler.setupValidation();
    }
  },

  setupValidation: () => {
    const fields = [
      { id: 'name', validator: formHandler.validateName },
      { id: 'email', validator: formHandler.validateEmail },
      { id: 'phone', validator: formHandler.validatePhone },
      { id: 'message', validator: formHandler.validateMessage },
      { id: 'subject', validator: formHandler.validateSubject },
      { id: 'projectType', validator: formHandler.validateRequired },
      { id: 'budget', validator: formHandler.validateRequired },
      { id: 'timeline', validator: formHandler.validateRequired },
      { id: 'position', validator: formHandler.validateRequired },
      { id: 'company', validator: formHandler.validateRequired },
      { id: 'collabType', validator: formHandler.validateRequired },
      { id: 'collabDetails', validator: formHandler.validateRequired },
      { id: 'otherDetails', validator: formHandler.validateRequired }
    ];

    fields.forEach(({ id, validator }) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('blur', () => validator(element));
        element.addEventListener('input', () => {
          if (element.value.trim() === '') {
            utils.clearError(element);
          }
        });
      }
    });
  },

  validateAllFields: () => {
    let isValid = true;
    
    if (!formHandler.validateName(document.getElementById('name'))) isValid = false;
    if (!formHandler.validateEmail(document.getElementById('email'))) isValid = false;
    if (!formHandler.validatePhone(document.getElementById('phone'))) isValid = false;
    if (!formHandler.validateMessage(document.getElementById('message'))) isValid = false;
    if (!formHandler.validateSubject(document.getElementById('subject'))) isValid = false;
    
    const subject = document.getElementById('subject').value;
    if (subject === 'Project Inquiry') {
      if (!formHandler.validateRequired(document.getElementById('projectType'))) isValid = false;
      if (!formHandler.validateRequired(document.getElementById('budget'))) isValid = false;
      if (!formHandler.validateRequired(document.getElementById('timeline'))) isValid = false;
    } else if (subject === 'Job Opportunity') {
      if (!formHandler.validateRequired(document.getElementById('position'))) isValid = false;
      if (!formHandler.validateRequired(document.getElementById('company'))) isValid = false;
    } else if (subject === 'Collaboration') {
      if (!formHandler.validateRequired(document.getElementById('collabType'))) isValid = false;
      if (!formHandler.validateRequired(document.getElementById('collabDetails'))) isValid = false;
    } else if (subject === 'Other') {
      if (!formHandler.validateRequired(document.getElementById('otherDetails'))) isValid = false;
    }

    if (!isValid) {
      const firstError = document.querySelector('.invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }

    return isValid;
  },

  validateName: (element) => {
    const value = element.value.trim();
    if (value.length < 2) {
      utils.showError(element, 'Name must be at least 2 characters');
      return false;
    }
    utils.clearError(element);
    return true;
  },

  validateEmail: (element) => {
    const value = element.value.trim();
    if (value === '') {
      utils.showError(element, 'Email is required');
      return false;
    }
    if (!utils.validateEmail(value)) {
      utils.showError(element, 'Please enter a valid email address');
      return false;
    }
    utils.clearError(element);
    return true;
  },

  validatePhone: (element) => {
    const value = element.value.trim();
    const phoneRegex = /^[0-9]{10,15}$/;
    if (value === '') {
      utils.showError(element, 'Phone number is required');
      return false;
    }
    if (!phoneRegex.test(value)) {
      utils.showError(element, 'Please enter 10-15 digit phone number');
      return false;
    }
    utils.clearError(element);
    return true;
  },

  validateMessage: (element) => {
    const value = element.value.trim();
    if (value.length < 20) {
      utils.showError(element, 'Message should be at least 20 characters');
      return false;
    }
    utils.clearError(element);
    return true;
  },

  validateSubject: (element) => {
    const value = element.value;
    if (!value) {
      utils.showError(element, 'Please select a subject');
      return false;
    }
    utils.clearError(element);
    return true;
  },

  validateRequired: (element) => {
    if (!element) return true;
    
    const value = element.value;
    if (element.tagName === 'SELECT' && !value) {
      utils.showError(element, 'This field is required');
      return false;
    }
    if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && value.trim() === '') {
      utils.showError(element, 'This field is required');
      return false;
    }
    utils.clearError(element);
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

      const subject = this.subject.value;
      if (subject === 'Project Inquiry') {
        formData.projectType = this.projectType.value;
        formData.budget = this.budget.value;
        formData.timeline = this.timeline.value;
      } else if (subject === 'Job Opportunity') {
        formData.position = this.position.value;
        formData.company = this.company.value;
      } else if (subject === 'Collaboration') {
        formData.collabType = this.collabType.value;
        formData.collabDetails = this.collabDetails.value;
      } else if (subject === 'Other') {
        formData.otherDetails = this.otherDetails.value;
      }

      await addDoc(collection(db, "submissions"), formData);
      utils.trackEvent('Contact', 'submit', 'Portfolio Form');
      
      const successToast = utils.createSuccessToast();
      utils.showSuccessToast(successToast);
      
      this.reset();
      elements.dynamicFieldContainer.innerHTML = '';
      
      this.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
        field.classList.remove('valid', 'invalid');
      });

      // Show success message for 7 seconds
      const successElement = document.getElementById('formSuccess');
      if (successElement) {
        successElement.style.display = 'block';
        setTimeout(() => {
          successElement.style.display = 'none';
        }, 7000);
      }

    } catch (error) {
      console.error("Error saving message:", error);
      const toast = utils.createSuccessToast("Failed to send message. Please email me directly at ovenserisosa@gmail.com");
      utils.showSuccessToast(toast);
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
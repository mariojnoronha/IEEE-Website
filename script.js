AOS.init();

// Show the navbar after the DOM is fully loaded
window.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    navbar.classList.remove('hidden');
    navbar.classList.add('visible');
});


// Fade in/Out on scroll for mission-text
let lastScrollY = window.scrollY;
    let direction = "down";

window.addEventListener("scroll", () => {
    let currentScrollY = window.scrollY;
    direction = currentScrollY > lastScrollY ? "down" : "up";
    lastScrollY = currentScrollY;
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    const target = entry.target;
    if (entry.isIntersecting) {
        if (direction === "down") {
        target.classList.add("fade-in-down-start", "fade-in-down");
        } else {
        target.classList.remove("fade-in-down-start");
        target.classList.add("fade-in-up");
        }
    } else {
        // Reset to fade again if needed
        target.classList.remove("fade-in-down", "fade-in-up", "fade-in-down-start");
    }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.fade-text').forEach(el => observer.observe(el));

const lines = document.querySelectorAll('.separator-line');

//fade in/Out on scroll for separator line
const observer_2 = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    } else {
    entry.target.classList.remove('visible');
    }
});
}, {
threshold: 0.3
});

lines.forEach(line => observer_2.observe(line))




// Mobile menu toggle
const menu = document.querySelector('#mobile_menu');
const menuLinks = document.querySelector('.navbar_menu');
const navlink = document.querySelectorAll('.navbar_links')

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

navlink.forEach(link => {
    link.addEventListener('click', function() {
        menu.classList.remove('is-active');
        menuLinks.classList.remove('active');
    });
});

// Custom cursor functionality
const cursor = document.getElementById('customCursor');
const trails = [];
const maxTrails = 6;

let mouseX = 0;
let mouseY = 0;

// Create trail elements
for (let i = 0; i < maxTrails; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.opacity = (maxTrails - i) / maxTrails * 0.4;
    document.body.appendChild(trail);
    trails.push({
        element: trail,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    });
}

// Throttled mouse movement tracking
let ticking = false;
document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!ticking) {
        requestAnimationFrame(() => {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            ticking = false;
        });
        ticking = true;
    }
});

// Trail animation with smooth following
function animateTrail() {
    // Update first trail position
    trails[0].targetX = mouseX;
    trails[0].targetY = mouseY;
    
    // Smooth following for trail elements
    trails.forEach((trail, index) => {
        if (index > 0) {
            const prev = trails[index - 1];
            trail.targetX = prev.x;
            trail.targetY = prev.y;
        }
        
        // Smooth interpolation
        trail.x += (trail.targetX - trail.x) * 0.2;
        trail.y += (trail.targetY - trail.y) * 0.2;
        
        // Position trail elements
        trail.element.style.left = trail.x + 'px';
        trail.element.style.top = trail.y + 'px';
    });
    
    requestAnimationFrame(animateTrail);
}
animateTrail();

// Hover effects for different elements
document.querySelectorAll('a, button, .member, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover-glow');
        cursor.classList.remove('text-hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover-glow');
        cursor.classList.remove('text-hover');
    });
});

// Text hover effect
document.querySelectorAll('h1, h2, h3, p, span').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('text-hover');
        cursor.classList.remove('hover-glow');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('text-hover');
        cursor.classList.remove('hover-glow');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

{
    const nav = document.querySelector(".navbar");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        if (lastScrollY < window.scrollY) {
        nav.classList.add("nav--hidden");
        nav.classList.remove("visible");
        } else {
        nav.classList.remove("nav--hidden");
        }

        lastScrollY = window.scrollY;
    });
}

// Contact form message handling


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-button');

    if (!form || !btn) return;

    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');

    if (success === 'true') {
        showMessage('Message sent successfully! We will get back to you soon.', 'success');
    } else if (error === 'config') {
        showMessage('Server configuration error. Please try again later.', 'error');
    } else if (error === 'send') {
        showMessage('Failed to send message. Please try again later.', 'error');
    }

    form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const parms = {
        f_name: document.getElementById("firstName").value,
        l_name: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    btn.value = 'Sending...';
    btn.disabled = true;

    try {
        const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parms)
        });

        const result = await res.json();
        btn.value = 'Send';
        btn.disabled = false;

        if (res.ok) {
        showMessage('Message sent successfully! We will get back to you soon.', 'success');
        form.reset();
        } else {
        throw new Error(result.message || 'Unknown error');
        }
    } catch (err) {
        console.error('Error:', err);
        btn.value = 'Send';
        btn.disabled = false;
        showMessage('Failed to send message. Please try again later.', 'error');
    }
    });

    function showMessage(message, type) {
        const existing = document.querySelector('.form-message');
        if (existing) existing.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
        messageDiv.textContent = message;

        form.parentNode.insertBefore(messageDiv, form);

        // Fade out after 3 seconds, remove after 4 seconds
        setTimeout(() => {
            messageDiv.classList.add('fade-out');
        }, 3000);

        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    }
});

// const btn = document.getElementById('submit-button');

// document.getElementById('contact-form')
//     .addEventListener('submit', function(event) {
//         let parms = {
//         f_name: document.getElementById("firstName").value,
//         l_name: document.getElementById("lastName").value,
//         email: document.getElementById("email").value,
//         message: document.getElementById("message").value
//     }
//     event.preventDefault();

//     btn.value = 'Sending...';

//     const serviceID = 'default_service';
//     const templateID = 'template_yoc8spi';

//     emailjs.send(serviceID, templateID, parms, this)
//         .then(() => {
//         btn.value = 'Send';
//         alert('Sent!');
//         }, (err) => {
//         btn.value = 'Send';
//         alert(JSON.stringify(err));
//         });
// });



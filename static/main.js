(function ($) {
    "use strict";

    // Loader with fade effect
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();

    // Initiate the wowjs with custom settings - faster animations
    new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 80,
        mobile: true,
        live: true,
        duration: '0.6s'
    }).init();

    // Smooth parallax effect with requestAnimationFrame for better performance
    let ticking = false;
    let lastScrollY = 0;

    function updateParallax() {
        const scrolled = lastScrollY;
        const heroElement = $('.hero');

        if (heroElement.length && scrolled < 800) {
            heroElement.css({
                'transform': 'translate3d(0, ' + (scrolled * 0.3) + 'px, 0)',
                'opacity': Math.max(0, 1 - (scrolled / 700))
            });
        }
        ticking = false;
    }

    $(window).on('scroll', function () {
        lastScrollY = window.pageYOffset;

        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Add floating animation to skill bars
    $('.progress-bar').each(function (index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn(300);
        } else {
            $('.back-to-top').fadeOut(300);
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 800, 'easeInOutExpo');
        return false;
    });

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });

    // Smooth scrolling on the navbar links
    $(".navbar-nav a, a[href^='#']").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();

            var target = $(this.hash);
            if (target.length) {
                var navbarHeight = $('.navbar').outerHeight();
                var targetOffset = target.offset().top - navbarHeight - 10;

                $('html, body').animate({
                    scrollTop: targetOffset
                }, 600, 'easeInOutExpo');

                if ($(this).parents('.navbar-nav').length) {
                    $('.navbar-nav .active').removeClass('active');
                    $(this).closest('a').addClass('active');
                }

                // Collapse mobile navbar after click
                if ($('.navbar-toggler').is(':visible')) {
                    $('.navbar-collapse').collapse('hide');
                }
            }
        }
    });

    // Typed Initiate
    $(document).ready(function () {
        var typedTextElements = $('.hero .hero-text .typed-text');

        if (typedTextElements.length === 1) {
            var typed_strings = typedTextElements.text();
            var typed = new Typed('.hero .hero-text h2', {
                strings: typed_strings.split(', '),
                typeSpeed: 100,
                backSpeed: 20,
                smartBackspace: false,
                loop: true
            });
        }
    });


    // Skills
    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });

    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        center: true,
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0: {
                items: 1
            }
        }
    });

    // Portfolio filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-filter li').on('click', function () {
        $("#portfolio-filter li").removeClass('filter-active');
        $(this).addClass('filter-active');
        portfolioIsotope.isotope({ filter: $(this).data('filter') });
    });

})(jQuery);

class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            closeButton: document.querySelector('.chatbox__close--header')
        };
        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton, closeButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        // Add close button functionality
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeChat(chatBox));
        }

        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });

        // Auto-start chatbot with welcome message
        this.initializeChatbot(chatBox);
    }

    initializeChatbot(chatbox) {
        // Wait a brief moment for the page to fully load, then send greeting in background
        setTimeout(() => {
            // Don't auto-open the chatbox, keep it minimized (state = false)
            // Just send the initial greeting in the background
            this.sendInitialGreeting(chatbox);
        }, 1000); // 1 second delay for smooth page load
    }

    sendInitialGreeting(chatbox) {
        // Simulate sending "hi" message automatically
        const greetingText = "hi";
        let msg1 = { name: "User", message: greetingText };
        this.messages.push(msg1);
        this.updateChatText(chatbox);

        // Fetch response from server
        fetch('/chat', {
            method: 'POST',
            body: JSON.stringify({ message: greetingText }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "J.A.I.D", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox);
            }).catch((error) => {
                console.error('Error:', error);
                // Add fallback welcome message if server fails
                let fallbackMsg = {
                    name: "J.A.I.D",
                    message: "Hi! I'm J.A.I.D, Jeevan's AI assistant. How can I help you today?"
                };
                this.messages.push(fallbackMsg);
                this.updateChatText(chatbox);
            })
            .then(r => this.removeTypingIndicator(chatbox));
    }

    toggleState(chatbox) {
        this.state = !this.state;
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    closeChat(chatbox) {
        // Close the chatbox
        this.state = false;
        chatbox.classList.remove('chatbox--active');
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }
        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);
        this.updateChatText(chatbox);
        textField.value = '';

        fetch('/chat', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "J.A.I.D", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox);
                textField.value = '';
            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox);
                textField.value = '';
            })
            .then(r => this.removeTypingIndicator(chatbox));
    }

    removeTypingIndicator(chatbox) {
        var element = document.getElementById("typing-system");
        if (element) {
            element.remove();
        }
    }

    updateChatText(chatbox) {
        var html = '';
        var isTypingIndicatorAdded = false; // Flag to track if the typing indicator is added

        this.messages.slice().reverse().forEach(function (item, index) {
            // Escape HTML to prevent XSS
            const escapedMessage = escapeHtml(item.message);

            if (item.name === "J.A.I.D") {

                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                if (!isTypingIndicatorAdded) {
                    html += '<div id="typing-system-container" class="messages__item messages__item--visitor">';
                    html += '<svg id="typing-system" height="40" width="40" class="loader">';
                    html += '<circle class="dot dot1" cx="10" cy="20" r="3" style="fill:#ED798E;" />';
                    html += '<circle class="dot dot2" cx="20" cy="20" r="3" style="fill:#EEB575;" />';
                    html += '<circle class="dot dot3" cx="30" cy="20" r="3" style="fill:#6963B1;" />';
                    html += '</svg>';
                    html += '</div>';
                    isTypingIndicatorAdded = true;
                }
                html += '<div class="messages__item messages__item--operator">' + linkify(escapedMessage) + '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

function escapeHtml(html) {
    var text = document.createTextNode(html);
    var div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}

function linkify(message) {
    // Replace URLs, email addresses, and phone numbers with clickable links and mentions
    message = message.replace(/(https?:\/\/[^\s]+)/g, function (url) {
        return '<a href="' + url + '" target="_blank" class="contact-chatbot">' + getLinkMention(url) + '</a>';
    });

    message = message.replace(/(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g, function (email) {
        return '<a href="mailto:' + email + '" class="contact-chatbot">' + email + '</a>';
    });

    message = message.replace(/(\b\d{10,}\b)/g, function (phoneNumber) {
        return '<a href="tel:+91' + phoneNumber + '" class="contact-chatbot">' + '(+91)' + phoneNumber + '</a>';
    });

    message = message.replace(" form ", function (form) {
        return '<a href="#contact" class="contact-chatbot">' + form + '</a>';
    });

    return message;
}

function getLinkMention(url) {
    // Add logic to determine the mention based on the URL
    if (url.includes('linkedin.com')) {
        return 'Linkedin Profile';
    } else if (url.includes('Jeevan-HM/AI-podcast')) {
        return 'AI Podcast';
    } else if (url.includes('Jeevan-HM/FinBot')) {
        return 'FinBot';
    } else if (url.includes('Jeevan-HM/Health-Analyzing-Service')) {
        return 'Health Analyzing Service';
    } else if (url.includes('Jeevan-HM/Automated-Shopping-Cart')) {
        return 'Automated Shopping Cart';
    } else if (url.includes('github.com/Jeevan-HM')) {
        return 'Github Profile';
    } else if (url.includes('twitter.com')) {
        return 'Twitter Profile';
    } else if (url.includes('publication/362900257_Automated_Shopping_Cart')) {
        return 'Automated Shopping Cart';
    } else if (url.includes('publication/370410962_SMART_HEALTH_MONITORING_AND_ANALYZING_SERVICE')) {
        return 'Health Analyzing Service';
    }
    else {
        return url;
    }
}

const chatbox = new Chatbox();
chatbox.display();

// Section-based cursor system
(function () {
    const sections = [
        { id: 'home', class: 'cursor-home' },
        { id: 'about', class: 'cursor-about' },
        { id: 'skills', class: 'cursor-skills' },
        { id: 'experience', class: 'cursor-experience' },
        { id: 'volunteering', class: 'cursor-volunteering' },
        { id: 'portfolio', class: 'cursor-portfolio' },
        { id: 'publications', class: 'cursor-publications' },
        { id: 'review', class: 'cursor-review' },
        { id: 'blog', class: 'cursor-blog' },
        { id: 'contact', class: 'cursor-contact' }
    ];

    let currentSection = 'home';
    let ticking = false;

    function updateCursor() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i].id);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    if (currentSection !== sections[i].id) {
                        currentSection = sections[i].id;

                        // Remove all cursor classes
                        sections.forEach(s => {
                            document.body.classList.remove(s.class);
                        });

                        // Add the new cursor class
                        document.body.classList.add(sections[i].class);

                        // Add a subtle pulse animation to cursor change
                        document.body.style.transition = 'cursor 0.3s ease';
                    }
                    break;
                }
            }
        }

        ticking = false;
    }

    function requestCursorUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateCursor);
            ticking = true;
        }
    }

    // Initialize cursor on page load
    updateCursor();

    // Update cursor on scroll
    window.addEventListener('scroll', requestCursorUpdate, { passive: true });

    // Update cursor on resize
    window.addEventListener('resize', requestCursorUpdate, { passive: true });

    // Optional: Add visual feedback when cursor changes
    const cursorIndicator = document.createElement('div');
    cursorIndicator.id = 'cursor-indicator';
    cursorIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(129, 140, 248, 0.1);
        backdrop-filter: blur(10px);
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        color: var(--text-primary);
        border: 1px solid rgba(129, 140, 248, 0.3);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 9999;
        text-transform: capitalize;
    `;
    document.body.appendChild(cursorIndicator);

    // Show section name briefly when cursor changes
    let indicatorTimeout;
    const originalUpdateCursor = updateCursor;
    updateCursor = function () {
        const prevSection = currentSection;
        originalUpdateCursor.call(this);

        if (prevSection !== currentSection) {
            cursorIndicator.textContent = currentSection.replace('-', ' ');
            cursorIndicator.style.opacity = '1';

            clearTimeout(indicatorTimeout);
            indicatorTimeout = setTimeout(() => {
                cursorIndicator.style.opacity = '0';
            }, 1500);
        }
    };

    // Cursor trail effect
    const cursorColors = {
        'home': '#818cf8',
        'about': '#10b981',
        'skills': '#f59e0b',
        'experience': '#06b6d4',
        'volunteering': '#ec4899',
        'portfolio': '#a78bfa',
        'publications': '#ef4444',
        'review': '#fbbf24',
        'blog': '#84cc16',
        'contact': '#f472b6'
    };

    const trailDots = [];
    const maxTrailDots = 8;

    // Create trail dots
    for (let i = 0; i < maxTrailDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        document.body.appendChild(dot);
        trailDots.push({
            element: dot,
            x: 0,
            y: 0
        });
    }

    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let moveTimeout;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        isMoving = true;
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
    });

    function animateTrail() {
        if (isMoving) {
            // Update trail dots with delay
            for (let i = trailDots.length - 1; i > 0; i--) {
                trailDots[i].x = trailDots[i - 1].x;
                trailDots[i].y = trailDots[i - 1].y;
            }

            trailDots[0].x = mouseX;
            trailDots[0].y = mouseY;

            // Apply positions and colors
            const currentColor = cursorColors[currentSection] || '#818cf8';
            trailDots.forEach((dot, index) => {
                const scale = 1 - (index / maxTrailDots) * 0.5;
                const opacity = (1 - (index / maxTrailDots)) * 0.6;

                dot.element.style.left = dot.x + 'px';
                dot.element.style.top = dot.y + 'px';
                dot.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
                dot.element.style.background = currentColor;
                dot.element.style.opacity = opacity;
                dot.element.classList.add('active');
            });
        } else {
            // Fade out when not moving
            trailDots.forEach(dot => {
                dot.element.classList.remove('active');
            });
        }

        requestAnimationFrame(animateTrail);
    }

    // Start trail animation
    animateTrail();

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        const currentIndex = sections.findIndex(s => s.id === currentSection);

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentIndex < sections.length - 1) {
                const nextSection = document.getElementById(sections[currentIndex + 1].id);
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                const prevSection = document.getElementById(sections[currentIndex - 1].id);
                if (prevSection) {
                    prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
})();


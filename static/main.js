(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    
    // Initiate the wowjs
    new WOW().init();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
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
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Typed Initiate
    if ($('.hero .hero-text h2').length == 1) {
        var typed_strings = $('.hero .hero-text .typed-text').text();
        var typed = new Typed('.hero .hero-text h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    
    
    // Skills
    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        center: true,
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
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
        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });

    // Chatbot
    document.addEventListener('DOMContentLoaded', function () {
        const chatbotContainer = document.querySelector('.chatbot-container');
        const chatbotButton = document.querySelector('.chatbot-button');
        const closeChatbotButton = document.querySelector('.close-chatbot');

        chatbotButton.addEventListener('click', function () {
            chatbotContainer.classList.toggle('active');
        });

        closeChatbotButton.addEventListener('click', function () {
            chatbotContainer.classList.remove('active');
        });
    });

    // Chatbot response
    function sendMessage() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/hello', true);
        xhr.send();
    }


})(jQuery);


class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button button'), 
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button') 
        };
        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));
        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
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
        console.log("Got element")
        if (element) {
            element.remove();
        }
        console.log("Removed element")
    }    
    updateChatText(chatbox) {
        var html = '';
        var isTypingIndicatorAdded = false; // Flag to track if the typing indicator is added
    
        this.messages.slice().reverse().forEach(function (item, index) {
            // Escape HTML to prevent XSS
            const escapedMessage = escapeHtml(item.message);
    
            if (item.name === "J.A.I.D") {
                html += '<div class="messages__item messages__item--visitor">' + linkify(escapedMessage) + '</div>';
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
        return '<a href="tel:+91' + phoneNumber + '" class="contact-chatbot">' +'(+91)' + phoneNumber + '</a>';
    });

    message = message.replace(" form ", function (form) {
        return '<a href="#contact" class="contact-chatbot">'  + form + '</a>';
    });

    return message;
}




function getLinkMention(url) {
    // Add logic to determine the mention based on the URL
    if (url.includes('linkedin.com')) {
        return 'Linkedin Profile';
    } else if (url.includes('github.com')) {
        // Default mention if no specific mention is defined
        return 'Github Profile';
    } else if (url.includes('twitter.com')) {
        return 'Twitter Profile';
    } else if (url.includes('Automated_Shopping_Cart')){
        return 'Automated Shopping Cart';
    } else if (url.includes('SMART_HEALTH_MONITORING_AND_ANALYZING_SERVICE')){
        return 'Health Analyzing Service'
    } 
}

const chatbox = new Chatbox();
chatbox.display();


// class Chatbox {
//     constructor() {
//         this.args = {
//             openButton: document.querySelector('.chatbox__button button'), 
//             chatBox: document.querySelector('.chatbox__support'),
//             sendButton: document.querySelector('.send__button') 
//         };
//         this.state = false;
//         this.messages = [];
//     }

//     display() {
//         const { openButton, chatBox, sendButton } = this.args;

//         openButton.addEventListener('click', () => this.toggleState(chatBox));
//         sendButton.addEventListener('click', () => this.onSendButton(chatBox));
//         const node = chatBox.querySelector('input');
//         node.addEventListener('keyup', ({ key }) => {
//             if (key === 'Enter') {
//                 this.onSendButton(chatBox);
//             }
//         });
//     }

//     toggleState(chatbox) {
//         this.state = !this.state;
//         if (this.state) {
//             chatbox.classList.add('chatbox--active');
//         } else {
//             chatbox.classList.remove('chatbox--active');
//         }
//     }

//     onSendButton(chatbox) {
//         var textField = chatbox.querySelector('input');
//         let text1 = textField.value;
//         if (text1 === "") {
//             return;
//         }
//         let msg1 = { name: "User", message: text1 };
//         this.messages.push(msg1);
//         this.updateChatText(chatbox);
//         textField.value = '';

//         fetch('/chat', {
//             method: 'POST',
//             body: JSON.stringify({ message: text1 }), 
//             mode: 'cors',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         })
//         .then(r => r.json())
//         .then(r => {
//             let msg2 = { name: "J.A.I.D", message: r.answer };
//             this.messages.push(msg2);
//             this.updateChatText(chatbox);
//             textField.value = '';
//         }).catch((error) => {
//             console.error('Error:', error);
//             this.updateChatText(chatbox);
//             textField.value = '';
//         });
//     }
//     updateChatText(chatbox) {
//         var html = '';
//         this.messages.slice().reverse().forEach(function (item, index) {
//             // Escape HTML to prevent XSS
//             const escapedMessage = escapeHtml(item.message);

//             if (item.name === "J.A.I.D") {
//                 html += '<div class="messages__item messages__item--visitor">' + linkify(escapedMessage) + '</div>';
//             } else {
//                 html += '<div class="messages__item messages__item--operator">' + linkify(escapedMessage) + '</div>';
//             }
//         });
//         const chatmessage = chatbox.querySelector('.chatbox__messages');
//         chatmessage.innerHTML = html;
//     }
// }

// function escapeHtml(html) {
//     var text = document.createTextNode(html);
//     var div = document.createElement('div');
//     div.appendChild(text);
//     return div.innerHTML;
// }
// function linkify(message) {
//     // Replace URLs, email addresses, and phone numbers with clickable links and mentions
//     message = message.replace(/(https?:\/\/[^\s]+)/g, function (url) {
//         return '<a href="' + url + '" target="_blank" class="contact-chatbot">' + getLinkMention(url) + '</a>';
//     });

//     message = message.replace(/(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g, function (email) {
//         return '<a href="mailto:' + email + '" class="contact-chatbot">' + email + '</a>';
//     });

//     message = message.replace(/(\b\d{10,}\b)/g, function (phoneNumber) {
//         return '<a href="tel:+91' + phoneNumber + '" class="contact-chatbot">' +'(+91)' + phoneNumber + '</a>';
//     });

//     return message;
// }




// function getLinkMention(url) {
//     // Add logic to determine the mention based on the URL
//     if (url.includes('linkedin.com')) {
//         return 'Linkedin Profile';
//     } else if (url.includes('github.com')) {
//         // Default mention if no specific mention is defined
//         return 'Github Profile';
//     } else if (url.includes('twitter.com')) {
//         return 'Twitter Profile';
//     } else if (url.includes('Automated_Shopping_Cart')){
//         return 'Automated Shopping Cart';
//     } else if (url.includes('SMART_HEALTH_MONITORING_AND_ANALYZING_SERVICE')){
//         return 'Health Analyzing Service'
//     }
// }

// const chatbox = new Chatbox();
// chatbox.display();


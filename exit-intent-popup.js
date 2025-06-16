// File name: exit-intent-popup.js
// Custom Element Tag: <exit-intent-popup></exit-intent-popup>

class ExitIntentPopup extends HTMLElement {
    constructor() {
        super();
        this.popupShown = false;
        this.mouseLeftWindow = false;
        this.popupClosed = false;
        this.lastTrigger = 0;
        this.lastScrollTop = 0;
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .exit-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                    z-index: 999999;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease-out;
                }

                .exit-popup-overlay.show {
                    display: flex;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .exit-popup {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    padding: 40px 30px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.4s ease-out;
                    color: white;
                }

                .exit-popup::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
                    border-radius: 20px;
                    pointer-events: none;
                }

                .close-btn {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }

                .popup-icon {
                    font-size: 60px;
                    margin-bottom: 20px;
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-10px);
                    }
                    60% {
                        transform: translateY(-5px);
                    }
                }

                .popup-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .popup-subtitle {
                    font-size: 18px;
                    margin-bottom: 25px;
                    opacity: 0.9;
                    line-height: 1.4;
                }

                .discount-badge {
                    display: inline-block;
                    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-size: 24px;
                    font-weight: 800;
                    margin: 20px 0;
                    box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 12px 35px rgba(238, 90, 36, 0.6);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
                    }
                }

                .popup-description {
                    font-size: 16px;
                    margin: 20px 0;
                    line-height: 1.5;
                    opacity: 0.95;
                }

                .cta-button {
                    background: linear-gradient(45deg, #00d2ff, #3a7bd5);
                    border: none;
                    padding: 18px 40px;
                    border-radius: 50px;
                    color: white;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 20px 10px 10px 10px;
                    box-shadow: 0 8px 25px rgba(58, 123, 213, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .cta-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(58, 123, 213, 0.6);
                }

                .no-thanks {
                    background: transparent;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    padding: 12px 25px;
                    border-radius: 25px;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 10px;
                }

                .no-thanks:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.5);
                }

                .urgency-text {
                    font-size: 14px;
                    margin-top: 15px;
                    opacity: 0.8;
                    font-style: italic;
                }

                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    .exit-popup {
                        padding: 30px 20px;
                        margin: 20px;
                        max-width: none;
                        width: calc(100% - 40px);
                    }

                    .popup-title {
                        font-size: 24px;
                    }

                    .popup-subtitle {
                        font-size: 16px;
                    }

                    .discount-badge {
                        font-size: 20px;
                        padding: 12px 25px;
                    }

                    .cta-button {
                        padding: 15px 30px;
                        font-size: 16px;
                        width: 100%;
                        margin: 15px 0 5px 0;
                    }

                    .no-thanks {
                        width: 100%;
                        margin: 10px 0;
                    }

                    .popup-icon {
                        font-size: 50px;
                    }
                }

                @media (max-width: 480px) {
                    .exit-popup {
                        padding: 25px 15px;
                    }

                    .popup-title {
                        font-size: 22px;
                    }

                    .discount-badge {
                        font-size: 18px;
                    }
                }

                /* Smooth animations for better UX */
                .exit-popup * {
                    transition: all 0.3s ease;
                }
            </style>

            <div class="exit-popup-overlay" id="exitPopupOverlay">
                <div class="exit-popup">
                    <button class="close-btn" id="closeBtn">&times;</button>
                    
                    <div class="popup-icon">🎉</div>
                    
                    <h2 class="popup-title">Wait! Don't Miss Out!</h2>
                    
                    <p class="popup-subtitle">You're about to leave, but we have an exclusive offer just for you!</p>
                    
                    <div class="discount-badge">${this.getAttribute('discount') || '25% OFF'}</div>
                    
                    <p class="popup-description">
                        Use code <strong>${this.getAttribute('coupon-code') || 'SAVE25'}</strong> and get instant ${this.getAttribute('discount') || '25%'} discount on your entire order. 
                        This exclusive offer is only available for the next few minutes!
                    </p>
                    
                    <button class="cta-button" id="ctaBtn">${this.getAttribute('cta-text') || 'Claim My Discount'}</button>
                    <br>
                    <button class="no-thanks" id="noThanksBtn">No thanks, I'll pass</button>
                    
                    <p class="urgency-text">⏰ Limited time offer - expires in ${this.getAttribute('urgency-time') || '10 minutes'}!</p>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.initializeExitIntent();
    }

    setupEventListeners() {
        const overlay = this.querySelector('#exitPopupOverlay');
        const closeBtn = this.querySelector('#closeBtn');
        const ctaBtn = this.querySelector('#ctaBtn');
        const noThanksBtn = this.querySelector('#noThanksBtn');

        closeBtn.addEventListener('click', () => this.closePopup());
        ctaBtn.addEventListener('click', () => this.claimOffer());
        noThanksBtn.addEventListener('click', () => this.closePopup());

        // Close when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closePopup();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popupShown) {
                this.closePopup();
            }
        });
    }

    initializeExitIntent() {
        // Desktop exit intent detection
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) {
                this.mouseLeftWindow = true;
                setTimeout(() => {
                    if (this.mouseLeftWindow) {
                        this.showExitPopup();
                    }
                }, 100);
            }
        });

        document.addEventListener('mouseenter', () => {
            this.mouseLeftWindow = false;
        });

        // Mobile and desktop beforeunload detection
        window.addEventListener('beforeunload', (e) => {
            if (!this.popupShown && !this.popupClosed) {
                this.showExitPopup();
                return 'Are you sure you want to leave? You have an exclusive discount waiting!';
            }
        });

        // Mobile-specific exit intent (scroll to top quickly)
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop < this.lastScrollTop && scrollTop < 100 && this.lastScrollTop > 200) {
                // User scrolled up quickly to top - possible exit intent on mobile
                if (!this.popupShown && !this.popupClosed) {
                    setTimeout(() => {
                        this.showExitPopup();
                    }, 500);
                }
            }
            
            this.lastScrollTop = scrollTop;
        });
    }

    showExitPopup() {
        const now = Date.now();
        if (now - this.lastTrigger > 2000 && !this.popupShown && !this.popupClosed) { // 2 second throttle
            this.lastTrigger = now;
            this.querySelector('#exitPopupOverlay').classList.add('show');
            this.popupShown = true;
            
            // Dispatch custom event for tracking
            this.dispatchEvent(new CustomEvent('popup-shown', {
                bubbles: true,
                detail: { timestamp: now }
            }));

            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exit_intent_popup_shown');
            }
        }
    }

    closePopup() {
        this.querySelector('#exitPopupOverlay').classList.remove('show');
        this.popupClosed = true;
        
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('popup-closed', {
            bubbles: true,
            detail: { timestamp: Date.now() }
        }));

        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_popup_closed');
        }
    }

    claimOffer() {
        const couponCode = this.getAttribute('coupon-code') || 'SAVE25';
        const redirectUrl = this.getAttribute('redirect-url');
        
        // Dispatch custom event with coupon code
        this.dispatchEvent(new CustomEvent('offer-claimed', {
            bubbles: true,
            detail: { 
                couponCode: couponCode,
                timestamp: Date.now()
            }
        }));

        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_offer_claimed', {
                coupon_code: couponCode
            });
        }

        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            alert(`Discount code ${couponCode} has been applied! Redirecting to checkout...`);
        }
        
        this.closePopup();
    }

    // Method to manually trigger popup (for testing)
    triggerPopup() {
        this.showExitPopup();
    }

    // Method to reset popup state
    resetPopup() {
        this.popupShown = false;
        this.popupClosed = false;
        this.mouseLeftWindow = false;
    }

    // Getters and setters for customization
    get discount() {
        return this.getAttribute('discount') || '25% OFF';
    }

    set discount(value) {
        this.setAttribute('discount', value);
    }

    get couponCode() {
        return this.getAttribute('coupon-code') || 'SAVE25';
    }

    set couponCode(value) {
        this.setAttribute('coupon-code', value);
    }

    get ctaText() {
        return this.getAttribute('cta-text') || 'Claim My Discount';
    }

    set ctaText(value) {
        this.setAttribute('cta-text', value);
    }

    get redirectUrl() {
        return this.getAttribute('redirect-url');
    }

    set redirectUrl(value) {
        this.setAttribute('redirect-url', value);
    }

    static get observedAttributes() {
        return ['discount', 'coupon-code', 'cta-text', 'redirect-url', 'urgency-time'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            // Update the popup content when attributes change
            this.updatePopupContent();
        }
    }

    updatePopupContent() {
        const discountBadge = this.querySelector('.discount-badge');
        const description = this.querySelector('.popup-description');
        const ctaButton = this.querySelector('#ctaBtn');
        const urgencyText = this.querySelector('.urgency-text');

        if (discountBadge) {
            discountBadge.textContent = this.discount;
        }

        if (description) {
            description.innerHTML = `
                Use code <strong>${this.couponCode}</strong> and get instant ${this.discount} discount on your entire order. 
                This exclusive offer is only available for the next few minutes!
            `;
        }

        if (ctaButton) {
            ctaButton.textContent = this.ctaText;
        }

        if (urgencyText) {
            urgencyText.innerHTML = `⏰ Limited time offer - expires in ${this.getAttribute('urgency-time') || '10 minutes'}!`;
        }
    }
}

// Register the custom element
customElements.define('exit-intent-popup', ExitIntentPopup);

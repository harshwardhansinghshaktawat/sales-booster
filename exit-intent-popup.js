// File name: exit-intent-popup-blocks.js
// Custom Element Tag: <exit-intent-popup></exit-intent-popup>
// Designed for Wix Blocks integration with JSON configuration

class ExitIntentPopup extends HTMLElement {
    constructor() {
        super();
        this.popupShown = false;
        this.mouseLeftWindow = false;
        this.popupClosed = false;
        this.lastTrigger = 0;
        this.lastScrollTop = 0;
        
        // Initialize with default configuration
        this.config = this.getDefaultConfig();
        this.isInitialized = false;
    }

    static get observedAttributes() {
        return ['config'];
    }

    connectedCallback() {
        // Parse initial config if provided
        const configAttr = this.getAttribute('config');
        if (configAttr) {
            this.updateConfigFromJSON(configAttr);
        }

        this.render();
        this.setupEventListeners();
        this.initializeExitIntent();
        this.isInitialized = true;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'config' && oldValue !== newValue && this.isInitialized) {
            this.updateConfigFromJSON(newValue);
            this.updatePopupContent();
            this.updatePopupStyles();
        }
    }

    updateConfigFromJSON(jsonString) {
        try {
            if (jsonString && jsonString.trim() !== '') {
                const parsedConfig = JSON.parse(jsonString);
                // Merge with defaults to ensure all properties exist
                this.config = { ...this.getDefaultConfig(), ...parsedConfig };
            } else {
                this.config = this.getDefaultConfig();
            }
        } catch (e) {
            console.error('Error parsing exit-intent popup config JSON:', e);
            console.error('Invalid JSON:', jsonString);
            this.config = this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            discount: "25% OFF",
            couponCode: "SAVE25",
            ctaText: "Claim My Discount",
            redirectUrl: "",
            urgencyTime: "10 minutes",
            popupTitle: "Wait! Don't Miss Out!",
            popupSubtitle: "You're about to leave, but we have an exclusive offer just for you!",
            backgroundColor: "#667eea",
            buttonColor: "#00d2ff",
            popupDescription: "Use code SAVE25 and get instant 25% OFF discount on your entire order. This exclusive offer is only available for the next few minutes!",
            popupIcon: "🎉",
            noThanksText: "No thanks, I'll pass"
        };
    }

    render() {
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
                    background: linear-gradient(135deg, ${this.config.backgroundColor} 0%, ${this.config.backgroundColor}dd 100%);
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
                    background: linear-gradient(45deg, ${this.config.buttonColor}, ${this.config.buttonColor}dd);
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
                    
                    <div class="popup-icon">${this.config.popupIcon}</div>
                    
                    <h2 class="popup-title">${this.config.popupTitle}</h2>
                    
                    <p class="popup-subtitle">${this.config.popupSubtitle}</p>
                    
                    <div class="discount-badge">${this.config.discount}</div>
                    
                    <p class="popup-description">${this.config.popupDescription}</p>
                    
                    <button class="cta-button" id="ctaBtn">${this.config.ctaText}</button>
                    <br>
                    <button class="no-thanks" id="noThanksBtn">${this.config.noThanksText}</button>
                    
                    <p class="urgency-text">⏰ Limited time offer - expires in ${this.config.urgencyTime}!</p>
                </div>
            </div>
        `;
    }

    updatePopupContent() {
        // Update text content elements
        const titleElement = this.querySelector('.popup-title');
        const subtitleElement = this.querySelector('.popup-subtitle');
        const discountBadge = this.querySelector('.discount-badge');
        const description = this.querySelector('.popup-description');
        const ctaButton = this.querySelector('#ctaBtn');
        const noThanksButton = this.querySelector('#noThanksBtn');
        const urgencyText = this.querySelector('.urgency-text');
        const iconElement = this.querySelector('.popup-icon');

        if (titleElement) {
            titleElement.textContent = this.config.popupTitle;
        }

        if (subtitleElement) {
            subtitleElement.textContent = this.config.popupSubtitle;
        }

        if (discountBadge) {
            discountBadge.textContent = this.config.discount;
        }

        if (description) {
            description.textContent = this.config.popupDescription;
        }

        if (ctaButton) {
            ctaButton.textContent = this.config.ctaText;
        }

        if (noThanksButton) {
            noThanksButton.textContent = this.config.noThanksText;
        }

        if (urgencyText) {
            urgencyText.innerHTML = `⏰ Limited time offer - expires in ${this.config.urgencyTime}!`;
        }

        if (iconElement) {
            iconElement.textContent = this.config.popupIcon;
        }
    }

    updatePopupStyles() {
        const popup = this.querySelector('.exit-popup');
        const ctaButton = this.querySelector('.cta-button');
        
        if (popup) {
            popup.style.background = `linear-gradient(135deg, ${this.config.backgroundColor} 0%, ${this.config.backgroundColor}dd 100%)`;
        }
        
        if (ctaButton) {
            ctaButton.style.background = `linear-gradient(45deg, ${this.config.buttonColor}, ${this.config.buttonColor}dd)`;
        }
    }

    setupEventListeners() {
        const overlay = this.querySelector('#exitPopupOverlay');
        const closeBtn = this.querySelector('#closeBtn');
        const ctaBtn = this.querySelector('#ctaBtn');
        const noThanksBtn = this.querySelector('#noThanksBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePopup());
        }

        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => this.claimOffer());
        }

        if (noThanksBtn) {
            noThanksBtn.addEventListener('click', () => this.closePopup());
        }

        // Close when clicking outside
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closePopup();
                }
            });
        }

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
            const overlay = this.querySelector('#exitPopupOverlay');
            if (overlay) {
                overlay.classList.add('show');
                this.popupShown = true;
                
                // Dispatch custom event for tracking
                this.dispatchEvent(new CustomEvent('popup-shown', {
                    bubbles: true,
                    detail: { 
                        timestamp: now,
                        config: this.config 
                    }
                }));

                // Track with Google Analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'exit_intent_popup_shown', {
                        discount: this.config.discount,
                        coupon_code: this.config.couponCode
                    });
                }
            }
        }
    }

    closePopup() {
        const overlay = this.querySelector('#exitPopupOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            this.popupClosed = true;
            
            // Dispatch custom event
            this.dispatchEvent(new CustomEvent('popup-closed', {
                bubbles: true,
                detail: { 
                    timestamp: Date.now(),
                    config: this.config 
                }
            }));

            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exit_intent_popup_closed', {
                    discount: this.config.discount,
                    coupon_code: this.config.couponCode
                });
            }
        }
    }

    claimOffer() {
        // Dispatch custom event with coupon code
        this.dispatchEvent(new CustomEvent('offer-claimed', {
            bubbles: true,
            detail: { 
                couponCode: this.config.couponCode,
                discount: this.config.discount,
                timestamp: Date.now(),
                config: this.config
            }
        }));

        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_offer_claimed', {
                coupon_code: this.config.couponCode,
                discount: this.config.discount
            });
        }

        if (this.config.redirectUrl && this.config.redirectUrl.trim() !== '') {
            window.location.href = this.config.redirectUrl;
        } else {
            alert(`Discount code ${this.config.couponCode} has been applied! Redirecting to checkout...`);
        }
        
        this.closePopup();
    }

    // Public API methods for manual control
    triggerPopup() {
        this.showExitPopup();
    }

    resetPopup() {
        this.popupShown = false;
        this.popupClosed = false;
        this.mouseLeftWindow = false;
    }

    updateConfiguration(newConfig) {
        this.config = { ...this.getDefaultConfig(), ...newConfig };
        this.updatePopupContent();
        this.updatePopupStyles();
    }

    getConfiguration() {
        return { ...this.config };
    }

    // Getters for individual config properties
    get discount() {
        return this.config.discount;
    }

    get couponCode() {
        return this.config.couponCode;
    }

    get ctaText() {
        return this.config.ctaText;
    }

    get redirectUrl() {
        return this.config.redirectUrl;
    }

    get urgencyTime() {
        return this.config.urgencyTime;
    }

    get popupTitle() {
        return this.config.popupTitle;
    }

    get popupSubtitle() {
        return this.config.popupSubtitle;
    }

    get backgroundColor() {
        return this.config.backgroundColor;
    }

    get buttonColor() {
        return this.config.buttonColor;
    }
}

// Register the custom element
customElements.define('exit-intent-popup', ExitIntentPopup);

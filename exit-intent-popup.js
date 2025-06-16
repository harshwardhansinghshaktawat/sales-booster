// File name: exit-intent-popup-blocks-fixed.js
// Custom Element Tag: <exit-intent-popup></exit-intent-popup>
// Designed for Wix Blocks with maximum editability

class ExitIntentPopup extends HTMLElement {
    constructor() {
        super();
        this.popupShown = false;
        this.mouseLeftWindow = false;
        this.popupClosed = false;
        this.lastTrigger = 0;
        this.lastScrollTop = 0;
        
        // Default settings with maximum editability
        this.settings = {
            // Text Content - Fully Editable
            popupTitle: 'Wait! Don\'t Miss Out!',
            popupSubtitle: 'You\'re about to leave, but we have an exclusive offer just for you!',
            discountText: '25% OFF',
            couponCode: 'SAVE25',
            popupDescription: 'Use code <strong>SAVE25</strong> and get instant 25% discount on your entire order. This exclusive offer is only available for the next few minutes!',
            ctaButtonText: 'Claim My Discount',
            noThanksText: 'No thanks, I\'ll pass',
            urgencyText: '⏰ Limited time offer - expires in 10 minutes!',
            popupIcon: '🎉',
            
            // Functionality
            ctaButtonLink: '',
            
            // Typography - Fully Customizable
            fontFamily: 'Arial',
            titleFontSize: 28,
            subtitleFontSize: 18,
            descriptionFontSize: 16,
            buttonFontSize: 18,
            urgencyFontSize: 14,
            noThanksFontSize: 14,
            discountBadgeFontSize: 24,
            
            // Colors - Fully Customizable
            backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            discountBadgeColor: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            ctaButtonColor: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
            textColor: '#ffffff',
            buttonTextColor: '#ffffff',
            noThanksTextColor: '#ffffff',
            noThanksBorderColor: 'rgba(255, 255, 255, 0.3)',
            
            // Layout & Spacing
            popupMaxWidth: 500,
            popupPadding: 40,
            borderRadius: 20,
            iconSize: 60,
            
            // Animation
            enableAnimations: true,
            animationDuration: 0.4
        };
    }

    connectedCallback() {
        // Set host styles
        Object.assign(this.style, {
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            padding: '0',
            margin: '0'
        });

        this.renderPopup();
        this.setupEventListeners();
        this.initializeExitIntent();
        
        // Demo trigger for testing - show popup after 3 seconds if no config
        setTimeout(() => {
            if (!this.hasAttribute('config') || this.getAttribute('config') === '') {
                this.showExitPopup();
            }
        }, 3000);
    }

    static get observedAttributes() {
        return ['config'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'config') {
            if (newValue && newValue !== oldValue && newValue.trim() !== '') {
                try {
                    const newConfig = JSON.parse(newValue);
                    // Merge new config with existing settings
                    Object.assign(this.settings, newConfig);
                    this.updatePopupContent();
                } catch (e) {
                    console.warn('Invalid JSON in config attribute:', e);
                    console.warn('Invalid JSON string:', newValue);
                }
            } else {
                // Use defaults if no config provided
                this.updatePopupContent();
            }
        }
    }

    renderPopup() {
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
                    animation: ${this.settings.enableAnimations ? 'fadeIn 0.3s ease-out' : 'none'};
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

                .exit-popup {
                    background: ${this.settings.backgroundGradient};
                    border-radius: ${this.settings.borderRadius}px;
                    padding: ${this.settings.popupPadding}px 30px;
                    max-width: ${this.settings.popupMaxWidth}px;
                    width: 90%;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    animation: ${this.settings.enableAnimations ? `slideUp ${this.settings.animationDuration}s ease-out` : 'none'};
                    color: ${this.settings.textColor};
                    font-family: ${this.settings.fontFamily}, sans-serif;
                }

                .exit-popup::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
                    border-radius: ${this.settings.borderRadius}px;
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
                    z-index: 10;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }

                .popup-icon {
                    font-size: ${this.settings.iconSize}px;
                    margin-bottom: 20px;
                    animation: ${this.settings.enableAnimations ? 'bounce 2s infinite' : 'none'};
                }

                .popup-title {
                    font-size: ${this.settings.titleFontSize}px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    font-family: ${this.settings.fontFamily}, sans-serif;
                    color: ${this.settings.textColor};
                    position: relative;
                    z-index: 1;
                }

                .popup-subtitle {
                    font-size: ${this.settings.subtitleFontSize}px;
                    margin-bottom: 25px;
                    opacity: 0.9;
                    line-height: 1.4;
                    font-family: ${this.settings.fontFamily}, sans-serif;
                    color: ${this.settings.textColor};
                    position: relative;
                    z-index: 1;
                }

                .discount-badge {
                    display: inline-block;
                    background: ${this.settings.discountBadgeColor};
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-size: ${this.settings.discountBadgeFontSize}px;
                    font-weight: 800;
                    margin: 20px 0;
                    box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
                    animation: ${this.settings.enableAnimations ? 'pulse 2s infinite' : 'none'};
                    font-family: ${this.settings.fontFamily}, sans-serif;
                    color: white;
                    position: relative;
                    z-index: 1;
                }

                .popup-description {
                    font-size: ${this.settings.descriptionFontSize}px;
                    margin: 20px 0;
                    line-height: 1.5;
                    opacity: 0.95;
                    font-family: ${this.settings.fontFamily}, sans-serif;
                    color: ${this.settings.textColor};
                    position: relative;
                    z-index: 1;
                }

                .cta-button {
                    background: ${this.settings.ctaButtonColor};
                    border: none;
                    padding: 18px 40px;
                    border-radius: 50px;
                    color: ${this.settings.buttonTextColor};
                    font-size: ${this.settings.buttonFontSize}px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 20px 10px 10px 10px;
                    box-shadow: 0 8px 25px rgba(58, 123, 213, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-family: ${this.settings.fontFamily}, sans-serif;
                    position: relative;
                    z-index: 1;
                }

                .cta-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(58, 123, 213, 0.6);
                }

                .no-thanks {
                    background: transparent;
                    border: 2px solid ${this.settings.noThanksBorderColor};
                    padding: 12px 25px;
                    border-radius: 25px;
                    color: ${this.settings.noThanksTextColor};
                    font-size: ${this.settings.noThanksFontSize}px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 10px;
                    font-family: ${this.settings.fontFamily}, sans-serif;
                    position: relative;
                    z-index: 1;
                }

                .no-thanks:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.5);
                }

                .urgency-text {
                    font-size: ${this.settings.urgencyFontSize}px;
                    margin-top: 15px;
                    opacity: 0.8;
                    font-style: italic;
                    font-family: ${this.settings.fontFamily}, sans-serif;
                    color: ${this.settings.textColor};
                    position: relative;
                    z-index: 1;
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
                        font-size: ${Math.max(this.settings.titleFontSize - 4, 18)}px;
                    }

                    .popup-subtitle {
                        font-size: ${Math.max(this.settings.subtitleFontSize - 2, 14)}px;
                    }

                    .discount-badge {
                        font-size: ${Math.max(this.settings.discountBadgeFontSize - 4, 18)}px;
                        padding: 12px 25px;
                    }

                    .cta-button {
                        padding: 15px 30px;
                        font-size: ${Math.max(this.settings.buttonFontSize - 2, 14)}px;
                        width: 100%;
                        margin: 15px 0 5px 0;
                    }

                    .no-thanks {
                        width: 100%;
                        margin: 10px 0;
                    }

                    .popup-icon {
                        font-size: ${Math.max(this.settings.iconSize - 10, 40)}px;
                    }
                }

                @media (max-width: 480px) {
                    .exit-popup {
                        padding: 25px 15px;
                    }

                    .popup-title {
                        font-size: ${Math.max(this.settings.titleFontSize - 6, 16)}px;
                    }

                    .discount-badge {
                        font-size: ${Math.max(this.settings.discountBadgeFontSize - 6, 16)}px;
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
                    
                    <div class="popup-icon">${this.settings.popupIcon}</div>
                    
                    <h2 class="popup-title">${this.settings.popupTitle}</h2>
                    
                    <p class="popup-subtitle">${this.settings.popupSubtitle}</p>
                    
                    <div class="discount-badge">${this.settings.discountText}</div>
                    
                    <p class="popup-description">${this.settings.popupDescription}</p>
                    
                    <button class="cta-button" id="ctaBtn">${this.settings.ctaButtonText}</button>
                    <br>
                    <button class="no-thanks" id="noThanksBtn">${this.settings.noThanksText}</button>
                    
                    <p class="urgency-text">${this.settings.urgencyText}</p>
                </div>
            </div>
        `;
    }

    updatePopupContent() {
        // Re-render the entire popup with new settings (this is the key!)
        this.renderPopup();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const overlay = this.querySelector('#exitPopupOverlay');
        const closeBtn = this.querySelector('#closeBtn');
        const ctaBtn = this.querySelector('#ctaBtn');
        const noThanksBtn = this.querySelector('#noThanksBtn');

        // Enhanced event binding with error handling
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button clicked');
                this.closePopup();
            });
        } else {
            console.error('Close button not found');
        }

        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('CTA button clicked');
                this.claimOffer();
            });
        } else {
            console.error('CTA button not found');
        }

        if (noThanksBtn) {
            noThanksBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('No Thanks button clicked');
                this.closePopup();
            });
        } else {
            console.error('No Thanks button not found');
        }

        // Close when clicking outside
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    console.log('Overlay clicked - closing popup');
                    this.closePopup();
                }
            });
        }

        // Keyboard support
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && this.popupShown) {
                console.log('Escape key pressed - closing popup');
                this.closePopup();
            }
        };
        
        // Clean up previous listener
        document.removeEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', handleKeyDown);
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

        // Easy testing triggers
        document.addEventListener('dblclick', () => {
            if (!this.popupShown && !this.popupClosed) {
                this.showExitPopup();
            }
        });

        // Inactivity timer for testing
        let inactivityTimer;
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            if (!this.popupShown && !this.popupClosed) {
                inactivityTimer = setTimeout(() => {
                    this.showExitPopup();
                }, 10000); // 10 seconds of inactivity
            }
        };

        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetInactivityTimer, true);
        });

        resetInactivityTimer();
    }

    showExitPopup() {
        const now = Date.now();
        if (now - this.lastTrigger > 2000 && !this.popupShown && !this.popupClosed) {
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
                        settings: this.settings 
                    }
                }));

                // Track with Google Analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'exit_intent_popup_shown', {
                        coupon_code: this.settings.couponCode
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
                    settings: this.settings 
                }
            }));

            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exit_intent_popup_closed');
            }
        }
    }

    claimOffer() {
        // Dispatch custom event with coupon code
        this.dispatchEvent(new CustomEvent('offer-claimed', {
            bubbles: true,
            detail: { 
                couponCode: this.settings.couponCode,
                timestamp: Date.now(),
                settings: this.settings
            }
        }));

        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_offer_claimed', {
                coupon_code: this.settings.couponCode
            });
        }

        // Close popup first
        this.closePopup();

        // Enhanced redirect handling
        if (this.settings.ctaButtonLink && this.settings.ctaButtonLink.trim() !== '') {
            try {
                let url = this.settings.ctaButtonLink.trim();
                
                // Smart URL handling
                if (!url.match(/^https?:\/\//)) {
                    if (url.includes('.')) {
                        url = 'https://' + url;
                    } else {
                        url = '/' + url.replace(/^\/+/, '');
                    }
                }
                
                console.log('Redirecting to:', url);
                window.location.href = url;
                
            } catch (error) {
                console.error('Error with redirect URL:', error);
                alert(`Discount code ${this.settings.couponCode} has been applied! Please manually navigate to complete your purchase.`);
            }
        } else {
            alert(`Discount code ${this.settings.couponCode} has been applied!`);
        }
    }

    // Public API methods
    triggerPopup() {
        this.showExitPopup();
    }

    resetPopup() {
        this.popupShown = false;
        this.popupClosed = false;
        this.mouseLeftWindow = false;
    }

    updateConfiguration(newConfig) {
        Object.assign(this.settings, newConfig);
        this.updatePopupContent();
    }

    getConfiguration() {
        return { ...this.settings };
    }

    // Getters for individual properties
    get popupTitle() { return this.settings.popupTitle; }
    get popupSubtitle() { return this.settings.popupSubtitle; }
    get discountText() { return this.settings.discountText; }
    get couponCode() { return this.settings.couponCode; }
    get popupDescription() { return this.settings.popupDescription; }
    get ctaButtonText() { return this.settings.ctaButtonText; }
    get noThanksText() { return this.settings.noThanksText; }
    get urgencyText() { return this.settings.urgencyText; }
    get ctaButtonLink() { return this.settings.ctaButtonLink; }

    disconnectedCallback() {
        // Clean up event listeners if needed
        console.log('Exit intent popup disconnected');
    }
}

// Register the custom element
customElements.define('exit-intent-popup', ExitIntentPopup);

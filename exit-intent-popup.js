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
        this.isConfigured = false;
        this.eventListenersSetup = false;
        
        // Bind methods to preserve 'this' context
        this.handleClick = this.handleClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        
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
        console.log('Exit intent popup connected');
        
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

        // Clean up any existing setup
        this.cleanup();
        
        // Render popup
        this.renderPopup();
        
        // Setup with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupEventListeners();
            this.initializeExitIntent();
        }, 100);
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
                    this.isConfigured = true;
                    console.log('Configuration received:', this.settings);
                    console.log('CTA Button Link:', this.settings.ctaButtonLink);
                    this.updatePopupContent();
                } catch (e) {
                    console.warn('Invalid JSON in config attribute:', e);
                    console.warn('Invalid JSON string:', newValue);
                }
            }
        }
    }

    cleanup() {
        // Remove all event listeners
        if (this.eventListenersSetup) {
            document.removeEventListener('keydown', this.handleKeydown);
            document.removeEventListener('mouseleave', this.handleMouseLeave);
            document.removeEventListener('mouseenter', this.handleMouseEnter);
            window.removeEventListener('beforeunload', this.handleBeforeUnload);
            window.removeEventListener('scroll', this.handleScroll);
            document.removeEventListener('dblclick', this.handleDoubleClick);
            this.removeEventListener('click', this.handleClick);
            this.eventListenersSetup = false;
        }
        
        // Reset state
        this.popupShown = false;
        this.popupClosed = false;
        this.mouseLeftWindow = false;
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
                    display: flex !important;
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
                    <button class="close-btn" id="closeBtn" type="button">&times;</button>
                    
                    <div class="popup-icon">${this.settings.popupIcon}</div>
                    
                    <h2 class="popup-title">${this.settings.popupTitle}</h2>
                    
                    <p class="popup-subtitle">${this.settings.popupSubtitle}</p>
                    
                    <div class="discount-badge">${this.settings.discountText}</div>
                    
                    <p class="popup-description">${this.settings.popupDescription}</p>
                    
                    <button class="cta-button" id="ctaBtn" type="button">${this.settings.ctaButtonText}</button>
                    <br>
                    <button class="no-thanks" id="noThanksBtn" type="button">${this.settings.noThanksText}</button>
                    
                    <p class="urgency-text">${this.settings.urgencyText}</p>
                </div>
            </div>
        `;
    }

    updatePopupContent() {
        console.log('Updating popup content with new settings');
        
        // Re-render to get the latest styles and content
        this.renderPopup();
        
        // Re-setup event listeners after re-render
        setTimeout(() => {
            this.setupEventListeners();
        }, 50);
    }

    handleClick(e) {
        const target = e.target;
        console.log('Click detected on:', target.id, target.className);
        
        if (target.id === 'closeBtn' || target.classList.contains('close-btn')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            this.closePopup();
        }
        else if (target.id === 'ctaBtn' || target.classList.contains('cta-button')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('CTA button clicked, link:', this.settings.ctaButtonLink);
            this.claimOffer();
        }
        else if (target.id === 'noThanksBtn' || target.classList.contains('no-thanks')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('No Thanks button clicked');
            this.closePopup();
        }
        else if (target.id === 'exitPopupOverlay') {
            console.log('Overlay clicked - closing popup');
            this.closePopup();
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape' && this.popupShown) {
            console.log('Escape key pressed - closing popup');
            this.closePopup();
        }
    }

    handleMouseLeave(e) {
        if (e.clientY <= 0) {
            this.mouseLeftWindow = true;
            setTimeout(() => {
                if (this.mouseLeftWindow && this.isConfigured) {
                    this.showExitPopup();
                }
            }, 100);
        }
    }

    handleMouseEnter() {
        this.mouseLeftWindow = false;
    }

    handleBeforeUnload(e) {
        if (!this.popupShown && !this.popupClosed && this.isConfigured) {
            this.showExitPopup();
            return 'Are you sure you want to leave? You have an exclusive discount waiting!';
        }
    }

    handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop < this.lastScrollTop && scrollTop < 100 && this.lastScrollTop > 200) {
            // User scrolled up quickly to top - possible exit intent on mobile
            if (!this.popupShown && !this.popupClosed && this.isConfigured) {
                setTimeout(() => {
                    this.showExitPopup();
                }, 500);
            }
        }
        
        this.lastScrollTop = scrollTop;
    }

    handleDoubleClick() {
        if (!this.popupShown && !this.popupClosed && this.isConfigured) {
            console.log('Double click detected - showing popup for testing');
            this.showExitPopup();
        }
    }

    setupEventListeners() {
        if (this.eventListenersSetup) {
            console.log('Event listeners already setup, skipping...');
            return;
        }

        console.log('Setting up event listeners...');
        
        // Add click listener to the custom element itself
        this.addEventListener('click', this.handleClick, true);
        
        // Add global event listeners
        document.addEventListener('keydown', this.handleKeydown);
        document.addEventListener('mouseleave', this.handleMouseLeave);
        document.addEventListener('mouseenter', this.handleMouseEnter);
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('scroll', this.handleScroll);
        document.addEventListener('dblclick', this.handleDoubleClick);
        
        this.eventListenersSetup = true;
        console.log('All event listeners set up successfully');
        
        // Verify buttons exist
        const closeBtn = this.querySelector('#closeBtn');
        const ctaBtn = this.querySelector('#ctaBtn');
        const noThanksBtn = this.querySelector('#noThanksBtn');
        
        console.log('Button elements found:', {
            closeBtn: !!closeBtn,
            ctaBtn: !!ctaBtn,
            noThanksBtn: !!noThanksBtn
        });
    }

    initializeExitIntent() {
        console.log('Exit intent initialized - listeners are already set up');
    }

    showExitPopup() {
        const now = Date.now();
        if (now - this.lastTrigger > 2000 && !this.popupShown && !this.popupClosed && this.isConfigured) {
            this.lastTrigger = now;
            const overlay = this.querySelector('#exitPopupOverlay');
            if (overlay) {
                overlay.classList.add('show');
                this.popupShown = true;
                console.log('Popup shown');
                
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
        console.log('Closing popup...');
        const overlay = this.querySelector('#exitPopupOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            this.popupShown = false;
            console.log('Popup closed successfully');
            
            // Allow popup to be shown again after 5 seconds
            setTimeout(() => {
                this.popupClosed = false;
                console.log('Popup can be shown again');
            }, 5000);
            
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
        console.log('Claiming offer with link:', this.settings.ctaButtonLink);
        
        // Dispatch custom event with coupon code
        this.dispatchEvent(new CustomEvent('offer-claimed', {
            bubbles: true,
            detail: { 
                couponCode: this.settings.couponCode,
                timestamp: Date.now(),
                settings: this.settings,
                link: this.settings.ctaButtonLink
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
                    if (url.includes('.') || url.startsWith('www.')) {
                        url = 'https://' + url;
                    } else if (url.startsWith('/')) {
                        url = window.location.origin + url;
                    } else {
                        url = window.location.origin + '/' + url;
                    }
                }
                
                console.log('Redirecting to:', url);
                
                // Add a small delay to ensure popup closes smoothly
                setTimeout(() => {
                    window.location.href = url;
                }, 200);
                
            } catch (error) {
                console.error('Error with redirect URL:', error);
                alert(`Discount code ${this.settings.couponCode} has been applied! Please manually navigate to complete your purchase.`);
            }
        } else {
            console.log('No link provided, showing coupon code alert');
            alert(`Your discount code is: ${this.settings.couponCode}`);
        }
    }

    // Public API methods
    triggerPopup() {
        if (this.isConfigured) {
            this.showExitPopup();
        }
    }

    resetPopup() {
        this.popupShown = false;
        this.popupClosed = false;
        this.mouseLeftWindow = false;
        console.log('Popup state reset');
    }

    updateConfiguration(newConfig) {
        Object.assign(this.settings, newConfig);
        this.updatePopupContent();
    }

    getConfiguration() {
        return { ...this.settings };
    }

    disconnectedCallback() {
        console.log('Exit intent popup disconnected - cleaning up');
        this.cleanup();
    }
}

// Register the custom element
customElements.define('exit-intent-popup', ExitIntentPopup);

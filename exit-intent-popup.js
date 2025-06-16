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
        this.settings = {
            popupTitle: 'Wait! Don\'t Miss Out!',
            popupSubtitle: 'You\'re about to leave, but we have an exclusive offer just for you!',
            discountText: '25% OFF',
            couponCode: 'SAVE25',
            popupDescription: 'Use code <strong>SAVE25</strong> and get instant 25% discount on your entire order. This exclusive offer is only available for the next few minutes!',
            ctaButtonText: 'Claim My Discount',
            noThanksText: 'No thanks, I\'ll pass',
            urgencyText: '⏰ Limited time offer - expires in 10 minutes!',
            ctaButtonLink: '',
            fontFamily: 'Arial',
            titleFontSize: 28,
            subtitleFontSize: 18,
            descriptionFontSize: 16,
            buttonFontSize: 18,
            urgencyFontSize: 14,
            backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            discountBadgeColor: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            ctaButtonColor: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
            textColor: '#ffffff',
            popupIcon: '🎉'
        };
    }

    connectedCallback() {
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
        
        // Make testing method available on window for debugging
        window.testExitPopup = () => {
            console.log('Testing exit popup...');
            this.showExitPopup();
        };
        
        console.log('Exit-intent popup loaded. Test with: testExitPopup()');
    }

    static get observedAttributes() {
        return ['options'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue && newValue !== oldValue) {
            if (name === 'options') {
                const newOptions = JSON.parse(newValue);
                Object.assign(this.settings, newOptions);
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
                    background: ${this.settings.backgroundGradient};
                    border-radius: 20px;
                    padding: 40px 30px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.4s ease-out;
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
                    font-size: ${this.settings.titleFontSize}px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    font-family: ${this.settings.fontFamily}, sans-serif;
                }

                .popup-subtitle {
                    font-size: ${this.settings.subtitleFontSize}px;
                    margin-bottom: 25px;
                    opacity: 0.9;
                    line-height: 1.4;
                    font-family: ${this.settings.fontFamily}, sans-serif;
                }

                .discount-badge {
                    display: inline-block;
                    background: ${this.settings.discountBadgeColor};
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-size: 24px;
                    font-weight: 800;
                    margin: 20px 0;
                    box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
                    animation: pulse 2s infinite;
                    font-family: ${this.settings.fontFamily}, sans-serif;
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
                    font-size: ${this.settings.descriptionFontSize}px;
                    margin: 20px 0;
                    line-height: 1.5;
                    opacity: 0.95;
                    font-family: ${this.settings.fontFamily}, sans-serif;
                }

                .cta-button {
                    background: ${this.settings.ctaButtonColor};
                    border: none;
                    padding: 18px 40px;
                    border-radius: 50px;
                    color: white;
                    font-size: ${this.settings.buttonFontSize}px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 20px 10px 10px 10px;
                    box-shadow: 0 8px 25px rgba(58, 123, 213, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-family: ${this.settings.fontFamily}, sans-serif;
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
                    font-family: ${this.settings.fontFamily}, sans-serif;
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
                        font-size: 20px;
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
                        font-size: 50px;
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
        // Re-render the entire popup with new settings
        this.renderPopup();
        this.setupEventListeners();
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
        // More reliable desktop exit intent detection
        let isMouseOver = true;
        
        // Track mouse movement toward the top of the page
        document.addEventListener('mousemove', (e) => {
            isMouseOver = true;
            
            // Detect when mouse moves close to the top (within 50px) and user was scrolled down
            if (e.clientY <= 50 && window.pageYOffset > 100) {
                if (!this.popupShown && !this.popupClosed) {
                    this.showExitPopup();
                }
            }
        });

        // Detect when mouse leaves the document (more reliable than mouseleave)
        document.addEventListener('mouseout', (e) => {
            // Check if mouse is leaving toward the top of the browser
            if (!e.relatedTarget && e.clientY <= 10) {
                this.mouseLeftWindow = true;
                setTimeout(() => {
                    if (this.mouseLeftWindow && !this.popupShown && !this.popupClosed) {
                        this.showExitPopup();
                    }
                }, 100);
            }
        });

        // Traditional mouseleave with more lenient detection
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 10 || e.clientY <= e.target.offsetTop) {
                this.mouseLeftWindow = true;
                setTimeout(() => {
                    if (this.mouseLeftWindow && !this.popupShown && !this.popupClosed) {
                        this.showExitPopup();
                    }
                }, 100);
            }
        });

        document.addEventListener('mouseenter', () => {
            this.mouseLeftWindow = false;
            isMouseOver = true;
        });

        // Visibility change detection (tab switching, minimizing)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !this.popupShown && !this.popupClosed) {
                // Small delay to catch window close attempts
                setTimeout(() => {
                    if (document.hidden) {
                        this.showExitPopup();
                    }
                }, 300);
            }
        });

        // Enhanced beforeunload detection
        window.addEventListener('beforeunload', (e) => {
            if (!this.popupShown && !this.popupClosed) {
                this.showExitPopup();
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? You have an exclusive discount waiting!';
                return e.returnValue;
            }
        });

        // Mobile-specific exit intent (aggressive scroll detection)
        let scrollTimer = null;
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Clear previous timer
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            
            // Quick scroll to top detection
            if (scrollTop < this.lastScrollTop && scrollTop < 100 && this.lastScrollTop > 200) {
                if (!this.popupShown && !this.popupClosed) {
                    this.showExitPopup();
                }
            }
            
            // Fast upward scroll detection
            if (scrollTop < this.lastScrollTop - 100 && !this.popupShown && !this.popupClosed) {
                scrollTimer = setTimeout(() => {
                    this.showExitPopup();
                }, 300);
            }
            
            this.lastScrollTop = scrollTop;
        });

        // Fallback: detect when user is inactive then moves mouse rapidly toward top
        let inactivityTimer = null;
        let wasInactive = false;
        
        document.addEventListener('mousemove', (e) => {
            clearTimeout(inactivityTimer);
            
            // If user was inactive and now moves mouse to top area rapidly
            if (wasInactive && e.clientY <= 100 && !this.popupShown && !this.popupClosed) {
                this.showExitPopup();
            }
            
            wasInactive = false;
            
            // Set inactivity timer
            inactivityTimer = setTimeout(() => {
                wasInactive = true;
            }, 2000);
        });
    }

    showExitPopup() {
        const now = Date.now();
        if (now - this.lastTrigger > 2000 && !this.popupShown && !this.popupClosed) { // 2 second throttle
            this.lastTrigger = now;
            
            console.log('Exit intent detected - showing popup'); // Debug log
            
            const overlay = this.querySelector('#exitPopupOverlay');
            if (overlay) {
                overlay.classList.add('show');
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
            } else {
                console.error('Popup overlay not found');
            }
        } else {
            console.log('Popup not shown - conditions not met:', {
                timeSinceLastTrigger: now - this.lastTrigger,
                popupShown: this.popupShown,
                popupClosed: this.popupClosed
            });
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
        // Dispatch custom event with coupon code
        this.dispatchEvent(new CustomEvent('offer-claimed', {
            bubbles: true,
            detail: { 
                couponCode: this.settings.couponCode,
                timestamp: Date.now()
            }
        }));

        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_offer_claimed', {
                coupon_code: this.settings.couponCode
            });
        }

        if (this.settings.ctaButtonLink && this.settings.ctaButtonLink.trim() !== '') {
            window.open(this.settings.ctaButtonLink, '_blank');
        } else {
            alert(`Discount code ${this.settings.couponCode} has been applied!`);
        }
        
        this.closePopup();
    }

    disconnectedCallback() {
        // Clean up event listeners
        window.removeEventListener('resize', this.onResize);
    }
}

// Register the custom element
customElements.define('exit-intent-popup', ExitIntentPopup);

export const STYLE = `
    :host {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        padding: 0;
        margin: 0;
    }
`;

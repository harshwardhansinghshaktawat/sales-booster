class ExitIntentPopupElement extends HTMLElement {
    constructor() {
        super();
        this.popupShown = false;
        this.mouseLeftWindow = false;
        this.popupClosed = false;
        this.lastTrigger = 0;
        this.lastScrollTop = 0;
        this.settings = {
            heading: 'Wait! Don\'t Miss Out!',
            subheading: 'You\'re about to leave, but we have an exclusive offer just for you!',
            description: 'Use code SAVE25 and get instant 25% discount on your entire order. This exclusive offer is only available for the next few minutes!',
            buttonText: 'Claim My Discount',
            buttonLink: '#',
            urgencyText: '⏰ Limited time offer - expires in 10 minutes!',
            headingFontSize: 28,
            subheadingFontSize: 18,
            descriptionFontSize: 16,
            buttonFontSize: 18,
            urgencyFontSize: 14,
            preset: 'modern-blue'
        };
        this.presets = {
            'modern-blue': {
                bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textColor: '#ffffff',
                buttonBg: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                buttonHover: 'linear-gradient(45deg, #0099cc, #2d5aa0)',
                discountBg: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                overlayColor: 'rgba(0, 0, 0, 0.8)'
            },
            'elegant-purple': {
                bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                textColor: '#333333',
                buttonBg: 'linear-gradient(45deg, #8e44ad, #9b59b6)',
                buttonHover: 'linear-gradient(45deg, #732d91, #8e44ad)',
                discountBg: 'linear-gradient(45deg, #e91e63, #ad1457)',
                overlayColor: 'rgba(0, 0, 0, 0.7)'
            },
            'vibrant-orange': {
                bgColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                textColor: '#2c3e50',
                buttonBg: 'linear-gradient(45deg, #e67e22, #d35400)',
                buttonHover: 'linear-gradient(45deg, #d35400, #a0421d)',
                discountBg: 'linear-gradient(45deg, #f39c12, #e67e22)',
                overlayColor: 'rgba(0, 0, 0, 0.6)'
            },
            'clean-green': {
                bgColor: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                textColor: '#2c3e50',
                buttonBg: 'linear-gradient(45deg, #27ae60, #2ecc71)',
                buttonHover: 'linear-gradient(45deg, #229954, #27ae60)',
                discountBg: 'linear-gradient(45deg, #f1c40f, #f39c12)',
                overlayColor: 'rgba(0, 0, 0, 0.75)'
            },
            'dark-mode': {
                bgColor: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                textColor: '#ecf0f1',
                buttonBg: 'linear-gradient(45deg, #e74c3c, #c0392b)',
                buttonHover: 'linear-gradient(45deg, #c0392b, #a93226)',
                discountBg: 'linear-gradient(45deg, #f1c40f, #f39c12)',
                overlayColor: 'rgba(0, 0, 0, 0.9)'
            },
            'sunrise': {
                bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                textColor: '#2c3e50',
                buttonBg: 'linear-gradient(45deg, #e91e63, #ad1457)',
                buttonHover: 'linear-gradient(45deg, #ad1457, #880e4f)',
                discountBg: 'linear-gradient(45deg, #ff5722, #d84315)',
                overlayColor: 'rgba(0, 0, 0, 0.65)'
            }
        };
    }

    connectedCallback() {
        this.renderPopup();
        this.setupEventListeners();
        this.initializeExitIntent();
    }

    static get observedAttributes() {
        return ['popup-data', 'popup-options'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue && newValue !== oldValue) {
            if (name === 'popup-data') {
                const newData = JSON.parse(newValue);
                Object.assign(this.settings, newData);
            } else if (name === 'popup-options') {
                const newOptions = JSON.parse(newValue);
                Object.assign(this.settings, newOptions);
            }
            this.updatePopupContent();
        }
    }

    renderPopup() {
        const preset = this.presets[this.settings.preset] || this.presets['modern-blue'];
        
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
                    background: ${preset.overlayColor};
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
                    background: ${preset.bgColor};
                    border-radius: 20px;
                    padding: 40px 30px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.4s ease-out;
                    color: ${preset.textColor};
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
                    color: ${preset.textColor};
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
                    font-size: ${this.settings.headingFontSize}px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .popup-subtitle {
                    font-size: ${this.settings.subheadingFontSize}px;
                    margin-bottom: 25px;
                    opacity: 0.9;
                    line-height: 1.4;
                }

                .discount-badge {
                    display: inline-block;
                    background: ${preset.discountBg};
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-size: 24px;
                    font-weight: 800;
                    margin: 20px 0;
                    color: white;
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
                    font-size: ${this.settings.descriptionFontSize}px;
                    margin: 20px 0;
                    line-height: 1.5;
                    opacity: 0.95;
                }

                .cta-button {
                    background: ${preset.buttonBg};
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
                    text-decoration: none;
                    display: inline-block;
                }

                .cta-button:hover {
                    background: ${preset.buttonHover};
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(58, 123, 213, 0.6);
                }

                .no-thanks {
                    background: transparent;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    padding: 12px 25px;
                    border-radius: 25px;
                    color: ${preset.textColor};
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
                    font-size: ${this.settings.urgencyFontSize}px;
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
                        font-size: ${Math.max(this.settings.headingFontSize - 4, 20)}px;
                    }

                    .popup-subtitle {
                        font-size: ${Math.max(this.settings.subheadingFontSize - 2, 14)}px;
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
                }

                .exit-popup * {
                    transition: all 0.3s ease;
                }
            </style>

            <div class="exit-popup-overlay" id="exitPopupOverlay">
                <div class="exit-popup">
                    <button class="close-btn" id="closeBtn">&times;</button>
                    
                    <div class="popup-icon">🎉</div>
                    
                    <h2 class="popup-title" id="popupTitle">${this.settings.heading}</h2>
                    
                    <p class="popup-subtitle" id="popupSubtitle">${this.settings.subheading}</p>
                    
                    <div class="discount-badge">25% OFF</div>
                    
                    <p class="popup-description" id="popupDescription">${this.settings.description}</p>
                    
                    <a href="${this.settings.buttonLink}" class="cta-button" id="ctaBtn">${this.settings.buttonText}</a>
                    <br>
                    <button class="no-thanks" id="noThanksBtn">No thanks, I'll pass</button>
                    
                    <p class="urgency-text" id="urgencyText">${this.settings.urgencyText}</p>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const overlay = this.querySelector('#exitPopupOverlay');
        const closeBtn = this.querySelector('#closeBtn');
        const ctaBtn = this.querySelector('#ctaBtn');
        const noThanksBtn = this.querySelector('#noThanksBtn');

        closeBtn.addEventListener('click', () => this.closePopup());
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
        // Desktop exit intent detection - mouse movement toward top of browser
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !this.popupShown && !this.popupClosed) {
                this.showExitPopup();
            }
        });

        // Mobile-specific exit intent (scroll to top quickly)
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop < this.lastScrollTop && scrollTop < 100 && this.lastScrollTop > 200) {
                if (!this.popupShown && !this.popupClosed) {
                    this.showExitPopup();
                }
            }
            
            this.lastScrollTop = scrollTop;
        });

        // Fallback trigger for testing - shows after 5 seconds
        setTimeout(() => {
            if (!this.popupShown && !this.popupClosed) {
                this.showExitPopup();
            }
        }, 5000);

        // Additional beforeunload detection
        window.addEventListener('beforeunload', (e) => {
            if (!this.popupShown && !this.popupClosed) {
                this.showExitPopup();
            }
        });
    }

    showExitPopup() {
        const now = Date.now();
        if (now - this.lastTrigger > 1000 && !this.popupShown && !this.popupClosed) {
            this.lastTrigger = now;
            const overlay = this.querySelector('#exitPopupOverlay');
            if (overlay) {
                overlay.classList.add('show');
                this.popupShown = true;
                console.log('Exit intent popup shown'); // For debugging
            }
        }
    }

    closePopup() {
        this.querySelector('#exitPopupOverlay').classList.remove('show');
        this.popupClosed = true;
    }

    updatePopupContent() {
        const preset = this.presets[this.settings.preset] || this.presets['modern-blue'];
        
        // Update text content
        const title = this.querySelector('#popupTitle');
        const subtitle = this.querySelector('#popupSubtitle');
        const description = this.querySelector('#popupDescription');
        const ctaBtn = this.querySelector('#ctaBtn');
        const urgencyText = this.querySelector('#urgencyText');

        if (title) title.textContent = this.settings.heading;
        if (subtitle) subtitle.textContent = this.settings.subheading;
        if (description) description.textContent = this.settings.description;
        if (ctaBtn) {
            ctaBtn.textContent = this.settings.buttonText;
            ctaBtn.href = this.settings.buttonLink;
        }
        if (urgencyText) urgencyText.textContent = this.settings.urgencyText;

        // Re-render to apply style changes
        this.renderPopup();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener('mouseleave', this.handleMouseLeave);
        document.removeEventListener('mouseenter', this.handleMouseEnter);
        window.removeEventListener('scroll', this.handleScroll);
    }
}

customElements.define('exit-intent-popup', ExitIntentPopupElement);

export const STYLE = `
    :host {
        display: block;
        position: relative;
    }
`;

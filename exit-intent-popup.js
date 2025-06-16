class ExitIntentPopupElement extends HTMLElement {
    constructor() {
        super();
        this.isShown = false;
        this.exitDetected = false;
        this.settings = {
            // Content Settings
            mainHeading: 'Wait! Don\'t Leave Yet!',
            subHeading: 'Get an exclusive discount before you go',
            discountText: '50% OFF',
            description: 'Limited time offer - Use code SAVE50 at checkout',
            buttonText: 'Claim Discount',
            buttonLink: '#',
            secondaryButtonText: 'No Thanks',
            
            // Style Settings
            fontFamily: 'Arial',
            headingFontSize: 32,
            subHeadingFontSize: 18,
            discountFontSize: 48,
            descriptionFontSize: 16,
            buttonFontSize: 18,
            
            // Colors
            overlayColor: '#000000',
            overlayOpacity: 70,
            textColor: '#333333',
            headingColor: '#333333',
            discountColor: '#e74c3c',
            buttonBackgroundColor: '#e74c3c',
            buttonTextColor: '#ffffff',
            secondaryButtonColor: '#666666',
            
            // Background Gradient
            backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            gradientPreset: 'blue-purple',
            
            // Animation & Behavior
            enableAnimations: true,
            animationStyle: 'slideUp',
            autoHide: false,
            hideDelay: 10000,
            
            // Mobile Settings
            mobileEnabled: true,
            mobileScrollTrigger: 80,
            
            // Advanced
            showOnMobile: true,
            showOnDesktop: true,
            borderRadius: 15,
            popupWidth: 500,
            popupMaxWidth: 90
        };
        
        this.gradientPresets = {
            'blue-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'orange-red': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'green-blue': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'purple-pink': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'sunset': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            'ocean': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'forest': 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
            'gold': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        };
    }

    connectedCallback() {
        this.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 999999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        this.render();
        this.attachEventListeners();
    }

    static get observedAttributes() {
        return ['settings', 'content'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue && newValue !== oldValue) {
            if (name === 'settings') {
                const newSettings = JSON.parse(newValue);
                Object.assign(this.settings, newSettings);
            } else if (name === 'content') {
                const contentData = JSON.parse(newValue);
                Object.assign(this.settings, contentData);
            }
            if (this.popup) {
                this.updatePopup();
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="exit-popup-overlay" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${this.settings.overlayColor};
                opacity: ${this.settings.overlayOpacity / 100};
            "></div>
            <div class="exit-popup-container" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                width: ${this.settings.popupWidth}px;
                max-width: ${this.settings.popupMaxWidth}%;
                background: ${this.settings.backgroundGradient};
                border-radius: ${this.settings.borderRadius}px;
                padding: 40px 30px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                font-family: ${this.settings.fontFamily};
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            ">
                <button class="exit-popup-close" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: ${this.settings.textColor};
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s ease;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
                
                <div class="exit-popup-content">
                    <h1 style="
                        margin: 0 0 10px 0;
                        font-size: ${this.settings.headingFontSize}px;
                        font-weight: bold;
                        color: ${this.settings.headingColor};
                        line-height: 1.2;
                    ">${this.settings.mainHeading}</h1>
                    
                    <p style="
                        margin: 0 0 20px 0;
                        font-size: ${this.settings.subHeadingFontSize}px;
                        color: ${this.settings.textColor};
                        opacity: 0.9;
                    ">${this.settings.subHeading}</p>
                    
                    <div class="discount-badge" style="
                        font-size: ${this.settings.discountFontSize}px;
                        font-weight: bold;
                        color: ${this.settings.discountColor};
                        margin: 20px 0;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                        line-height: 1;
                    ">${this.settings.discountText}</div>
                    
                    <p style="
                        margin: 0 0 30px 0;
                        font-size: ${this.settings.descriptionFontSize}px;
                        color: ${this.settings.textColor};
                        opacity: 0.8;
                        line-height: 1.4;
                    ">${this.settings.description}</p>
                    
                    <div class="button-group" style="
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                        flex-wrap: wrap;
                    ">
                        <button class="primary-button" style="
                            background: ${this.settings.buttonBackgroundColor};
                            color: ${this.settings.buttonTextColor};
                            border: none;
                            padding: 15px 30px;
                            font-size: ${this.settings.buttonFontSize}px;
                            font-weight: bold;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: transform 0.2s ease, box-shadow 0.2s ease;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                            min-width: 150px;
                        ">${this.settings.buttonText}</button>
                        
                        <button class="secondary-button" style="
                            background: transparent;
                            color: ${this.settings.secondaryButtonColor};
                            border: 2px solid ${this.settings.secondaryButtonColor};
                            padding: 13px 25px;
                            font-size: ${this.settings.buttonFontSize - 2}px;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        ">${this.settings.secondaryButtonText}</button>
                    </div>
                </div>
            </div>
        `;

        this.popup = this.querySelector('.exit-popup-container');
        this.overlay = this.querySelector('.exit-popup-overlay');
        this.closeBtn = this.querySelector('.exit-popup-close');
        this.primaryBtn = this.querySelector('.primary-button');
        this.secondaryBtn = this.querySelector('.secondary-button');

        // Add hover effects
        this.addHoverEffects();
    }

    addHoverEffects() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('mouseenter', () => {
                this.closeBtn.style.opacity = '1';
                this.closeBtn.style.transform = 'scale(1.1)';
            });
            this.closeBtn.addEventListener('mouseleave', () => {
                this.closeBtn.style.opacity = '0.7';
                this.closeBtn.style.transform = 'scale(1)';
            });
        }

        if (this.primaryBtn) {
            this.primaryBtn.addEventListener('mouseenter', () => {
                this.primaryBtn.style.transform = 'translateY(-2px)';
                this.primaryBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            });
            this.primaryBtn.addEventListener('mouseleave', () => {
                this.primaryBtn.style.transform = 'translateY(0)';
                this.primaryBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            });
        }

        if (this.secondaryBtn) {
            this.secondaryBtn.addEventListener('mouseenter', () => {
                this.secondaryBtn.style.background = this.settings.secondaryButtonColor;
                this.secondaryBtn.style.color = '#ffffff';
            });
            this.secondaryBtn.addEventListener('mouseleave', () => {
                this.secondaryBtn.style.background = 'transparent';
                this.secondaryBtn.style.color = this.settings.secondaryButtonColor;
            });
        }
    }

    attachEventListeners() {
        // Desktop exit intent detection
        if (this.settings.showOnDesktop) {
            document.addEventListener('mouseleave', this.handleExitIntent.bind(this));
        }

        // Mobile scroll detection
        if (this.settings.showOnMobile && this.settings.mobileEnabled) {
            let scrolled = false;
            window.addEventListener('scroll', () => {
                if (!scrolled && window.scrollY > this.settings.mobileScrollTrigger) {
                    scrolled = true;
                    this.handleExitIntent();
                }
            });
        }

        // Click event listeners
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', this.hidePopup.bind(this));
        }
        
        if (this.secondaryBtn) {
            this.secondaryBtn.addEventListener('click', this.hidePopup.bind(this));
        }
        
        if (this.primaryBtn) {
            this.primaryBtn.addEventListener('click', () => {
                if (this.settings.buttonLink && this.settings.buttonLink !== '#') {
                    window.open(this.settings.buttonLink, '_blank');
                }
                this.hidePopup();
            });
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', this.hidePopup.bind(this));
        }

        // Auto hide
        if (this.settings.autoHide && this.settings.hideDelay > 0) {
            setTimeout(() => {
                this.hidePopup();
            }, this.settings.hideDelay);
        }
    }

    handleExitIntent() {
        if (!this.exitDetected && !this.isShown) {
            this.exitDetected = true;
            this.showPopup();
        }
    }

    showPopup() {
        if (this.isShown) return;
        
        this.isShown = true;
        this.style.pointerEvents = 'all';
        this.style.opacity = '1';

        if (this.settings.enableAnimations) {
            setTimeout(() => {
                if (this.popup) {
                    this.popup.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            }, 10);
        } else {
            if (this.popup) {
                this.popup.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }
    }

    hidePopup() {
        if (!this.isShown) return;
        
        this.isShown = false;
        
        if (this.settings.enableAnimations) {
            if (this.popup) {
                this.popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
            }
            setTimeout(() => {
                this.style.opacity = '0';
                this.style.pointerEvents = 'none';
            }, 300);
        } else {
            this.style.opacity = '0';
            this.style.pointerEvents = 'none';
        }
    }

    updatePopup() {
        // Update gradient if preset changed
        if (this.settings.gradientPreset && this.gradientPresets[this.settings.gradientPreset]) {
            this.settings.backgroundGradient = this.gradientPresets[this.settings.gradientPreset];
        }
        
        // Re-render the popup
        this.render();
        this.attachEventListeners();
    }

    disconnectedCallback() {
        document.removeEventListener('mouseleave', this.handleExitIntent.bind(this));
        window.removeEventListener('scroll', this.handleScrollExit);
    }
}

customElements.define('exit-intent-popup', ExitIntentPopupElement);

export const STYLE = `
    :host {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    
    .exit-popup-container {
        animation: popupEntry 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    @keyframes popupEntry {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .exit-popup-container {
            width: 95% !important;
            padding: 30px 20px !important;
        }
        
        .button-group {
            flex-direction: column !important;
        }
        
        .primary-button,
        .secondary-button {
            width: 100% !important;
            min-width: auto !important;
        }
    }
`;

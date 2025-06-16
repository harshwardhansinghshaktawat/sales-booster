class ExitIntentPopupElement extends HTMLElement {
    constructor() {
        super();
        this.isShown = false;
        this.exitIntentTriggered = false;
        this.scrollThreshold = 0;
        this.timeThreshold = 0;
        this.startTime = Date.now();
        this.settings = {
            heading: 'Wait! Don\'t Leave Yet!',
            subheading: 'Special Offer Just For You',
            description: 'Get an exclusive discount before you go. This limited-time offer won\'t last long!',
            buttonText: 'Claim My Discount',
            buttonLink: '#',
            urgencyText: 'Limited Time Offer!',
            headingFontSize: 28,
            subheadingFontSize: 20,
            descriptionFontSize: 16,
            buttonFontSize: 18,
            urgencyFontSize: 14,
            preset: 'modern-blue',
            enableOnMobile: true,
            enableOnDesktop: true,
            delayTime: 3,
            scrollPercentage: 10
        };
        this.presets = {
            'modern-blue': {
                bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textColor: '#ffffff',
                buttonBg: '#4CAF50',
                buttonHover: '#45a049',
                borderColor: '#ffffff',
                overlayColor: 'rgba(0, 0, 0, 0.8)'
            },
            'elegant-purple': {
                bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                textColor: '#333333',
                buttonBg: '#8e44ad',
                buttonHover: '#732d91',
                borderColor: '#8e44ad',
                overlayColor: 'rgba(0, 0, 0, 0.7)'
            },
            'vibrant-orange': {
                bgColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                textColor: '#2c3e50',
                buttonBg: '#e67e22',
                buttonHover: '#d35400',
                borderColor: '#e67e22',
                overlayColor: 'rgba(0, 0, 0, 0.6)'
            },
            'clean-green': {
                bgColor: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                textColor: '#2c3e50',
                buttonBg: '#27ae60',
                buttonHover: '#229954',
                borderColor: '#27ae60',
                overlayColor: 'rgba(0, 0, 0, 0.75)'
            },
            'dark-mode': {
                bgColor: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                textColor: '#ecf0f1',
                buttonBg: '#e74c3c',
                buttonHover: '#c0392b',
                borderColor: '#ecf0f1',
                overlayColor: 'rgba(0, 0, 0, 0.9)'
            },
            'sunrise': {
                bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                textColor: '#2c3e50',
                buttonBg: '#e91e63',
                buttonHover: '#ad1457',
                borderColor: '#e91e63',
                overlayColor: 'rgba(0, 0, 0, 0.65)'
            }
        };
    }

    connectedCallback() {
        this.style.display = 'none';
        this.initExitIntent();
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
            this.updateStyles();
        }
    }

    initExitIntent() {
        // Desktop exit intent detection
        if (this.settings.enableOnDesktop && !this.isMobile()) {
            document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        }

        // Mobile scroll and time-based detection
        if (this.settings.enableOnMobile && this.isMobile()) {
            window.addEventListener('scroll', this.handleScroll.bind(this));
            setTimeout(() => {
                if (!this.exitIntentTriggered) {
                    this.showPopup();
                }
            }, this.settings.delayTime * 1000);
        }

        // Fallback time-based detection for desktop
        if (this.settings.enableOnDesktop && !this.isMobile()) {
            setTimeout(() => {
                if (!this.exitIntentTriggered) {
                    this.showPopup();
                }
            }, (this.settings.delayTime + 5) * 1000);
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }

    handleMouseLeave(e) {
        if (e.clientY <= 0 && !this.exitIntentTriggered) {
            this.showPopup();
        }
    }

    handleMouseEnter(e) {
        // Reset if user re-enters
    }

    handleScroll() {
        const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercentage >= this.settings.scrollPercentage && !this.exitIntentTriggered) {
            this.showPopup();
        }
    }

    showPopup() {
        if (this.isShown || this.exitIntentTriggered) return;
        
        this.exitIntentTriggered = true;
        this.isShown = true;
        this.renderPopup();
        this.style.display = 'block';
        
        // Add animation
        requestAnimationFrame(() => {
            this.querySelector('.popup-overlay').style.opacity = '1';
            this.querySelector('.popup-content').style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    renderPopup() {
        const preset = this.presets[this.settings.preset] || this.presets['modern-blue'];
        
        this.innerHTML = `
            <div class="popup-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${preset.overlayColor};
                z-index: 999999;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            ">
                <div class="popup-content" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.8);
                    background: ${preset.bgColor};
                    color: ${preset.textColor};
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    border: 2px solid ${preset.borderColor};
                    transition: transform 0.3s ease-in-out;
                ">
                    <div class="close-btn" style="
                        position: absolute;
                        top: 15px;
                        right: 20px;
                        background: none;
                        border: none;
                        font-size: 24px;
                        color: ${preset.textColor};
                        cursor: pointer;
                        opacity: 0.7;
                        transition: opacity 0.2s;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">&times;</div>
                    
                    <div class="urgency-badge" style="
                        background: rgba(255, 255, 255, 0.2);
                        color: ${preset.textColor};
                        padding: 8px 16px;
                        border-radius: 20px;
                        display: inline-block;
                        margin-bottom: 20px;
                        font-size: ${this.settings.urgencyFontSize}px;
                        font-weight: bold;
                        animation: pulse 2s infinite;
                    ">${this.settings.urgencyText}</div>
                    
                    <h1 style="
                        margin: 0 0 15px 0;
                        font-size: ${this.settings.headingFontSize}px;
                        font-weight: bold;
                        line-height: 1.2;
                    ">${this.settings.heading}</h1>
                    
                    <h2 style="
                        margin: 0 0 20px 0;
                        font-size: ${this.settings.subheadingFontSize}px;
                        font-weight: 600;
                        opacity: 0.9;
                        line-height: 1.3;
                    ">${this.settings.subheading}</h2>
                    
                    <p style="
                        margin: 0 0 30px 0;
                        font-size: ${this.settings.descriptionFontSize}px;
                        line-height: 1.5;
                        opacity: 0.8;
                    ">${this.settings.description}</p>
                    
                    <a href="${this.settings.buttonLink}" style="
                        display: inline-block;
                        background: ${preset.buttonBg};
                        color: white;
                        padding: 15px 30px;
                        border: none;
                        border-radius: 50px;
                        font-size: ${this.settings.buttonFontSize}px;
                        font-weight: bold;
                        text-decoration: none;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    " onmouseover="this.style.background='${preset.buttonHover}'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 0, 0, 0.3)'"
                       onmouseout="this.style.background='${preset.buttonBg}'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 0, 0, 0.2)'"
                    >${this.settings.buttonText}</a>
                </div>
            </div>
        `;

        // Add keyframe animation for pulse effect
        if (!document.getElementById('exit-intent-styles')) {
            const style = document.createElement('style');
            style.id = 'exit-intent-styles';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                @media (max-width: 768px) {
                    .popup-content {
                        padding: 25px !important;
                        margin: 10px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Close button functionality
        this.querySelector('.close-btn').addEventListener('click', () => {
            this.hidePopup();
        });

        // Close on overlay click
        this.querySelector('.popup-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hidePopup();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isShown) {
                this.hidePopup();
            }
        });
    }

    hidePopup() {
        const overlay = this.querySelector('.popup-overlay');
        const content = this.querySelector('.popup-content');
        
        if (overlay && content) {
            overlay.style.opacity = '0';
            content.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            setTimeout(() => {
                this.style.display = 'none';
                this.isShown = false;
            }, 300);
        }
    }

    updateStyles() {
        if (this.isShown) {
            this.hidePopup();
            setTimeout(() => {
                this.showPopup();
            }, 350);
        }
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
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
        z-index: 999999;
    }
`;

class ExitIntentPopup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isPopupShown = false;
    this.exitIntentTriggered = false;
    this.mouseLeaveHandler = null;
    this.mouseMoveHandler = null;
    this.popupCloseHandler = null;
  }

  static get observedAttributes() {
    return [
      'popup-heading', 'popup-subheading', 'popup-description', 'coupon-code',
      'button-text', 'button-link', 'background-color', 'text-color', 
      'button-color', 'popup-width', 'popup-height', 'overlay-opacity'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.setupExitIntentDetection();
  }

  disconnectedCallback() {
    this.removeExitIntentDetection();
  }

  setupExitIntentDetection() {
    // Detect when mouse leaves the top of the viewport (exit intent)
    this.mouseLeaveHandler = (event) => {
      // Check if mouse is leaving through the top of the viewport
      if (event.clientY <= 0 && !this.exitIntentTriggered) {
        this.exitIntentTriggered = true;
        this.showPopup();
      }
    };

    // Additional detection for fast mouse movement towards top
    this.mouseMoveHandler = (event) => {
      if (event.clientY <= 50 && event.movementY < -10 && !this.exitIntentTriggered) {
        this.exitIntentTriggered = true;
        this.showPopup();
      }
    };

    document.addEventListener('mouseleave', this.mouseLeaveHandler);
    document.addEventListener('mousemove', this.mouseMoveHandler);
  }

  removeExitIntentDetection() {
    if (this.mouseLeaveHandler) {
      document.removeEventListener('mouseleave', this.mouseLeaveHandler);
    }
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }

  showPopup() {
    if (this.isPopupShown) return;
    
    const popup = this.shadowRoot.querySelector('.exit-popup');
    const overlay = this.shadowRoot.querySelector('.popup-overlay');
    
    if (popup && overlay) {
      this.isPopupShown = true;
      overlay.style.display = 'flex';
      
      // Animate popup in
      setTimeout(() => {
        overlay.classList.add('show');
        popup.classList.add('show');
      }, 10);
    }
  }

  hidePopup() {
    const popup = this.shadowRoot.querySelector('.exit-popup');
    const overlay = this.shadowRoot.querySelector('.popup-overlay');
    
    if (popup && overlay) {
      overlay.classList.remove('show');
      popup.classList.remove('show');
      
      setTimeout(() => {
        overlay.style.display = 'none';
        this.isPopupShown = false;
      }, 300);
    }
  }

  handleButtonClick() {
    const buttonLink = this.getAttribute('button-link') || '#';
    if (buttonLink && buttonLink !== '#') {
      window.open(buttonLink, '_blank');
    }
    this.hidePopup();
  }

  render() {
    const popupHeading = this.getAttribute('popup-heading') || 'Wait! Don\'t Leave Yet!';
    const popupSubheading = this.getAttribute('popup-subheading') || 'Special Offer Just For You';
    const popupDescription = this.getAttribute('popup-description') || 'Get an exclusive discount before you go!';
    const couponCode = this.getAttribute('coupon-code') || 'SAVE20';
    const buttonText = this.getAttribute('button-text') || 'Claim Offer';
    const buttonLink = this.getAttribute('button-link') || '#';
    const backgroundColor = this.getAttribute('background-color') || '#ffffff';
    const textColor = this.getAttribute('text-color') || '#333333';
    const buttonColor = this.getAttribute('button-color') || '#ff6b6b';
    const popupWidth = parseInt(this.getAttribute('popup-width')) || 500;
    const popupHeight = parseInt(this.getAttribute('popup-height')) || 400;
    const overlayOpacity = this.getAttribute('overlay-opacity') || '0.8';

    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, ${overlayOpacity});
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .popup-overlay.show {
          opacity: 1;
        }

        .exit-popup {
          background-color: ${backgroundColor};
          color: ${textColor};
          border-radius: 15px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          max-width: ${popupWidth}px;
          max-height: ${popupHeight}px;
          width: 90vw;
          padding: 40px 30px;
          text-align: center;
          position: relative;
          transform: scale(0.7) translateY(-50px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .exit-popup.show {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: ${textColor};
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .close-btn:hover {
          opacity: 1;
        }

        .popup-heading {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .popup-subheading {
          font-size: 18px;
          margin-bottom: 20px;
          opacity: 0.8;
          font-weight: 500;
        }

        .popup-description {
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 25px;
          opacity: 0.9;
        }

        .coupon-section {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 15px;
          border-radius: 10px;
          margin: 20px 0;
          position: relative;
          overflow: hidden;
        }

        .coupon-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shine 2s infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .coupon-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 5px;
        }

        .coupon-code {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 2px;
          font-family: 'Courier New', monospace;
        }

        .cta-button {
          background: ${buttonColor};
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          font-weight: bold;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          margin-top: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          filter: brightness(1.1);
        }

        .cta-button:active {
          transform: translateY(0);
        }

        @media (max-width: 600px) {
          .exit-popup {
            padding: 30px 20px;
            margin: 20px;
          }
          
          .popup-heading {
            font-size: 24px;
          }
          
          .popup-subheading {
            font-size: 16px;
          }
          
          .coupon-code {
            font-size: 20px;
          }
        }
      </style>
      
      <div class="popup-overlay" onclick="event.target === this && this.getRootNode().host.hidePopup()">
        <div class="exit-popup">
          <button class="close-btn" onclick="this.getRootNode().host.hidePopup()">&times;</button>
          
          <div class="popup-heading">${popupHeading}</div>
          <div class="popup-subheading">${popupSubheading}</div>
          <div class="popup-description">${popupDescription}</div>
          
          <div class="coupon-section">
            <div class="coupon-label">Use Code:</div>
            <div class="coupon-code">${couponCode}</div>
          </div>
          
          <button class="cta-button" onclick="this.getRootNode().host.handleButtonClick()">
            ${buttonText}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('exit-intent-popup', ExitIntentPopup);

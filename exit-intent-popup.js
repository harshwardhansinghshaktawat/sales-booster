class ExitIntentPopup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isVisible = false;
  }

  static get observedAttributes() {
    return [
      'popup-heading',
      'popup-subheading',
      'popup-description',
      'coupon-code',
      'button-text',
      'button-link'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.setupExitIntent();
  }

  disconnectedCallback() {
    document.removeEventListener('mouseout', this.handleExitIntent.bind(this));
  }

  setupExitIntent() {
    // Detect exit intent by monitoring mouseout events
    this.handleExitIntent = (event) => {
      if (!this.isVisible && event.toElement === null && event.relatedTarget === null) {
        this.isVisible = true;
        this.render();
      }
    };
    document.addEventListener('mouseout', this.handleExitIntent.bind(this));
  }

  closePopup() {
    this.isVisible = false;
    this.render();
  }

  render() {
    const heading = this.getAttribute('popup-heading') || 'Special Offer!';
    const subheading = this.getAttribute('popup-subheading') || 'Don’t Miss Out!';
    const description = this.getAttribute('popup-description') || 'Get exclusive discounts before you go.';
    const couponCode = this.getAttribute('coupon-code') || 'SAVE20';
    const buttonText = this.getAttribute('button-text') || 'Shop Now';
    const buttonLink = this.getAttribute('button-link') || 'https://example.com';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${this.isVisible ? 'flex' : 'none'};
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          justify-content: center;
          align-items: center;
          z-index: 1000;
          font-family: Arial, sans-serif;
        }
        .popup {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 400px;
          text-align: center;
          position: relative;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          font-size: 20px;
        }
        h1 {
          font-size: 24px;
          margin: 0 0 10px;
        }
        h2 {
          font-size: 18px;
          margin: 0 0 10px;
        }
        p {
          font-size: 16px;
          margin: 0 0 20px;
        }
        .coupon {
          font-size: 20px;
          font-weight: bold;
          color: #e74c3c;
          margin: 0 0 20px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
        }
        .button:hover {
          background: #2980b9;
        }
      </style>
      <div class="popup">
        <span class="close-button" onclick="this.getRootNode().host.closePopup()">×</span>
        <h1>${heading}</h1>
        <h2>${subheading}</h2>
        <p>${description}</p>
        <div class="coupon">${couponCode}</div>
        <a class="button" href="${buttonLink}" target="_blank">${buttonText}</a>
      </div>
    `;
  }
}

customElements.define('exit-intent-popup', ExitIntentPopup);

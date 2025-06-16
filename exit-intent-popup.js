class ExitIntentPopup extends HTMLElement {
    constructor() {
        super();
        this.settings = {
            popupText: "Don't Leave Yet! Get 20% OFF Your Next Purchase!",
            buttonText: "Claim Discount",
            buttonLink: "#",
            fontFamily: "Arial",
            fontSize: 16,
            textColor: "#333333",
            buttonColor: "#3498db",
            buttonTextColor: "#ffffff",
            backgroundGradient: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
            showOnce: true,
            animationDuration: 300,
            borderRadius: 10,
            maxWidth: 400
        };
        this.hasShown = false;
    }

    connectedCallback() {
        // Apply basic styles to the host element
        Object.assign(this.style, {
            display: "none",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "9999",
            justifyContent: "center",
            alignItems: "center"
        });

        // Create popup container
        this.popup = document.createElement("div");
        Object.assign(this.popup.style, {
            background: this.settings.backgroundGradient,
            padding: "20px",
            borderRadius: `${this.settings.borderRadius}px`,
            maxWidth: `${this.settings.maxWidth}px`,
            width: "90%",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            transform: "scale(0.7)",
            opacity: "0",
            transition: `all ${this.settings.animationDuration}ms ease-in-out`,
            fontFamily: this.settings.fontFamily
        });

        // Create popup text
        this.textElement = document.createElement("p");
        Object.assign(this.textElement.style, {
            fontSize: `${this.settings.fontSize}px`,
            color: this.settings.textColor,
            margin: "0 0 20px 0"
        });
        this.textElement.textContent = this.settings.popupText;

        // Create button
        this.button = document.createElement("a");
        Object.assign(this.button.style, {
            display: "inline-block",
            padding: "10px 20px",
            background: this.settings.buttonColor,
            color: this.settings.buttonTextColor,
            textDecoration: "none",
            borderRadius: "5px",
            fontSize: `${this.settings.fontSize - 2}px`,
            fontWeight: "bold",
            cursor: "pointer"
        });
        this.button.textContent = this.settings.buttonText;
        this.button.href = this.settings.buttonLink;

        // Append elements
        this.popup.appendChild(this.textElement);
        this.popup.appendChild(this.button);
        this.appendChild(this.popup);

        // Close button
        this.closeButton = document.createElement("span");
        Object.assign(this.closeButton.style, {
            position: "absolute",
            top: "10px",
            right: "15px",
            fontSize: "20px",
            cursor: "pointer",
            color: this.settings.textColor
        });
        this.closeButton.textContent = "×";
        this.closeButton.onclick = () => this.hidePopup();
        this.popup.appendChild(this.closeButton);

        // Detect exit intent
        this.setupExitIntent();
    }

    static get observedAttributes() {
        return ["options"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "options" && newValue && newValue !== oldValue) {
            const newOptions = JSON.parse(newValue);
            Object.assign(this.settings, newOptions);
            this.updatePopup();
        }
    }

    setupExitIntent() {
        // Mouse leave detection for desktop
        document.addEventListener("mouseout", (e) => {
            if (e.relatedTarget === null && !this.hasShown && this.settings.showOnce) {
                this.showPopup();
                this.hasShown = true;
            } else if (!this.settings.showOnce && e.relatedTarget === null) {
                this.showPopup();
            }
        });

        // Mobile touch detection (simulating exit intent with scroll up)
        let lastScrollY = window.scrollY;
        window.addEventListener("scroll", () => {
            if (window.scrollY < lastScrollY && window.scrollY < 100 && !this.hasShown && this.settings.showOnce) {
                this.showPopup();
                this.hasShown = true;
            } else if (window.scrollY < lastScrollY && window.scrollY < 100 && !this.settings.showOnce) {
                this.showPopup();
            }
            lastScrollY = window.scrollY;
        });

        // Prevent popup from showing if user clicks outside
        this.addEventListener("click", (e) => {
            if (e.target === this) this.hidePopup();
        });
    }

    showPopup() {
        this.style.display = "flex";
        setTimeout(() => {
            this.popup.style.transform = "scale(1)";
            this.popup.style.opacity = "1";
        }, 10);
    }

    hidePopup() {
        this.popup.style.transform = "scale(0.7)";
        this.popup.style.opacity = "0";
        setTimeout(() => {
            this.style.display = "none";
        }, this.settings.animationDuration);
    }

    updatePopup() {
        // Update styles and content
        this.popup.style.background = this.settings.backgroundGradient;
        this.popup.style.borderRadius = `${this.settings.borderRadius}px`;
        this.popup.style.maxWidth = `${this.settings.maxWidth}px`;
        this.popup.style.fontFamily = this.settings.fontFamily;
        this.popup.style.transition = `all ${this.settings.animationDuration}ms ease-in-out`;

        this.textElement.textContent = this.settings.popupText;
        this.textElement.style.fontSize = `${this.settings.fontSize}px`;
        this.textElement.style.color = this.settings.textColor;

        this.button.textContent = this.settings.buttonText;
        this.button.href = this.settings.buttonLink;
        this.button.style.background = this.settings.buttonColor;
        this.button.style.color = this.settings.buttonTextColor;
        this.button.style.fontSize = `${this.settings.fontSize - 2}px`;

        this.closeButton.style.color = this.settings.textColor;
    }

    disconnectedCallback() {
        // Clean up event listeners
        document.removeEventListener("mouseout", this.showPopup);
        window.removeEventListener("scroll", this.showPopup);
    }
}

customElements.define("exit-intent-popup", ExitIntentPopup);

export const STYLE = `
    :host {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        justify-content: center;
        align-items: center;
    }
    div {
        box-sizing: border-box;
        transform: scale(0.7);
        opacity: 0;
    }
    @media (max-width: 600px) {
        div {
            width: 95%;
            padding: 15px;
        }
    }
`;

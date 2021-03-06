/**
 * Action element component.
 *
 * All the custom with actions should extend this class.
 */
class ActionElement extends HTMLElement {
  /**
   * Style sheet
   */
  /** */
  get styleSheet() {
    return [new CSSStyleSheet()];
  }

  /**
   * Attributes
   */
  /** */
  static observedAttributesDefault = ['href', 'target', 'disabled', 'data-aria-label'];
  static get observedAttributes() {
    return [...this.observedAttributesDefault];
  }
  get ariaLabel(): string {
    return this.getAttribute('data-aria-label');
  }
  set ariaLabel(value: string) {
    this.setAttribute('data-aria-label', value);
  }
  get href(): string {
    return this.getAttribute('href');
  }
  set href(value: string) {
    this.setAttribute('href', value);
  }
  get target(): string {
    return this.getAttribute('target');
  }
  set target(value: string) {
    this.setAttribute('target', value);
  }
  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
  focus(): void {
    if (this.buttonElement) {
      this.buttonElement.focus();
    }
  }
  blur(): void {
    if (this.buttonElement) {
      this.buttonElement.blur();
    }
  }

  static tagName: string;
  buttonElement: HTMLLinkElement;

  /**
   * Life cycle
   */
  /** */
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = this.render();
    this.shadowRoot.adoptedStyleSheets = this.styleSheet;

    this.buttonElement = this.shadowRoot.querySelector(`.${this.tagName.toLowerCase()}`) as HTMLLinkElement;
    this.addEventListener('focus', () => {
      this.buttonElement.focus();
    });
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.buttonElement) {
      if (name === 'href') {
        if (this.buttonElement.tagName === 'A') {
          if (newValue) {
            this.buttonElement.href = newValue;
          } else {
            this.shadowRoot.innerHTML = this.render();
            this.buttonElement = this.shadowRoot.querySelector(`.${this.tagName.toLowerCase()}`) as HTMLLinkElement;
          }
        } else {
          this.shadowRoot.innerHTML = this.render();
          this.buttonElement = this.shadowRoot.querySelector(`.${this.tagName.toLowerCase()}`) as HTMLLinkElement;
        }
      } else if (name === 'target') {
        if (newValue) {
          this.buttonElement.target = newValue;
        } else {
          this.buttonElement.removeAttribute('target');
        }
      } else if (name === 'disabled') {
        this.buttonElement.disabled = this.disabled;
      } else if (name === 'data-aria-label') {
        if (newValue) {
          this.buttonElement.ariaLabel = this.ariaLabel;
        } else {
          this.buttonElement.removeAttribute('aria-label');
        }
      }
    }
  }

  /**
   * Events
   */
  /** */

  /**
   * Render
   */
  /** */
  protected render(): string {
    return `${this.renderButton()}`;
  }
  protected renderButton(_content: string = '<slot></slot>'): string {
    return `
    <${
      this.href ? 'a' + ' href="' + this.href + '"' + (this.target ? ' target="' + this.target + '"' : '') : 'button'
    } rule="button"
      class="${this.tagName.toLowerCase()}"
      ${this.ariaLabel ? 'aria-label="' + this.ariaLabel + '"' : ''}
      ${this.disabled ? 'disabled' : ''}>
      ${_content}
    </${this.href ? 'a' : 'button'}>`;
  }
}

export default ActionElement;

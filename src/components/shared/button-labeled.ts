import ActionElement from './action-element';

/**
 * Base button component with label.
 *
 * All the custom with actions like a button with label should extend this class.
 */
class ActionElementLabeled extends ActionElement {
  /**
   * Attributes
   */
  /** */
  static observedAttributesDefault = ['label', 'href', 'target', 'disabled', 'data-aria-label'];
  get label(): string {
    return this.getAttribute('label');
  }
  set label(value: string) {
    this.setAttribute('label', value);
  }

  labelElement: HTMLElement;

  /**
   * Life cycle
   */
  /** */
  connectedCallback() {
    super.connectedCallback();

    this.labelElement = this.shadowRoot.querySelector(`.${this.tagName.toLowerCase()}__label`) as HTMLElement;
  }
  override attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (this.buttonElement && this.labelElement) {
      if (name === 'label') {
        this.labelElement.textContent = newValue;
        if (!this.ariaLabel) {
          this.buttonElement.ariaLabel = newValue;
          if (newValue === '') {
            this.buttonElement.removeAttribute('aria-label');
          }
        }
      }
    }
  }

  /**
   * Render
   */
  /** */
  protected override renderButton(
    _content: string = `
    <span class="${this.tagName.toLowerCase()}__label">${this.label ? this.label : ''}</span>
    <slot></slot>`
  ): string {
    return `
    <${
      this.href ? 'a' + ' href="' + this.href + '"' + (this.target ? ' target="' + this.target + '"' : '') : 'button'
    } rule="button"
      class="${this.tagName.toLowerCase()}"
      ${this.ariaLabel ? 'aria-label="' + this.ariaLabel + '"' : this.label ? 'aria-label="' + this.label + '"' : ''}
      ${this.disabled ? 'disabled' : ''}>
      ${_content}
    </${this.href ? 'a' : 'button'}>`;
  }
}

export default ActionElementLabeled;

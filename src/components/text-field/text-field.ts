import BaseTextField from '../shared/text-field';
import M3TextFieldStyles from './text-field-styles.scss';

const sheet = new CSSStyleSheet();
sheet.replaceSync(M3TextFieldStyles);

/**
 * Text field component.
 */
class M3TextField extends BaseTextField {
  override get styleSheet() {
    return [sheet];
  }

  static get observedAttributes() {
    return ['label', 'outlined', 'help-text', ...this.observedAttributesDefault];
  }
  get label(): string {
    return this.getAttribute('label') || '';
  }
  set label(value: string) {
    this.setAttribute('label', value);
  }
  get helpText(): string {
    return this.getAttribute('help-text') || '';
  }
  set helpText(value: string) {
    this.setAttribute('help-text', value);
  }
  get error(): boolean {
    return this.hasAttribute('error');
  }
  set error(value: boolean) {
    if (value) {
      this.setAttribute('error', '');
    } else {
      this.removeAttribute('error');
    }
  }

  static tagName: string = 'md-text-field';
  labelElement: HTMLElement;
  labelKeeperElement: HTMLElement;
  containerElement: HTMLElement;
  helpTextElement: HTMLElement;
  counterElement: HTMLElement;

  /**
   * Life cycle
   */
  /** */
  connectedCallback() {
    this.shadowRoot.innerHTML = this.render();
    this.shadowRoot.adoptedStyleSheets = this.styleSheet;
    this.defines();
    this.binds();
    this._onInput();
    this._onChange();
  }
  attributeChangedCallback = (name: string, oldValue: string, newValue: string) => {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'label') {
      this.labelElement.textContent = this.label;
      this.labelKeeperElement ? (this.labelKeeperElement.textContent = this.label) : null;
    } else if (name === 'help-text') {
      this.helpTextElement.textContent = this.helpText;
    } else if (name === 'outlined') {
      this.shadowRoot.innerHTML = this.render();
      this.defines();
      this.binds();
      this._onInput();
      this._onChange();
    }
  };

  /**
   * Render
   */
  /** */
  protected override render(): string {
    return this.hasAttribute('outlined') ? this.renderOutlined() : this.renderFilled();
  }
  protected renderFilled(): string {
    return `
    <label class="md-text-field">
      <span class="md-text-field__label">${this.label}</span>
      ${this.renderInput('md-text-field__input')}
      <span class="md-text-field__underline"></span>
    </label>
    <p class="md-text-field__helper">
      <span class="md-text-field__help-text">${this.helpText}</span>
      <span class="md-text-field__counter"></span>
    </p>`;
  }
  protected renderOutlined(): string {
    return `
    <label class="md-text-field">
      <span class="md-text-field__label">${this.label}</span>
      ${this.renderInput('md-text-field__input')}
      <md-notched-outline>
        <span class="md-text-field__label-keeper">${this.label}</legend>
      </md-notched-outline>
    </label>
    <p class="md-text-field__helper">
      <span class="md-text-field__help-text">${this.helpText}</span>
      <span class="md-text-field__counter"></span>
    </p>`;
  }

  protected defines() {
    this.inputElement = this.shadowRoot.querySelector('.md-text-field__input') as HTMLInputElement;
    this.labelElement = this.shadowRoot.querySelector('.md-text-field__label') as HTMLLabelElement;
    this.labelKeeperElement = this.shadowRoot.querySelector('.md-text-field__label-keeper') as HTMLElement;
    this.containerElement = this.shadowRoot.querySelector('.md-text-field') as HTMLElement;
    this.helpTextElement = this.shadowRoot.querySelector('.md-text-field__help-text') as HTMLElement;
    this.counterElement = this.shadowRoot.querySelector('.md-text-field__counter') as HTMLElement;
  }

  /**
   * Events
   */
  /** */
  protected override _onFocus() {
    this.containerElement.classList.add('md-text-field--focused');
    this.onFocus();
  }
  protected override _onBlur() {
    this.containerElement.classList.remove('md-text-field--focused');
    this.onBlur();
  }
  protected override _onChange() {
    this.value = this.inputElement.value;
    if (this.inputElement.value === '') {
      this.containerElement.classList.remove('md-text-field--keep');
    } else {
      this.containerElement.classList.add('md-text-field--keep');
    }
    this.onChange();
  }
  protected override _onInput() {
    this.value = this.inputElement.value;
    if (this.maxlength) {
      this.counterElement.textContent = `${this.inputElement.value.length}/${this.maxlength}`;
    }
    this.onInput();
  }
}

if (!customElements.get(M3TextField.tagName)) {
  customElements.define(M3TextField.tagName, M3TextField);
}
export default M3TextField;

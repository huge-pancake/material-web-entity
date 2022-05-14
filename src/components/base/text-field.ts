/**
 * Base text field component.
 *
 * All the custom with actions like a text field should extend this class.
 */
class BaseTextField extends HTMLElement {
  static tagName: string;
  nativeNode: HTMLInputElement;

  static observedAttributesDefault = [
    'disabled',
    'type',
    'readonly',
    'required',
    'placeholder',
    'value',
    'autocomplete',
  ];
  static get observedAttributes() {
    return [...this.observedAttributesDefault];
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = this.render();

    this.nativeNode = this.shadowRoot.getElementById('bs-text-field') as HTMLInputElement;
    this.nativeNode.addEventListener('focus', () => this.onFocus());
    this.nativeNode.addEventListener('blur', () => this.onBlur());
    this.nativeNode.addEventListener('change', () => this.onChange());
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.nativeNode) {
      if (name === 'disabled') {
        this.nativeNode.disabled = this.disabled;
      } else if (name === 'type') {
        this.nativeNode.type = this.type;
      } else if (name === 'readonly') {
        this.nativeNode.readOnly = this.readonly;
      } else if (name === 'required') {
        this.nativeNode.required = this.required;
      } else if (name === 'placeholder') {
        this.nativeNode.placeholder = this.placeholder;
      } else if (name === 'value') {
        this.nativeNode.value = this.value;
      } else if (name === 'autocomplete') {
        this.nativeNode.autocomplete = this.autocomplete;
      }
      this.attributeChangedCallbackExtend(name, oldValue, newValue);
    }
  }
  protected attributeChangedCallbackExtend = (_name: string, _oldValue: string, _newValue: string) => {};

  protected render(): string {
    return `
    <style>
      :host {
        position: relative;
        box-sizing: border-box;
        display: inline-flex;
        -webkit-tap-highlight-color: transparent;
      }
    </style>
    ${this.renderInput('bs-text-field')}
    `;
  }
  protected renderInput(identifier: string): string {
    return `
    <input
      class="${identifier}"
      id="${identifier}"
      ${this.disabled ? 'disabled' : ''}
      ${this.type ? 'type="' + this.type + '"' : ''}
      ${this.readonly ? 'readonly' : ''}
      ${this.required ? 'required' : ''}
      ${this.placeholder ? 'placeholder="' + this.placeholder + '"' : ''}
      ${this.value ? 'value="' + this.value + '"' : ''}
      ${this.autocomplete ? 'autocomplete="' + this.autocomplete + '"' : ''}
    />`;
  }

  protected onFocus() {
    this.dispatchEvent(new CustomEvent('focus'));
    this.exFocus();
  }
  protected exFocus() {}
  protected onBlur() {
    this.dispatchEvent(new CustomEvent('blur'));
    this.exBlur();
  }
  protected exBlur() {}
  protected onChange() {
    this.dispatchEvent(new Event('change'));
    this.value = this.nativeNode.value;
    this.exChange();
  }
  protected exChange() {}

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
  get type(): string {
    return this.getAttribute('type');
  }
  set type(value: string) {
    this.setAttribute('type', value);
  }
  get readonly(): boolean {
    return this.hasAttribute('readonly');
  }
  set readonly(value: boolean) {
    if (value) {
      this.setAttribute('readonly', '');
    } else {
      this.removeAttribute('readonly');
    }
  }
  get required(): boolean {
    return this.hasAttribute('required');
  }
  set required(value: boolean) {
    if (value) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }
  get placeholder(): string {
    return this.getAttribute('placeholder');
  }
  set placeholder(value: string) {
    this.setAttribute('placeholder', value);
  }
  get value(): string {
    return this.getAttribute('value');
  }
  set value(value: string) {
    this.setAttribute('value', value);
  }
  get autocomplete(): string {
    return this.getAttribute('autocomplete');
  }
  set autocomplete(value: string) {
    this.setAttribute('autocomplete', value);
  }
}

export default BaseTextField;

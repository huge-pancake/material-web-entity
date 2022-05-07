import styles from './menu-item-styles.scss';

/**
 * MenuItem component.
 *
 * The item in the menu.
 * TODO: be 'list-item'
 */
class MenuItem extends HTMLElement {
  static tagName: string = 'md-menu-item';
  
  itemE: HTMLButtonElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>${styles}</style>
    <button class="md-menu__item" id="md-menu__item">
      <md-ripple></md-ripple>
      <slot name="before"></slot>
      <slot name="label"></slot>
      <div class="md-menu__item__spacer"></div>
      <slot name="after"></slot>
    </button>
    `;
  }

  focus() {
    this.itemE.focus();
  }

  get tabIndex() {
    return this.itemE.tabIndex;
  }
  set tabIndex(value: number) {
    this.itemE.tabIndex = value;
  }
  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  connectedCallback() {
    this.render();

    this.itemE = this.shadowRoot.getElementById('md-menu__item') as HTMLButtonElement;

    this.tabIndex = -1;
    this.itemE.addEventListener('focus', () => this.setAttribute('focused', ''));
    this.itemE.addEventListener('blur', () => this.removeAttribute('focused'));
  }
}

if (!customElements.get(MenuItem.tagName)) {
  customElements.define(MenuItem.tagName, MenuItem);
}
export default MenuItem;

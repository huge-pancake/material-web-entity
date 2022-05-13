import styles from './ripple-styles.scss';

/**
 * Ripple component.
 *
 * Button, Card and Menu are all request define this component as 'md-ripple'
 */
class Ripple extends HTMLElement {
  static tagName: string = 'md-ripple';

  parentE: HTMLElement;
  containerE: HTMLElement;
  radius: number;
  centerRadius: number;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${styles}</style>
    <div class="md-ripple__container" id="md-ripple__container"></div>
    `;
  }

  addActiveLayer(_event: { clientX: number; clientY: number }) {
    let ripple = document.createElement('span');
    ripple.classList.add('md-ripple__element');

    let rect = this.parentE.getBoundingClientRect();
    let x = _event.clientX - rect.left,
      y = _event.clientY - rect.top;
    this.radius = Math.max(
      Math.sqrt(x ** 2 + y ** 2),
      Math.sqrt((rect.width - x) ** 2 + y ** 2),
      Math.sqrt((rect.height - y) ** 2 + x ** 2),
      Math.sqrt((rect.width - x) ** 2 + (rect.height - y) ** 2)
    );
    this.centerRadius = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2);

    this.containerE.appendChild(ripple);
    setTimeout(() => {
      ripple.style.cssText = `
      top: ${this.centered ? rect.height / 2 - this.centerRadius : y - this.radius}px;
      left: ${this.centered ? rect.width / 2 - this.centerRadius : x - this.radius}px;
      width: ${this.centered ? this.centerRadius * 2 : this.radius * 2}px;
      height: ${this.centered ? this.centerRadius * 2 : this.radius * 2}px;
      transition-duration: 225ms;
      transform: scale3d(1, 1, 1);
      `;
    }, 0);
  }
  removeActiveLayer(_ripple: HTMLElement) {
    if (_ripple) {
      if (
        Math.floor(_ripple.getBoundingClientRect().width) >=
        (this.centered ? Math.floor(this.centerRadius * 2) : Math.floor(this.radius * 2))
      ) {
        _ripple.style.opacity = '0';
        setTimeout(() => {
          _ripple.remove();
        }, 225);
      } else {
        _ripple.addEventListener('transitionend', () => {
          _ripple.style.opacity = '0';
          setTimeout(() => {
            _ripple.remove();
          }, 225);
        });
      }
    }
  }
  removeAllActiveLayers() {
    let _ripples = this.containerE.querySelectorAll('.md-ripple__element');
    _ripples.forEach((_ripple: HTMLElement) => this.removeActiveLayer(_ripple));
  }
  addHoverLayer() {
    this.containerE.classList.add('md-ripple--hover');
  }
  removeHoverLayer() {
    this.containerE.classList.remove('md-ripple--hover');
  }
  addFocusLayer() {
    this.containerE.classList.add('md-ripple--focus');
  }
  removeFocusLayer() {
    this.containerE.classList.remove('md-ripple--focus');
  }

  get unbounded() {
    return this.hasAttribute('unbounded');
  }
  get centered() {
    return this.hasAttribute('centered');
  }
  get disabled() {
    return this.hasAttribute('disabled');
  }
  set unbounded(value) {
    if (value) {
      this.setAttribute('unbounded', '');
    } else {
      this.removeAttribute('unbounded');
    }
  }
  set centered(value) {
    if (value) {
      this.setAttribute('centered', '');
    } else {
      this.removeAttribute('centered');
    }
  }
  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  static get observedAttributes() {
    return ['default'];
  }
  connectedCallback() {
    this.render();

    this.parentE = ((this.parentNode as ShadowRoot).host as HTMLElement) || (this.parentNode as HTMLElement);
    this.containerE = this.shadowRoot.getElementById('md-ripple__container');

    this.parentE.addEventListener('pointerdown', (event) => this.addActiveLayer(event));
    this.parentE.addEventListener('mouseleave', () => this.removeAllActiveLayers());
    this.parentE.addEventListener('mouseup', () => this.removeAllActiveLayers());
    this.parentE.addEventListener('touchmove', () => this.removeAllActiveLayers());
    this.parentE.addEventListener('touchend', () => this.removeAllActiveLayers());

    this.parentE.addEventListener('mouseover', () => this.addHoverLayer());
    this.parentE.addEventListener('mouseout', () => this.removeHoverLayer());
    document.addEventListener('keypress', () => {
      if (
        document.activeElement.contains(this.parentE) ||
        this.parentE.contains(document.activeElement) ||
        this.parentE == document.activeElement ||
        (this.parentE.parentNode as ShadowRoot).host == document.activeElement
      ) {
        this.addFocusLayer();
      }
    });
    this.parentE.addEventListener('blur', () => this.removeFocusLayer());
  }
  disconnectedCallback() {
    this.parentE.removeEventListener('pointerdown', (event) => this.addActiveLayer(event));
  }
}

if (!customElements.get(Ripple.tagName)) {
  customElements.define(Ripple.tagName, Ripple);
}
export default Ripple;

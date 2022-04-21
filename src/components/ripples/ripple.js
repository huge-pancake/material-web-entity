import styles from './ripple-styles.scss';

/**
 * Ripple component.
 *
 * Button, Card and Menu are all request define this component as 'md3-ripple'
 */
class Ripple extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  /**
   * Render the contents
   */
  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${styles}</style>
    <div class="md3-ripple__container" id="md3-ripple__container">
      <!-- -->
      <!-- -->
    </div>
    `;
  }

  addActiveLayer(_event) {
    let ripple = document.createElement('span');
    ripple.classList.add('md3-ripple__itself');

    let rect = this.parentE.getBoundingClientRect();
    let x = _event.clientX - rect.left,
      y = _event.clientY - rect.top;
    let radius = Math.max(
      Math.sqrt(x ** 2 + y ** 2),
      Math.sqrt((rect.width - x) ** 2 + y ** 2),
      Math.sqrt((rect.height - y) ** 2 + x ** 2),
      Math.sqrt((rect.width - x) ** 2 + (rect.height - y) ** 2)
    );
    let centerRadius = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2);

    this.containerE.appendChild(ripple);
    setTimeout(() => {
      ripple.style.cssText = `
      top: ${this.centered ? rect.height / 2 - centerRadius : y - radius}px;
      left: ${this.centered ? rect.width / 2 - centerRadius : x - radius}px;
      width: ${this.centered ? centerRadius * 2 : radius * 2}px;
      height: ${this.centered ? centerRadius * 2 : radius * 2}px;
      transition-duration: 225ms;
      transform: scale3d(1, 1, 1);
      `;
    }, 0);
    this.parentE.addEventListener('mouseleave', () => this.removeActiveLayer(ripple));
    this.parentE.addEventListener('mouseup', () => this.removeActiveLayer(ripple));
    this.parentE.addEventListener('touchmove', () => this.removeActiveLayer(ripple));
    this.parentE.addEventListener('touchend', () => this.removeActiveLayer(ripple));
  }
  /**
   * @param {HTMLElement} _ripple
   */
  removeActiveLayer(_ripple) {
    if (_ripple) {
      _ripple.addEventListener('transitionend', () => {
        _ripple.style.opacity = '0';
        setTimeout(() => {
          _ripple.remove();
        }, 225);
      });
      setTimeout(() => {
        _ripple.style.opacity = '0';
        setTimeout(() => {
          _ripple.remove();
        }, 225);
      }, 225);
    }
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
    return [];
  }
  connectedCallback() {
    this.render();

    this.parentE = this.parentNode.host || this.parentNode;
    this.containerE = this.shadowRoot.getElementById('md3-ripple__container');

    this.parentE.addEventListener('pointerdown', (event) => this.addActiveLayer(event));
  }
  disconnectedCallback() {
    this.parentE.removeEventListener('pointerdown', (event) => this.addActiveLayer(event));
  }
}

export default Ripple;
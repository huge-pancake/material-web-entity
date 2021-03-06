import M3MenuStyles from './menu-styles.scss';

const sheet = new CSSStyleSheet();
sheet.replaceSync(M3MenuStyles);

/**
 * Menu component.
 *
 * Description.
 */
class M3Menu extends HTMLElement {
  static tagName: string = 'md-menu';
  menuElement: HTMLDivElement;
  controllerElement: HTMLElement;
  layerElement: HTMLElement;
  controllerFriendsElements: NodeListOf<Element>;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = this.render();
    this.shadowRoot.adoptedStyleSheets = [sheet];

    this.layerElement = this.shadowRoot.querySelector('.md-menu__layer');
    this.menuElement = this.shadowRoot.querySelector('.md-menu') as HTMLDivElement;
    this.controllerElement = document.querySelector(`#${this.id}`);
    this.controllerElement
      ? (this.controllerFriendsElements = this.controllerElement.parentElement.querySelectorAll(
          `md-menu-item:not(#${this.id})`
        ))
      : null;

    this.addEventListener('keydown', this.onKeyAction);
    document.addEventListener('click', (e: Event) => {
      if (this.open && !this.contains(e.target as HTMLElement) && e.target !== this.controllerElement) {
        this.closeMenu();
      }
    });
    this.layerElement.addEventListener('mousedown', (e: Event) => {
      if (this.open && !this.contains(e.target as HTMLElement) && e.target !== this.controllerElement) {
        this.closeMenu();
      }
    });
    this.addEventListener('click', (e) => {
      let path = e.composedPath();
      if (path.indexOf(this) == 6 && (e.target as HTMLElement).getAttribute('subber') == undefined) {
        this.closeMenu();
      }
    });
    if (this.controllerElement) {
      if (this.sub) {
        // Submenu
        if (this.controllerFriendsElements) {
          this.controllerFriendsElements.forEach((item: HTMLButtonElement) => {
            item.addEventListener('mouseenter', () => (this.open = false));
          });
        }
        this.controllerElement.addEventListener('mouseenter', () => this.openMenu());
        this.addEventListener('mouseenter', () => (this.open = true));
      } else {
        // Normal menu
        this.controllerElement.addEventListener('click', (e) => {
          e.preventDefault();
          this.openMenu();
        });
      }
    }
  }

  protected render(): string {
    return `
    <div class="md-menu__layer"></div>
    <div class="md-menu">
      <slot></slot>
    </div>
    `;
  }

  get open() {
    return this.getAttribute('open') != undefined;
  }
  set open(value: boolean) {
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }
  get dense() {
    return this.getAttribute('dense') != undefined;
  }
  set dense(value: boolean) {
    if (value) {
      this.setAttribute('dense', '');
    } else {
      this.removeAttribute('dense');
    }
  }
  get fast() {
    return this.getAttribute('fast') != undefined;
  }
  set fast(value: boolean) {
    if (value) {
      this.setAttribute('fast', '');
    } else {
      this.removeAttribute('fast');
    }
  }
  get sub() {
    return this.getAttribute('sub') != undefined;
  }
  set sub(value: boolean) {
    if (value) {
      this.setAttribute('sub', '');
    } else {
      this.removeAttribute('sub');
    }
  }

  /**
   * The actions when the user press a key.
   */
  onKeyAction(e: KeyboardEvent) {
    if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
      // Focus moving
      e.preventDefault();
      let focusItem = this.querySelector('md-menu-item:focus') as HTMLButtonElement;
      let items = this.querySelectorAll('md-menu-item') as NodeListOf<HTMLButtonElement>;
      let index = [].indexOf.call(items, focusItem);
      e.key == 'ArrowDown' ? index++ : index--;
      if (index < 0) {
        index = items.length - 1;
      } else if (index >= items.length) {
        index = 0;
      }
      items[index].tabIndex = 0;
      items[index].focus();
      focusItem.tabIndex = -1;
    } else if (e.key == 'Escape') {
      // Menu closing
      e.preventDefault();
      this.closeMenu();
    } else if (e.key == 'ArrowLeft') {
      // Submenu closing
      if (this.sub) {
        e.preventDefault();
        this.closeMenu();
      }
    } else if (e.key == 'Enter' || e.key == 'ArrowRight' || e.key == ' ') {
      // Submenu opening
      let focusItem = this.querySelector('md-menu-item:focus');
      if (focusItem.hasAttribute('subber')) {
        e.preventDefault();
        (document.querySelector(`md-menu#${focusItem.id}`) as M3Menu).openMenu();
      }
    } else if (e.key == 'Tab') {
      // Blur as Menu closing
      this.closeMenu();
    }
  }
  /**
   * Calculate the position of the menu.
   */
  protected calculatePosition(): {
    top: number;
    left: number;
    right: number;
    bottom: number;
    horizontal: boolean;
    vertical: boolean;
  } {
    let _position: { top: number; left: number; right: number; bottom: number } = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
    let _classes: { horizontal: boolean; vertical: boolean } = {
      horizontal: false,
      vertical: false,
    };

    const rect = this.controllerElement.getBoundingClientRect();

    if (rect.top + rect.height / 2 > window.innerHeight / 2) {
      _classes.vertical = true;
      if (this.sub) {
        _position.bottom = window.innerHeight - rect.top - rect.height - 8;
      } else {
        _position.bottom = window.innerHeight - rect.top;
      }
      if (this.menuElement.offsetTop < rect.height) {
        _position.top = rect.height;
      }
    } else {
      if (this.sub) {
        _position.top = rect.top - 8;
      } else {
        _position.top = rect.top + rect.height;
      }
      if (window.innerHeight - this.menuElement.offsetTop - this.menuElement.offsetHeight < rect.height) {
        _position.bottom = rect.height;
      }
    }
    if (this.sub) {
      if (rect.left + rect.width + this.menuElement.offsetWidth > window.innerWidth) {
        _position.left = rect.right - 48 - this.menuElement.offsetWidth;
        _classes.horizontal = true;
      } else {
        _position.left = rect.left + rect.width;
      }
    } else {
      if (rect.left + rect.width + this.menuElement.offsetWidth > window.innerWidth) {
        _position.left = rect.right - this.menuElement.offsetWidth;
        _classes.horizontal = true;
      } else {
        _position.left = rect.left;
      }
    }

    return { ..._position, ..._classes };
  }
  /**
   * Set the menu position.
   * ! Need more testing.
   * TODO: Need more position.
   */
  openMenu() {
    document.documentElement.style.overflow = 'hidden';
    this.dispatchEvent(
      new CustomEvent('open', {
        detail: {},
      })
    );
    this.menuElement.removeAttribute('style');
    this.menuElement.classList.remove('md-menu--bottom', 'md-menu--right');

    const { top, left, right, bottom, horizontal, vertical } = this.calculatePosition();

    if (vertical) {
      this.menuElement.classList.add('md-menu--bottom');
      this.menuElement.style.bottom = `${bottom}px`;
    } else {
      this.menuElement.style.top = `${top}px`;
    }
    if (horizontal) {
      this.menuElement.classList.add('md-menu--right');
      this.menuElement.style.right = `${right}px`;
    } else {
      this.menuElement.style.left = `${left}px`;
    }

    this.open = true;
    (this.querySelector('md-menu-item') as HTMLButtonElement).tabIndex = 0;
    (this.querySelector('md-menu-item') as HTMLButtonElement).focus();
  }
  /**
   * Close the menu.
   */
  closeMenu() {
    document.documentElement.style.overflow = '';
    this.dispatchEvent(new CustomEvent('close', {}));
    this.querySelector('md-menu-item:focus')
      ? ((this.querySelector('md-menu-item:focus') as HTMLButtonElement).tabIndex = 0)
      : null;
    this.menuElement.style.visibility = 'visible';
    setTimeout(() => {
      this.menuElement.setAttribute('style', '');
    }, 150);
    this.open = false;
    this.controllerElement.focus();
  }
}

if (!customElements.get(M3Menu.tagName)) {
  customElements.define(M3Menu.tagName, M3Menu);
}
export default M3Menu;

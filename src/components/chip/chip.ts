import BaseButtonLabeled from '../base/button-labeled';
import M3ChipStyles from './chip-styles.scss';

/**
 * M3Chip component.
 *
 * Template
 * ```html
 * <md-chip label="Label"></md-chip>
 * <!-- or -->
 * <md-chip>
 *   <md-icon>code</md-icon>
 *   <span>Label</span>
 * </md-chip>
 * ```
 */
class M3Chip extends BaseButtonLabeled {
  static tagName: string = 'md-chip';

  /**
   * RENDERING
   */
  /** */
  protected override render(): string {
    return `
    <style>${M3ChipStyles}</style>
    ${this.renderButton(
      `<md-ripple></md-ripple>
      <span class="md-chip__label">${this.label ? this.label : ''}</span>
      <slot></slot>`
    )}`;
  }
}

if (!customElements.get(M3Chip.tagName)) {
  customElements.define(M3Chip.tagName, M3Chip);
}
export default M3Chip;

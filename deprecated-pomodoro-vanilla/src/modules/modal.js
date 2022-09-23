export class Modal {
  constructor(element) {
    this.element = element;
  }

  openModal = () => {
    this.element.className = this.element.className + ' is-active';
  };

  closeModal = () => {
    this.element.className = 'modal';
  };
}

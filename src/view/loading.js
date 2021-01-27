import AbstractView from "./abstract.js";

const createNoPointTemplate = () => {
  return `<section class="trip-events">
  <h2 class="visually-hidden">Trip events</h2>

  <p class="trip-events__msg">Loading...</p>
</section>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}

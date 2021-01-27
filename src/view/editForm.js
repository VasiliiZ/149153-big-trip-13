import SmartView from "./smart";
import dayjs from 'dayjs';
import {TYPE_TRIP_POINTS} from '../utils';
import flatpickr from 'flatpickr';
import he from 'he';

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createTypeListTemplate = (currentType) => {
  return TYPE_TRIP_POINTS.map((type)=>`<div class="event__type-item">
  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? `checked` : ``}>
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
</div>`).join(``);
};

const createEditFormElement = (data) => {
  const {price, type, beginDate, endDate, destination: {description, name: city}} = data;

  const startTimeFull = dayjs(beginDate).format(`YYYY-MM-DD HH:mm`);
  const endTimeFull = dayjs(endDate).format(`YYYY-MM-DD HH:mm`);

  const typeListTemplate = createTypeListTemplate(type);

  return `  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${typeListTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTimeFull}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeFull}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
            <label class="event__offer-label" for="event-offer-luggage-1">
              <span class="event__offer-title">Add luggage</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">50</span>
            </label>
          </div>

          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
            <label class="event__offer-label" for="event-offer-comfort-1">
              <span class="event__offer-title">Switch to comfort</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">80</span>
            </label>
          </div>

          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
            <label class="event__offer-label" for="event-offer-meal-1">
              <span class="event__offer-title">Add meal</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">15</span>
            </label>
          </div>

          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
            <label class="event__offer-label" for="event-offer-seats-1">
              <span class="event__offer-title">Choose seats</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">5</span>
            </label>
          </div>

          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
            <label class="event__offer-label" for="event-offer-train-1">
              <span class="event__offer-title">Travel by train</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">40</span>
            </label>
          </div>
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
      </section>
    </section>
  </form>
</li>
`;
};

export default class Edit extends SmartView {
  constructor(point) {
    super();
    this._data = Edit.parsePointToData(point);
    this._datepickerBeginDate = null;
    this._datepickerEndDate = null;

    this._clickHandler = this._clickHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._beginDateChangeHandler = this._beginDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(Edit.parseDataToPoint(this._data));
  }

  getTemplate() {
    return createEditFormElement(this._data);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerBeginDate || this._datepickerEndDate) {
      this._datepickerBeginDate.destroy();
      this._datepickerEndDate.destroy();
      this._datepickerBeginDate = null;
      this._datepickerEndDate = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSumbitHandler(this._callback.submit);
    this._setDatepicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`click`, this._typeToggleHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._destinationInputHandler);
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    const type = evt.target.textContent.toLowerCase();
    this.updateData({type});
  }

  static parsePointToData(point) {
    return Object.assign({}, point);
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    return data;
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    this.updateData({description: evt.target.value}, true);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  setSumbitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._submitHandler);
  }

  setTypeHandler(callback) {
    this._callback.changeType = callback;
    this.getElement().querySelector(`.event__type-input`).addEventListener(`change`, this._destinationInputHandler);
  }

  reset(point) {
    this.updateData(Edit.parsePointToData(point));
  }

  _setDatepicker() {
    if (this._datepickerBeginDate) {
      this._datepickerBeginDate.destroy();
      this._datepickerBeginDate = null;
    }

    if (this._datepickerEndDate) {
      this._datepickerEndDate.destroy();
      this._datepickerEndDate = null;
    }

    this._datepickerBeginDate = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          dateFormat: `d/m/Y H:i`,
          defaultDate: this._data.beginDate,
          onChange: this._beginDateChangeHandler
        }
    );

    this._datepickerEndDate = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          dateFormat: `d/m/Y H:i`,
          defaultDate: this._data.endDate,
          onChange: this._endDateChangeHandler
        }
    );
  }
  _beginDateChangeHandler(userDate) {
    this.updateData({
      beginDate: dayjs(userDate).hour(23).minute(59).second(59).toDate()
    });
  }

  _endDateChangeHandler(userDate) {
    this.updateData({
      endDate: dayjs(userDate).hour(23).minute(59).second(59).toDate()
    });
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(Edit.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }
}

import MenuView from "./view/menu";
import FilterPresenter from "./presenter/filter";
import {RenderPosition, render, UpdateType} from "./utils";
import TripPresenter from './presenter/trip';
import PointModel from './model/point';
import FilterModel from './model/filter';
import Api from './api';

const AUTHORIZATION = `Basic sfhiu3hr23h5rpfSS`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const headerElement = document.querySelector(`.page-header`);
const tripMainElement = headerElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);


const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const pointModel = new PointModel();
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter(tripEventsElement, pointModel, filterModel, api);
const filterPresenter = new FilterPresenter(tripControlsElement.lastElementChild, filterModel, pointModel);
const siteMenuComponent = new MenuView();

render(tripControlsElement.firstElementChild, siteMenuComponent.getElement(), RenderPosition.AFTERBEGIN);

tripPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

api.getPoints()
.then((points) => {
  pointModel.setPoints(UpdateType.INIT, points);
})
.catch(() => {
  pointModel.setPoints(UpdateType.INIT, []);
});

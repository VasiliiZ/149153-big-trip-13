import NoPointsView from '../view/noPoints';
import ContentView from '../view/content';
import PointSortView from '../view/sort';
import {render, RenderPosition, SortType, sortDate, sortPrice, UpdateType, UserAction, remove, filter, FilterType} from '../utils';
import PointPresenter from '../presenter/point';
import PointNewPresenter from "./point-new";
import LoadingView from "../view/loading.js";

export default class Trip {
  constructor(routeContainer, pointModel, filterModel, api) {
    this._pointModel = pointModel;
    this._filterModel = filterModel;
    this._routeContainer = routeContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._sortComponent = null;
    this._api = api;

    this._noPointsComponent = new NoPointsView();
    this._contentComponent = new ContentView();
    this._loadingComponent = new LoadingView();
    /* this._handlePointChange = this._handlePointChange.bind(this);*/
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);

    this._pointModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._contentComponent, this._handleViewAction);
  }
  init() {
    render(this._routeContainer, this._contentComponent, RenderPosition.BEFOREND);
    this._renderRoute();
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointModel.getPoints();
    const filtredPoints = filter[filterType](points);
    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredPoints.sort();
      case SortType.PRICE:
        return filtredPoints.sort(sortPrice);
      case SortType.DAY:
        return filtredPoints.sort(sortDate);
    }
    return this._pointModel.getPoints();
  }

  _handleModeChange() {
    this._pointPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._pointModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderRoute();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderRoute();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderRoute();
        break;
    }
  }

  _handlerSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderRoute();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      // remove(this._sortComponent);
      this._sortComponent = null;
    }

    this._sortComponent = new PointSortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handlerSortTypeChange);

    render(this._routeContainer.firstElementChild, this._sortComponent, RenderPosition.AFTERBEGIN);

  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._contentComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderNoPoints() {
    render(this._routeContainer, this._noPointsComponent, RenderPosition.BEFOREND);
  }

  _renderLoading() {
    render(this._routeContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noPointsComponent);
    remove(this._loadingComponent);
    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderRoute() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();
    // const filterType = this._filterModel.getFilter();
    // const filteredPoints = filter[filterType](points);
    const pointCount = points.length;

    if (pointCount === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    for (let i = 0; i < pointCount; i++) {
      this._renderPoint(points[i]);
    }
  }


}

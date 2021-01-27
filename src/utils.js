import Abstract from "./view/abstract";
import dayjs from "dayjs";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREND: `beforend`,
  BEFOREBEGIN: `beforebegin`
};

export const renderTemplate = (container, markup, place) => {
  container.insertAdjacentHTML(place, markup);
};

export const render = (container, element, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  if (element instanceof Abstract) {
    element = element.getElement();
  }
  switch (place) {
    case RenderPosition.AFTEREND:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREND:
      container.append(element);
      break;
    case RenderPosition.AFTERBEGIN:
      container.after(element);
      break;
    case RenderPosition.BEFOREBEGIN:
      container.prepend(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const POINT_COUNT = 20;

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }
  component.getElement().remove();
  component.removeElement();
};

export const SortType = {
  DAY: `day`,
  TIME: `time`,
  PRICE: `price`
};

export const sortDate = (pointA, pointB) => {
  return dayjs(pointB.beginDate).diff(dayjs(pointA.beginDate));
};

export const sortPrice = (a, b) => {
  if (a.price < b.price) {
    return -1;
  } else if (a.price > b.price) {
    return 1;
  } else {
    return 0;
  }

};

export const TYPE_TRIP_POINTS = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeng`, `restaurant`];

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, `D`);
};

export const FilterType = {
  FUTURE: `future`,
  PAST: `past`,
  ALL: `everything`
};

export const isDateExpired = (date) => {
  return date === null ? false : dayjs().isAfter(date, `D`);
};

export const isDateNotCame = (date) => {
  return date === null ? false : dayjs().isBefore(date, `D`);
};

export const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isDateExpired(point.beginDate)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateNotCame(point.beginDate))
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

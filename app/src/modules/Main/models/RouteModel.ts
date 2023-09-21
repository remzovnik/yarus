export default interface RouteModel {
  id?: number;
  // Для отображения
  linkName?: string;

  // Наименование маршрута
  name?: string;

  path?: any;

  // Параметры маршрута
  params?: any;

  props?: any;

  query?: any;

  icon?: string;

  // Признак видимости
  isVisible?: boolean;

  // Для навигации по якорям внутри страницы (компонента)
  refId?: string;

  // Дополнителная информация
  addInfo?: any;

  // Можно еще что угодно добавлять, в зависимости от требований

  // Для вставки как <a href=""
  href?: string;

  blank?: "" | "_blank";

  metrikaKey?: string;

  hash?: string;
}

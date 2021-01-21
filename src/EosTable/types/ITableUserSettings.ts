import { IFilterValueObjects } from "./IFilterValueObjects";
import { ISorterPath } from "./ISorterType";

/** Пользовательские настройки таблицы */
export interface ITableUserSettings {
    /** Уникальный идентификатор */
    tableId: string
    /** Открыта форма фильтра */
    filterVisible?: boolean
    /** Размер выборки данных */
    pageSize?: number
    /** Настройка колонок */
    columns: TableUserColumn[]
    /** Исходные фильтрующие данные */
    defaultFilters?: IFilterValueObjects
    /** Сортировка */
    defaultSort?: ISorterPath[]
    /** Чередование строк */
    highlightingRows?: boolean
    /** Максимальное количество текстовых строк в строке таблицы */
    ellipsisRows?: number
    /** Высота области фильтрации */
    filterAreaHeight?: number
}

export interface ITableColumnUserSettings {
    /** Имя колонки */
    name: string
    /** Видимость */
    visible: boolean
    /** Ширина */
    width?: number
    /** Зафиксирована слева */
    fixed?: boolean
}

export type TableUserColumn = ITableUserColumnGroupSettings | ITableColumnUserSettings

export interface ITableUserColumnGroupSettings extends ITableColumnUserSettings {
    /** Дочерние колонки */
    columns: TableUserColumn[]
}
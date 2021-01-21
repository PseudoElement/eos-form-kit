import { IMenuItem } from "../../Menu/types";
import { IFieldPath, IFieldPathShort } from "./IFieldPath";
import { FilterExpressionFragment } from "./IFilterType";

/** Настройки таблицы для генератора */
export interface ITableSettings {
    /** Уникальный идентификатор */
    tableId: string
    /** Имя сущности на бэке */
    typeName: string
    /** Имя сущности в множественном числе на бэке */
    typePluralName: string
    /** Колонки */
    columns: TableColumn[]
    /** Ключи */
    keyFields: string[]
    /** Визуальные настройки */
    visual?: IVisualSettings
    /** Массив полей, по которму осуществяется быстрый поиск (по лупе) */
    quickSearchFilter?: IFieldPathShort[]
    /** Главное меню таблицы */
    menu?: IMenuItem[]
    /** Правое меню таблицы */
    rightMenu?: IMenuItem[]
    /** Контекстное меню строчек таблицы */
    contextMenu?: IMenuItem[]
    /** Имя провайдера получения данных таблицы */
    dataProviderName?: string
    ///cardView?: ICard   
    /** Минимальное количество строк для выбора */
    minSelectedRecords?: number
    /** Максимальное количество строк для выбора */
    maxSelectedRecords?: number
    /** Поля для выборки вне зависимости от видимых колонок */
    defaultLoadFields?: IFieldPathShort[]
    /** Постоянный фильтр вне зависимости от других */
    constFilter?: FilterExpressionFragment
}

/** Тип колонки: с группировкой и без */
export type TableColumn = ITableColumnGroupSettings | ITableColumnSettings

/** Колонка с группировкой */
export interface ITableColumnGroupSettings {
    name: string
    title: string
    columns: TableColumn[]
}

/** Колонка */
export interface ITableColumnSettings {
    /** Имя (dataIndex) */
    name: string
    /** Связанные поля с колонкой */
    fields?: IFieldPath[]
    /** Название колонки */
    title: string
    /** Описание */
    description?: string
    /** Кастомный рендер данных в колонке */
    columnRender?: IRender
    /** Колонка сортируема? */
    sortable?: boolean
    ///selectValues?: Map<string, string>
}

/** Визуальные настройки */
export interface IVisualSettings {
    /** Возможность перетаскивания колонок */
    dragable?: boolean
    /** Возможность изменять ширину колонок */
    resizable?: boolean
    /** Разделители колонок */
    bordered?: "header" | "all" | undefined
    /** Прилепленная колонка слева */
    fixedColumn?: boolean
    showSelectedBtn?: boolean,
    /** Массив размеров страниц */
    pageSizeOptions?: string[]
    /** Минимальная высота для области фильтра */
    filterAreaMaxHeight?: number
    /** Максимальная высота для области фильтра */
    filterAreaMinHeight?: number
}

/** Рендер */
export interface IRender {
    /** Тип */
    renderType: string,
    /** Аргументы */
    renderArgs?: IRenderArgs,
}

/** Аргументы рендера */
export interface IRenderArgs {
    /** Ограничение видимых строк */
    ellipsisRows?: number
    /** Наименование иконки */
    iconName?: string
    /** Размер иконки */
    iconSize?: string
    /** Цвет иконки */
    iconColor?: string
    mode?: string
    /** Тип кнопки */
    typeButton?: 'primary' | 'link' | 'default'
    titleButton?: string
    [key: string]: string | number | undefined
}
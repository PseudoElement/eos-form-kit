import { FilterExpressionFragment } from "./IFilterType";
import { IFilterValueObjects } from "./IFilterValueObjects";
import { ISorterPath } from "./ISorterType";

/**Состояние таблицы */
export interface ITableState {
    /**Курсор, после которого возвращать записи */
    readonly after?: number, ///string  firstCursor lastCursor
    /**Выбранные строки */
    selectedRecords?: any[]
    /**Выделенная строка */
    readonly currentRecord?: any
    /**Данные таблицы */
    readonly tableData?: any[]
    /**Общее количество данных */
    readonly recordsTotalCount?: number
    /**Количество загружаемых данных */
    pageSize?: number,
    /**Сортировка */
    orderby?: ISorterPath[]
    /**Фильтры в формате graphql */
    filter?: Map<string, FilterExpressionFragment>
    /**Выбранные ключи строк */
    selectedRowKeys?: string[]
    /**Ключ выделенной строки */
    currentRowKey?: string
    /** Минимальное количество строк для выбора */
    maxSelectedRecords?: number
    /** Максимальное количество строк для выбора */
    minSelectedRecords?: number
    /** Текущая страница в пагинаторе */
    currentPage?: number
    /** Режим отображения */
    tableView?: "default" | "card"
    /** Принудительный запрос на сервер за данными */
    forcedReloadData?: boolean
    /** Вкючен режим быстрого поиска */
    quickSearchMode?: boolean
    /**Последние строки, с которых сняли выделение*/
    readonly lastUnSelectedRecords?: any[]
    /**Отображение формы фильтрации */
    showFormFilter?: boolean
    /** Фильтр применен*/
    readonly formFilterMode?: boolean
    /** Исходные данные для фильтрации */
    filterValueObjects?: IFilterValueObjects
    /** Высота области фильтрации */
    filterAreaHeight?: number
}

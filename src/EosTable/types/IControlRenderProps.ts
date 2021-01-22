import { IRenderArgs } from "./ITableSettings";

/** Пропсы рендера */
export interface IControlRenderProps {
    /** Аргументы рендера */
    renderArgs?: IRenderArgs
    /** Текущее значение в ячейке, если таблица */
    valueInCell?: any
    /** Текущая строка, если таблица */
    recordInRow?: any
    /** Порядковый номер строки, если таблица */
    indexOfRow?: number
    /** Апи объекта */
    refApi?: any
    /** Нажата кнопка */
    buttonChecked?: boolean
}

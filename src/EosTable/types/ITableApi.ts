import { ITableSettings } from "./ITableSettings";
import { ITableState } from "./ITableState";
import { ITableUserSettings } from "./ITableUserSettings";

/** Api таблицы */
export interface ITableApi{
    /** Изменение состояния таблицы */
    setTableState(tableState: ITableState): void
    /** Текущее состояние таблицы */
    getCurrentTableState: () => ITableState
    /** Настройки таблицы */
    getTableSetting: () => ITableSettings
    /** Пользовательские настройки таблицы */
    getUSerSetting: () => ITableUserSettings
}
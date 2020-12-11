import { ITableSettings } from "./ITableSettings";
import { ITableState } from "./ITableState";
import { ITableUserSettings } from "./ITableUserSettings";

export interface ITableApi{
    setTableState(tableState: ITableState): void,
    getCurrentTableState: () => ITableState
    getTableSetting: () => ITableSettings
    getUSerSetting: () => ITableUserSettings
}
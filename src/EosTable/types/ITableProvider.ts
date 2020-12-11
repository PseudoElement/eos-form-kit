import { IControlRenderProps } from "./IControlRenderProps";
import { ITableApi } from "./ITableApi";
import { ITableData } from "./ITableData";
import { IMenuItem, ITableSettings } from "./ITableSettings";
import { ITableState } from "./ITableState";
import { ITableUserSettings } from "./ITableUserSettings";

export interface ITableProvider {
    triggers?: Triggers,
    tableSettingLoad?: (tableId?: string) => Promise<ITableSettings>
    tableUserSettingLoad?: (tableId?: string) => Promise<ITableUserSettings>
    fetchData?: (tableState: ITableState, tableSettings: ITableSettings, userSettings: ITableUserSettings, onlyKeysForSelectedAll?: boolean) => Promise<ITableData>
    saveUserSetting?: (userSetting: ITableUserSettings) => Promise<void>
    fetchRender?: FetchControlRender
    fetchAction?: FetchAction
    fetchCondition?: FetchCondition
    localize?: (key: string) => string
    disableSelectRecord?: (record: any) => boolean
}

export interface Triggers {
    onRowClick?: (props: TriggerArgs) => void
    onRowDoubleClick?: (props: TriggerArgs) => void
    onChangeSelectedRows?: (props: TriggerArgs) => void
    onPaginationChange?: (props: TriggerArgs) => void
    onUpdateState?: (tableState: ITableState) => void
};

export interface TriggerArgs {
    tableState?: ITableState
    tableSetting?: ITableSettings
    userSetting?: ITableUserSettings
    tableApi?: ITableApi
}

export type FetchControlRender = (name: string) => ((controlProps: IControlRenderProps) => JSX.Element) | undefined
export type FetchAction = (name: string) => ((handlerProps: IHandlerProps) => Promise<void> | void) | undefined
export type FetchCondition = (name: string) => ((handlerProps: IHandlerProps) => boolean) | undefined

export interface IHandlerProps{
    refApi: ITableApi, 
    menuItem: IMenuItem
}
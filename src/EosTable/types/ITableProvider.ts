
import { IMenuItem } from "../../Menu/types";
import { IDataService } from "../../Search/SearchForm";
import { IControlRenderProps } from "./IControlRenderProps";
import { FilterExpressionFragment, FilterTypeName } from "./IFilterType";
import { ITableApi } from "./ITableApi";
import { ITableData } from "./ITableData";
import { ITableSettings } from "./ITableSettings";
import { ITableState } from "./ITableState";
import { ITableUserSettings } from "./ITableUserSettings";

/**Провайдер таблицы*/
export interface ITableProvider {
    /**Триггеры*/
    triggers?: Triggers,
    /**Метод загрузки настроек таблицы*/
    tableSettingLoad?: (tableId?: string) => Promise<ITableSettings>
    /**Метод загрузки пользовательских настроек таблицы*/
    tableUserSettingLoad?: (tableId?: string) => Promise<ITableUserSettings>
    /**Метод загрузки данных в таблицу*/
    fetchData?: (tableState: ITableState, tableSettings: ITableSettings, userSettings: ITableUserSettings, onlyKeysForSelectedAll?: boolean) => Promise<ITableData>
    /**Сохранение пользовательских настроек*/
    saveUserSetting?: (userSetting: ITableUserSettings) => Promise<void>
    /**Условие невозможности выбора строки*/
    disableSelectRecord?: (record: any) => boolean
    /**Провайдер для формы поиска*/
    searchFormService?: IDataService
    /**Локальное определение рендера по свойству renderType меню или колонки*/
    fetchControl?: (name: string) => ((controlProps: IControlRenderProps) => JSX.Element) | undefined
    /**Локальное определение действия по свойству handlerName и type = onClick*/
    fetchAction?: (name: string) => ((handlerProps: IHandlerProps) => Promise<void> | void) | undefined
    /**Локальное определение условий по свойству handlerName и type ="disabled" | "checked" | "visible"*/
    fetchCondition?: (name: string) => ((handlerProps: IHandlerProps) => boolean) | undefined
    /**Трансформация иcходных фильтрующих данных в нужный формат filter graphql*/
    transformFilterToExpressionFragment?: (filterTypeName: FilterTypeName, tableState: ITableState, tableSettings: ITableSettings, userTableSettings: ITableUserSettings) => (FilterExpressionFragment | undefined)
}

export interface Triggers {
    /**Одинарный клик по строке(выделение) */
    onRowClick?: (props: TriggerArgs) => void
    /**Двойной клик по строке*/
    onRowDoubleClick?: (props: TriggerArgs) => void
    /**Триггер при изменении выбранных строк */
    onChangeSelectedRows?: (props: TriggerArgs) => void
    /**Триггер при изменении настроек пагинации */
    onPaginationChange?: (props: TriggerArgs) => void
    /**Триггер при изменении стейта таблицы */
    onUpdateState?: (tableState: ITableState) => void
};

export interface TriggerArgs {
    /**Состояние таблицы */
    tableState?: ITableState
    /**Настройки таблицы */
    tableSetting?: ITableSettings
    /**Пользовательские настройки таблицы */
    userSetting?: ITableUserSettings
    /**Апи таблицы */
    tableApi?: ITableApi
}

export type FetchControlRender = (name: string) => ((controlProps: IControlRenderProps) => JSX.Element) | undefined
export type FetchAction = (name: string) => ((handlerProps: IHandlerProps) => Promise<void> | void) | undefined
export type FetchCondition = (name: string) => ((handlerProps: IHandlerProps) => boolean) | undefined

/**Пропсы actions и conditions */
export interface IHandlerProps {
    /**Апи */
    refApi: any
    /**Элемент настройки меню */
    menuItem: IMenuItem
    /**Текущая строка, если это таблица */
    rowRecord?: any
    /**Текущая строка, если это таблица */
    rowIndex?: number
    /**Текущий ключ строки, если это таблица */
    rowKey?: string
}

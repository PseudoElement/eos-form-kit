import { createContext, useContext } from 'react'
import { IControlRenderProps } from '../types/IControlRenderProps';
import { ITableData } from '../types/ITableData';
import { IHandlerProps } from '../types/ITableProvider';
import { ITableSettings } from '../types/ITableSettings';
import { ITableState } from '../types/ITableState';
import { ITableUserSettings } from '../types/ITableUserSettings';

interface IDictionary<T> {
    add(key: string, value: T): void;
    remove(key: string): void;
    getItem(key: string): T | undefined
}

class Dictionary<T> implements IDictionary<T> {
    private items: { [index: string]: T } = {};

    constructor(init?: { key: string; value: T; }[]) {
        if (init) {
            for (let x = 0; x < init.length; x++) {
                this.add(init[x].key, init[x].value)
            }
        }
    }

    add(key: string, value: T) {
        if (!this.containsKey(key))
            this.items[key] = value
    }

    remove(key: string) {
        if (this.containsKey(key))
            delete this.items[key];
    }

    getItem(key: string) {
        return (this.containsKey(key)) ? this.items[key] : undefined
    }

    private containsKey(key: string) {
        return (typeof this.items[key] !== "undefined")
    }
}

interface IProps {
    controls: Dictionary<(controlProps: IControlRenderProps) => JSX.Element>,    
    actions: Dictionary<(handlerProps: IHandlerProps) => Promise<void> | void>,
    conditions: Dictionary<(handlerProps: IHandlerProps) => boolean>,
    tableSettingsLoaders: Dictionary<(tableId: string) => Promise<ITableSettings>>,
    userSettingsLoaders: Dictionary<(tableId: string) => Promise<ITableUserSettings>>,
    dataProviders: Dictionary<(tableState: ITableState, tableSettings: ITableSettings, userSettings: ITableUserSettings) => Promise<ITableData>>,
    translation?: (key?: string) => string
}

const init: IProps = {
    controls: new Dictionary<(controlProps: IControlRenderProps) => JSX.Element>(),
    actions: new Dictionary<(handlerProps: IHandlerProps) => Promise<void> | void>(),
    conditions: new Dictionary<(handlerProps: IHandlerProps) => boolean>(),
    tableSettingsLoaders: new Dictionary<(tableId: string) => Promise<ITableSettings>>(),
    userSettingsLoaders: new Dictionary<(tableId: string) => Promise<ITableUserSettings>>(),
    dataProviders: new Dictionary<(tableState: ITableState, tableSettings: ITableSettings, userSettings: ITableUserSettings) => Promise<ITableData>>()
}

const StoreComponentsContext = createContext<IProps>(init);

export function useEosTableComponentsStore() {
    const context = useContext(StoreComponentsContext)

    function addControlToStore(name: string, control: (controlProps: IControlRenderProps) => JSX.Element) {
        context.controls.add(name, control);
    }

    function fetchControlFromStore(name: string) {
        return context.controls.getItem(name);
    }

    function addActionToStore(name: string, action: (handlerProps: IHandlerProps) => Promise<void> | void) {
        context.actions.add(name, action);
    }

    function fetchActionFromStore(name: string) {
        return context.actions.getItem(name);
    }

    function addConditionToStore(name: string, action: (handlerProps: IHandlerProps) => boolean) {
        context.conditions.add(name, action);
    }

    function fetcConditionFromStore(name: string) {
        return context.conditions.getItem(name);
    }

    function addTableSettingLoader(name: string, settingLoader: (tableId: string) => Promise<ITableSettings>) {
        context.tableSettingsLoaders.add(name, settingLoader)
    }

    function addUserSettingLoader(name: string, settingLoader: (tableId: string) => Promise<ITableUserSettings>) {
        context.userSettingsLoaders.add(name, settingLoader)
    }

    function fetchTableSettingLoader(name: string) {
        return context.tableSettingsLoaders.getItem(name);
    }

    function fetchUserSettingLoader(name: string) {
        return context.userSettingsLoaders.getItem(name);
    }

    function addDataProvider(name: string, dataProvider: (tableState: ITableState, tableSettings: ITableSettings, userSettings: ITableUserSettings) => Promise<ITableData>) {
        context.dataProviders.add(name, dataProvider)
    }

    function fetchDataProvider(name: string) {
        return context.dataProviders.getItem(name);
    }

    function translationCallback(callback: (key?: string) => string) {
        context.translation = callback
    }

    function translation(key?: string) {
        return key && context.translation ? context.translation(key) : key;
    }

    return {
        addActionToStore,
        addConditionToStore,
        addControlToStore,
        addDataProvider,
        addTableSettingLoader,
        addUserSettingLoader,
        fetchActionFromStore,
        fetcConditionFromStore,
        fetchControlFromStore,
        fetchDataProvider,
        fetchTableSettingLoader,
        fetchUserSettingLoader,
        translationCallback,
        translation
    }
}
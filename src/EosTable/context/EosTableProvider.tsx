import React, { Fragment, ReactNode } from 'react'
import CheckboxDisplay from '../components/ColumnRender/Checkbox';
import DateTimeDisplay from '../components/ColumnRender/DateTime';
import DefaultDisplay from '../components/ColumnRender/Default';
import ReferenceDisplay from '../components/ColumnRender/Reference';
import Icon from '../components/MenuItemRender/IconRender';
import MenuButton from '../components/MenuItemRender/MenuButton';
import unSelected from '../conditions/unSelected';
import unSelectedOne from '../conditions/unSelectedOne';
import { useEosTableComponentsStore } from '../StoreComponents';
import QuickSearch from '../components/MenuItemRender/QuickSearch';
import { ITableSettings } from '../types/ITableSettings';
import { ITableUserSettings } from '../types/ITableUserSettings';
import { useDefaultProvider } from './DefaultDataProvider';
import { DATA_PROVIDER_DEFAULT, TABLE_SETTINS_LOADER_DEFAULT, TRIGGERS_DEFAULT, USER_SETTINS_LOADER_DEFAULT } from '../types/TextConstants';

interface IProps {
    tableSettingLoader?: (tableId?: string) => Promise<ITableSettings>
    userSettingLoader?: (tableId?: string) => Promise<ITableUserSettings>
    translation?: (key?: string) => string
    children?: ReactNode | ReactNode[] | undefined
}

export default function EosTableProvider({
    tableSettingLoader,
    userSettingLoader,
    translation,
    children

}: IProps) {

    const { addControlToStore, addActionToStore, addConditionToStore, addTableSettingLoader, addUserSettingLoader, addDataProvider, translationCallback } = useEosTableComponentsStore()
    
    addControlToStore("CheckboxDisplay", CheckboxDisplay)
    addControlToStore("DateTimeDisplay", DateTimeDisplay)
    addControlToStore("DefaultDisplay", DefaultDisplay)
    addControlToStore("ReferenceDisplay", ReferenceDisplay)
    addControlToStore("MenuButton", MenuButton)
    addControlToStore("Icon", Icon)
    addControlToStore("QuickSearch", QuickSearch)

    addConditionToStore("Unmarked", unSelected)
    addConditionToStore("UnmarkedOne", unSelectedOne)

    tableSettingLoader && addTableSettingLoader(TABLE_SETTINS_LOADER_DEFAULT, tableSettingLoader)
    userSettingLoader && addUserSettingLoader(USER_SETTINS_LOADER_DEFAULT, userSettingLoader)  

    translation && translationCallback(translation)   

    return (
        <Fragment>
            { children}
        </Fragment>
    )
}
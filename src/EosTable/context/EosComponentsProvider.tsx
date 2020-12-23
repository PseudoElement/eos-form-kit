import React, { Fragment, ReactNode } from 'react'
import { useEosComponentsStore } from '../../Hooks/useEosComponentsStore';
import { Icon, MenuButton, QuickSearch, MenuCheckableButton, ShowFilter } from '../../Menu/defaultRenders';
import { FileLinks } from '../components/ColumnRender';
import CheckboxDisplay from '../components/ColumnRender/Checkbox';
import DateTimeDisplay from '../components/ColumnRender/DateTime';
import DefaultDisplay from '../components/ColumnRender/Default';
import ReferenceDisplay from '../components/ColumnRender/Reference';
import unSelected from '../conditions/unSelected';
import unSelectedOne from '../conditions/unSelectedOne';
import { ITableSettings } from '../types/ITableSettings';
import { ITableUserSettings } from '../types/ITableUserSettings';

interface IProps {
    tableSettingLoader?: (tableId?: string) => Promise<ITableSettings>
    userSettingLoader?: (tableId?: string) => Promise<ITableUserSettings>
    translation?: (key?: string) => string
    children?: ReactNode | ReactNode[] | undefined
}

export default function EosComponentsProvider({
    children
}: IProps) {

    const { addControlToStore, addConditionToStore } = useEosComponentsStore()

    addControlToStore("CheckboxDisplay", CheckboxDisplay)
    addControlToStore("DateTimeDisplay", DateTimeDisplay)
    addControlToStore("DefaultDisplay", DefaultDisplay)
    addControlToStore("ReferenceDisplay", ReferenceDisplay)
    addControlToStore("LinksDisplay", FileLinks)
    addControlToStore("Button", MenuButton)
    addControlToStore("CheckableButton", MenuCheckableButton)
    addControlToStore("Icon", Icon)
    addControlToStore("QuickSearch", QuickSearch)
    addControlToStore("ShowFilter", ShowFilter)

    addConditionToStore("unSelected", unSelected)
    addConditionToStore("unSelectedOne", unSelectedOne)


    return (
        <Fragment>
            { children}
        </Fragment>
    )
}

import { Spin } from '@eos/rc-controls'
import React, { useEffect, useState } from 'react'
import EosTableGen from './EosTableGen'
import { ITableProvider } from '../types/ITableProvider'
import { ITableSettings } from '../types/ITableSettings'
import { ITableState } from '../types/ITableState'
import { ITableUserSettings } from '../types/ITableUserSettings'

interface ITableProps {
    /**Уникальный идентификатор настроек таблицы в системе*/
    tableId?: string
    /**Провайдер*/
    provider: ITableProvider
    /**Начальное состояние таблицы*/
    initTableState?: ITableState
    /**Функция локализации*/
    getResourceText?: (name: string) => string
}

/** Таблица-генератор */
const EosTable = React.forwardRef<any, ITableProps>(({
    tableId,
    provider,
    initTableState,
    getResourceText
}: ITableProps, ref) => {
    const [tableSettings, setGridSettings] = useState<ITableSettings>()
    const [gridUserSettings, setGridUserSettings] = useState<ITableUserSettings>()

    const { tableUserSettingLoad, tableSettingLoad } = provider

    useEffect(() => {
        tableSettingLoad && tableSettingLoad(tableId).then((data) => setGridSettings(data))
        tableUserSettingLoad && tableUserSettingLoad(tableId).then((data) => setGridUserSettings(data))
    }, [tableSettingLoad, tableUserSettingLoad, setGridSettings, setGridUserSettings, tableId])


    if (!tableSettings || !gridUserSettings) {
        return <Spin size="large" />
    }

    return <EosTableGen tableSettings={tableSettings}
        tableUserSetiings={gridUserSettings}
        initTableState={initTableState}
        provider={provider}
        ref={ref}
        getResourceText={getResourceText} />
})
EosTableGen.displayName = "EosTable"
export { EosTable }

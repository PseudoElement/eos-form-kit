import { Spin } from '@eos/rc-controls'
import React, { useEffect, useRef, useState } from 'react'
import EosTableGen from './EosTableGen'

import { ITableApi } from '../types/ITableApi'
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
    const currentRef = ref ?? useRef<ITableApi>();

    const [tableSettings, setGridSettings] = useState<ITableSettings>()
    const [gridUserSettings, setGridUserSettings] = useState<ITableUserSettings>()

    useEffect(() => {
        provider && provider.tableSettingLoad && provider.tableSettingLoad(tableId).then((data) => setGridSettings(data))
        provider && provider.tableUserSettingLoad && provider.tableUserSettingLoad(tableId).then((data) => setGridUserSettings(data))
    }, [provider.tableSettingLoad, provider.tableUserSettingLoad])


    if (!tableSettings || !gridUserSettings) {
        return <Spin size={"large"}></Spin>
    }

    return <EosTableGen tableSettings={tableSettings}
        tableUserSetiings={gridUserSettings}
        initTableState={initTableState}
        provider={provider}
        ref={currentRef}
        getResourceText={getResourceText} />
})
EosTableGen.displayName = "EosTable"
export { EosTable }

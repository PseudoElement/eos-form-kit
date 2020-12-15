import { Spin } from '@eos/rc-controls'
import React, { useEffect, useRef, useState } from 'react'
import EosTableGen from './components/EosTableGen'
import { useDefaultProvider } from './context/DefaultDataProvider'
import { ITableApi } from './types/ITableApi'
import { ITableProvider } from './types/ITableProvider'
import { ITableSettings } from './types/ITableSettings'
import { ITableState } from './types/ITableState'
import { ITableUserSettings } from './types/ITableUserSettings'

interface ITableProps {
    tableId?: string
    provider: ITableProvider
    initTableState?: ITableState
}

const EosTable = React.forwardRef<any, ITableProps>(({
    tableId,
    provider,
    initTableState
}: ITableProps, ref) => {

    const { DefaultTableProvider } = useDefaultProvider()

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
        provider={{
            ...DefaultTableProvider,
            ...provider
        }}
        ref={currentRef} />
})

export default EosTable
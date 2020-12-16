import { Menu } from '@eos/rc-controls'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FormContext, IMenuButton } from '../Context/Context'
import { compareArrays } from '../EosTable/helpers/compareObjects'
import { FetchAction, FetchCondition, FetchControlRender } from '../EosTable/types'
import { MenuIemsArray } from './MenuItemsArray'
import { IMenuItem } from './types'

export interface IMenuProps {
    menuItems: IMenuItem[]
    refApi: any
    fetchControlRender: FetchControlRender
    fetchAction: FetchAction
    fetchCondition: FetchCondition
    contextButtons?: IMenuButton[]
}

const EosMenu = React.forwardRef(({ ...props }: IMenuProps) => {
    //const currentRef = ref || React.createRef()
    const context = useContext(FormContext)
    const [contextButtons, setContextButtons] = useState<IMenuButton[]>([])
    useEffect(() => {
        context.menuButtons && !compareArrays(contextButtons, context.menuButtons) && setContextButtons(context.menuButtons)
    }, [context.menuButtons])
    //const properties = { ...props, contextButtons }
    const menu = () => <Menu mode={"horizontal"}>
        {/* <MenuIemsArray {...properties} ref={currentRef}></MenuIemsArray> */}
        {(MenuIemsArray({...props, contextButtons}))}
    </Menu>
    return useMemo(menu, [contextButtons])
})

export default EosMenu
import { Menu } from '@eos/rc-controls'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FormContext, IButton } from '../Context/Context'
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
    contextButtons?: IButton[]
}

const ClientMenu = ({ ...props }: IMenuProps) => { 
    const context = useContext(FormContext)
    const [contextButtons, setContextButtons] = useState<IButton[]>([])
    useEffect(()=>{
        context.buttons && !compareArrays(contextButtons, context.buttons) && setContextButtons(context.buttons)
    },[context.buttons])
    const menu = () => <Menu mode={"horizontal"}>{
        (MenuIemsArray({...props, contextButtons}))}</Menu>
    return useMemo(menu,[contextButtons])
}

export default ClientMenu
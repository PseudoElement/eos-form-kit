import { Menu } from '@eos/rc-controls'
import React, { useContext, useEffect, useState } from 'react'
import { FormContext } from '../Context/Context'
import { FetchAction, FetchCondition, FetchControlRender } from '../EosTable/types'
import { MenuIemsArray } from './MenuIemsArray'
import { IMenuItem } from './types'

export interface IMenuProps {
    menuItems: IMenuItem[]    
    refApi: any    
    fetchControlRender: FetchControlRender
    fetchAction: FetchAction
    fetchCondition: FetchCondition
}

const ClientMenu = ({ ...props }: IMenuProps) => {
    const context = useContext(FormContext);
    
    const [menuItems, setMenuItems] = useState<JSX.Element[]>()
    useEffect(() => {
        setMenuItems(MenuIemsArray(props))
    }, [context])
    

    const menu = <Menu mode={"horizontal"}>{menuItems}</Menu>
    return menu
}

export default ClientMenu
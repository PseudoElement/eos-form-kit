import { Menu } from '@eos/rc-controls'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FormContext } from '../Context/Context'
import { Icon } from './defaultRenders'
import { IMenuItem } from './types'

export interface IMenuItemApi {
    setDisabled: (isDisable: boolean) => void
}

const MenuItemGen = React.forwardRef(({ key, title }: IMenuItem, ref: any) => {
    const context = useContext(FormContext)
    const [disabled, setDisabled] = useState<boolean>()
    useEffect(() => {
        //setDisabled(context.buttons?.find(b=>b.name === key)?.disabled)
        setDisabled(!disabled)
    }, [context])
    const item = <Menu.Item title={title}
        key={key}
        disabled={disabled || ref}
    >
        <Icon></Icon>
    </Menu.Item>

    return useMemo(() => item, [disabled])
})

export { MenuItemGen }
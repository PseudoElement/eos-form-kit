import { Menu } from '@eos/rc-controls'
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Icon } from './defaultRenders'
import { IMenuItem } from './types'

export interface IMenuItemApi {
    setDisabled: (isDisable: boolean) => void
}

const MenuItem = React.forwardRef(({ key, title }: IMenuItem, ref: any) => {

    const [disabled, setDisabled] = useState<boolean>()
    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, (): IMenuItemApi => {
        return {
            setDisabled: setDisabled
        }
    })

    const item = <Menu.Item title={title}
        key={key}
    //onClick={onClickFunc && (() => onClickFunc({ refApi, menuItem }))}
    //disabled={disableFunc && disableFunc({ refApi, menuItem })}
    //morePanelElement={menuItem.fold}>
    //{Component && <Component {...props} />} 
    
    >
        <Icon></Icon>
    </Menu.Item>

    return useMemo(() => item, [disabled])
})

export { MenuItem }
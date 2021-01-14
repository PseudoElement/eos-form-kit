import { Menu } from '@eos/rc-controls'
import React from 'react'
import GenMenuItems, { IGenMenuItemProps } from '../components/GenMenuItems'

const GenerateContextMenu = (props: IGenMenuItemProps) => {
    return (
        <Menu>
            {GenMenuItems({ ...props, dividerOrientation: "horizontal" })}
        </Menu>
    )
}

export default GenerateContextMenu
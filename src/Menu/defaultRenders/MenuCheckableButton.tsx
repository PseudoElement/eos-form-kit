import { CheckableButton } from '@eos/rc-controls'
import React from 'react'
import { IControlRenderProps } from '../../EosTable/types'
import Icon from './IconRender'


function MenuCheckableButton({ renderArgs }: IControlRenderProps) {
    const iconName = (renderArgs && renderArgs["iconName"]) || "" 
    return (
        <CheckableButton>
            <Icon renderArgs={ { name: iconName}} />
        </CheckableButton>
    )
}

export default MenuCheckableButton
import { CheckableButton } from '@eos/rc-controls';
import React from 'react'
import { IControlRenderProps } from '../../types/IControlRenderProps';
import Icon from '../../components/MenuItemRender/IconRender'

function MenuCheckableButton({ renderArgs }: IControlRenderProps) {
    const iconName = (renderArgs && renderArgs["iconName"]) || "" 
    return (
        <CheckableButton>
            <Icon renderArgs={ { name: iconName}} />
        </CheckableButton>
    )
}

export default MenuCheckableButton
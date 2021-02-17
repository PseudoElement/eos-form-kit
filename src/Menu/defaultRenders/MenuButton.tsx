import { SmartButton } from '@eos/rc-controls'
import React from 'react'
import { IControlRenderProps } from '../../EosTable/types'
import Icon from './IconRender'

export default function MenuButton({ renderArgs }: IControlRenderProps) {
    if (!renderArgs)
        return <SmartButton />

    return <SmartButton type={renderArgs.typeButton}>
        <Icon renderArgs={{ iconName: renderArgs.iconName }} />
        {renderArgs.titleButton}
    </SmartButton>
}

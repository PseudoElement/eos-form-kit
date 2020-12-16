import { SmartButton } from '@eos/rc-controls'
import React from 'react'
import { IControlRenderProps } from '../../EosTable/types'

import Icon from './IconRender'


export default function MenuButton({ renderArgs }: IControlRenderProps) {
    if (!renderArgs)
        return <SmartButton>{"Button"}</SmartButton>
    const type: any = renderArgs["type"]
    return React.useMemo(() => <SmartButton type={type} icon={<Icon renderArgs={{ iconName: renderArgs.iconName }} />}>{renderArgs["title"]}</SmartButton>,[])
}

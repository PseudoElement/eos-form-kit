import { Button } from '@eos/rc-controls'
import React, { Fragment } from 'react'
import { IControlRenderProps } from '../../types/IControlRenderProps'
import Icon from './IconRender'


export default function MenuButton({ renderArgs }: IControlRenderProps) {
    if (!renderArgs)
        return <Button>{"Button"}</Button>
    const type: any = renderArgs["type"]
    return <Button type={type} icon={<Icon renderArgs={{ name: renderArgs["Icon"] }} />}>{renderArgs["title"]}</Button>
}
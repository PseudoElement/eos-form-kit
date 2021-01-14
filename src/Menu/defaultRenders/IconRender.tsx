import React, { Fragment } from 'react'
import { IControlRenderProps } from '../../EosTable/types';

import * as Icons from '@eos/rc-controls/lib/icon/icons'
export default function Icon({ renderArgs }: IControlRenderProps) {
    const Icon = renderArgs?.iconName ? Icons[renderArgs.iconName] : undefined

    return Icon
        ? <Icon style={{ fontSize: renderArgs?.iconSize, color: renderArgs?.iconColor }} />
        : <Fragment />
}
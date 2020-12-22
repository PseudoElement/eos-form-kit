import { SmartCheckableButton } from '@eos/rc-controls'
import React, { useEffect, useState } from 'react'
import { IControlRenderProps } from '../../EosTable/types'
import Icon from './IconRender'


function MenuCheckableButton({ renderArgs, buttonChecked }: IControlRenderProps) {
    const [checked, setChecked] = useState<boolean | undefined>()
    useEffect(() => {
        setChecked(buttonChecked)
    }, [buttonChecked])
    return (
        <SmartCheckableButton checked={checked} onChange={() => setChecked(!checked)}>
            <Icon renderArgs={{ iconName: renderArgs?.iconName }} />
        </SmartCheckableButton>
    )
}

export default MenuCheckableButton

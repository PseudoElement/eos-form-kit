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
        <SmartCheckableButton width={renderArgs?.titleButton ? undefined : 36} checked={checked} onChange={() => setChecked(!checked)}>
            <Icon renderArgs={{ iconName: renderArgs?.iconName }} />{renderArgs?.titleButton}
        </SmartCheckableButton>
    )
}

export default MenuCheckableButton

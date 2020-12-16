import { CheckboxIcon } from '@eos/rc-controls';
import React from 'react';
import { IControlRenderProps } from '../../types/IControlRenderProps';

export default function CheckboxDisplay({ valueInCell }: IControlRenderProps) {
    return <p style={{ textAlign: "center" }}>{valueInCell && <CheckboxIcon />}</p>
}
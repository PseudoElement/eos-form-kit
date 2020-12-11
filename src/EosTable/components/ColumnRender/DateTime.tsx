import { Space } from '@eos/rc-controls';
import React from 'react';
import { IControlRenderProps } from '../../types/IControlRenderProps';


export default function DateTimeDisplay({ valueInCell }: IControlRenderProps) {
    const dateFormat = new Date(valueInCell).toLocaleString("ru-RU").replace(',', ' ');
    return <Space>{dateFormat}</Space>
}
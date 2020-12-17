import { SmartTypography } from '@eos/rc-controls';
import React from 'react';
import { IControlRenderProps } from '../../types/IControlRenderProps';

export default function ReferenceDisplay({ valueInCell, renderArgs }: IControlRenderProps) {
    return <SmartTypography.Paragraph title={valueInCell.name} ellipsis={{ rows: renderArgs?.ellipsisRows || 3 }} >{valueInCell.name}</SmartTypography.Paragraph>
}

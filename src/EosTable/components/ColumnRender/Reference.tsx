import React, { Fragment } from 'react';
import { IControlRenderProps } from '../../types/IControlRenderProps';

export default function ReferenceDisplay({recordInRow}:IControlRenderProps) {
    return <Fragment>{recordInRow.name}</Fragment>
    //return <SmartTooltip title={value.name}><SmartTypography.Paragraph  ellipsis={{rows:3}} >{value.name}</SmartTypography.Paragraph></SmartTooltip>
}
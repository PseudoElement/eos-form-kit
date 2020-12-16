import { Row, SmartTypography } from '@eos/rc-controls';
import React, { Fragment } from 'react';
import { IControlRenderProps } from '../../types/IControlRenderProps';

export default function FileLinksDisplay({ renderArgs, recordInRow }: IControlRenderProps) {
    if (renderArgs && renderArgs.array && renderArgs.name && renderArgs.link && recordInRow[renderArgs.array]) {
        const arrayItems = Array.from(recordInRow[renderArgs.array])

        const links = arrayItems?.map((elem: any, index: number) => {
            return <Row key={index}>
                <a href={renderArgs.link && elem[renderArgs.link]}>{renderArgs.name && elem[renderArgs.name]}</a>
            </Row>
        })

        return <SmartTypography.Paragraph ellipsis={{ rows: renderArgs.ellipsisRows || 3, expandable: true }}>{links}</SmartTypography.Paragraph>
    }
    return <Fragment />
}

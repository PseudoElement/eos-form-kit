import React from 'react'
import { SmartTypography } from "@eos/rc-controls";
import { IControlRenderProps } from "../../types/IControlRenderProps";


export default function DefaultDisplay({ valueInCell, renderArgs }: IControlRenderProps) {
    let values: string[] = []
    const setValue = (object: any) => {
        if (typeof object === 'object') {
            const keys = Object.keys(object).filter(k => k !== "__typename")
            for (const key of keys) {
                setValue(object[key])
            }
        }
        else {
            values.push(object)
        }
    }
    setValue(valueInCell)
    const result = values.join('; ')
    return <SmartTypography.Paragraph title={result} ellipsis={{ rows: renderArgs?.ellipsisRows || 3 }} >{result}</SmartTypography.Paragraph>
}
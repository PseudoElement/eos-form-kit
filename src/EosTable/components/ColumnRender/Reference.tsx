import { IControlRenderProps } from '../../types/IControlRenderProps';

export default function ReferenceDisplay({ valueInCell }: IControlRenderProps) {
    const keys = Object.keys(valueInCell).filter(k => k !== "__typename" && typeof valueInCell[k] === 'string')
    return keys.length > 0 ? valueInCell[keys[0]] : 'Reference Object'
}

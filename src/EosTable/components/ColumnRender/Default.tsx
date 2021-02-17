import { IControlRenderProps } from "../../types/IControlRenderProps";

 function DefaultDisplay({ valueInCell }: IControlRenderProps) {
    let resultText: any = null

    if (valueInCell !== null && valueInCell !== undefined) {
        if (typeof valueInCell === 'object') {
            const values: string[] = []
            const setValue = (object: any) => {
                if (object && typeof object === 'object') {
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
            resultText = values.join('; ')
        }
        else {
            resultText = valueInCell
        }
    }

    return resultText
}

export default DefaultDisplay
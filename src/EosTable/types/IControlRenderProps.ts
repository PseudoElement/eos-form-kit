import { IRenderArgs } from "./ITableSettings";

export interface IControlRenderProps {
    renderArgs?: IRenderArgs
    valueInCell?: any
    recordInRow?: any
    indexOfRow?: number
    refApi?: any
    buttonChecked?: boolean
}

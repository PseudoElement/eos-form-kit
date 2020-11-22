import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Row } from "@eos/rc-controls";
import FormCell, { IFormCell, IAutoCell, IWidthCell, IThreeFieldsCell, IFormCellApi } from "./FormCell";

/**Тип столбцов внутри строки IFormRow. */
export type CellsType = IFormCell | IAutoCell | IWidthCell | IThreeFieldsCell;

export interface IFormRowApi {
    disableField(name: string): void;
    enableField(name: string): void;
}

/**Настройки компонента строки с полями внутри формы. */
export interface IFormRow {
    /**Список столбцов. */
    cells?: CellsType[];
}

/**Компонент строки с полями внутри формы. */
const FormRow = forwardRef<any, IFormRow>((props: IFormRow, ref) => {
    const [cellRefs] = useState<any[]>([props.cells?.length || 0]);
    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, () => {
        const api: IFormCellApi = {
            disableField(name: string) {
                if (cellRefs)
                    for (let cellRef of cellRefs) {
                        const api: React.MutableRefObject<IFormCellApi> = cellRef;
                        api?.current?.disableField(name);
                    }
            },
            enableField(name: string) {
                if (cellRefs)
                    for (let cellRef of cellRefs) {
                        const api: React.MutableRefObject<IFormCellApi> = cellRef;
                        api?.current?.enableField(name);
                    }
            }
        }
        return api;
    });

    let key = 0;
    let i = 0;
    return (
        <Row gutter={[20, 10]}>
            {
                props.cells?.map((cell: CellsType) => {
                    const cellRef = useRef<IFormCellApi>();
                    cellRefs[i++] = cellRef;
                    return <FormCell key={key++} {...cell} ref={cellRef} />
                })
            }
        </Row>
    );
});
export default FormRow;
import React, { forwardRef, FunctionComponent, useImperativeHandle, useRef, useState } from "react";
import { Row, Typography } from "@eos/rc-controls";
import FormCell, { IFormCell, IAutoCell, IWidthCell, IThreeFieldsCell, IFormCellApi } from "./FormCell";


interface IFormRowTitle {
    title: string;
}

/**Заголовок строки. */
const FormRowTitle: FunctionComponent<IFormRowTitle> = (props: IFormRowTitle) => {
    return (
        <Typography.Paragraph style={{ fontSize: "18px", color: "#646464", marginTop: "15px", marginBottom: "5px" }}>
            {props.title}
        </Typography.Paragraph>
    )
}

/**Тип столбцов внутри строки IFormRow. */
export type CellsType = IFormCell | IAutoCell | IWidthCell | IThreeFieldsCell;

export interface IFormRowApi {
    disableField(name: string): void;
    enableField(name: string): void;
}

/**Настройки компонента строки с полями внутри формы. */
export interface IFormRow {
    /**Заголовок в виде текста размером 18px строки */
    title?: string;
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
        <div>
            {props.title && <FormRowTitle title={props.title} />}
            <Row gutter={[20, 10]}>
                {
                    props.cells?.map((cell: CellsType) => {
                        const cellRef = useRef<IFormCellApi>();
                        cellRefs[i++] = cellRef;
                        return <FormCell key={key++} {...cell} ref={cellRef} />
                    })
                }
            </Row>
        </div>
    );
});
export default FormRow;
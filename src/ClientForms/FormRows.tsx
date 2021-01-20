import React, { FunctionComponent } from "react";
import CollapsableFormRow, { ICollapsableFormRow } from "./CollapsableFormRow";
import FormRow, { IFormRow } from "./FormRow";

/**Настройки компонента строк с полями внутри формы. */
export interface IFormRows {
    rows?: RowsType[];
}

/**Тип отрисовки строки. */
export enum RowType {
    /**Обычная строка. */
    FormRow = 0,
    /**Строка со сворачиванием */
    CollapsableFormRow = 1
}

/**Тип строк. */
export type RowsType = IBaseFormRow | IFormRow | ICollapsableFormRow;

export interface IBaseFormRow {
    /**Тип строки. */
    type?: RowType;
}


/**Компонент строк с полями внутри формы. */
const FormRows: FunctionComponent<IFormRows> = (props: IFormRows) => {
    let key = 0;
    return (
        <div style={{ padding: "20px 20px 0 20px", width: "100%", background: "#fff" }}>
            {
                props.rows &&
                props.rows.map((row: IBaseFormRow) => {
                    switch (row.type) {
                        case RowType.CollapsableFormRow:
                            return <CollapsableFormRow key={key++} {...row} />
                        case RowType.FormRow:
                        default:
                            return <FormRow key={key++} {...row} />
                    }
                })
            }
        </div>
    );
}
export default FormRows;
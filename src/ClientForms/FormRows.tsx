import React, { FunctionComponent } from "react";
import FormRow, { IFormRow } from "./FormRow";

/**Настройки компонента строк с полями внутри формы. */
export interface IFormRows {
    rows?: IFormRow[];
}
// export interface IFormRowsApi {
//     disableField(name: string): void;
//     enableField(name: string): void;
// }


/**Компонент строк с полями внутри формы. */
const FormRows: FunctionComponent<IFormRows> = (props: IFormRows) => {
    let key = 0;
    return (
        <div style={{ padding: "20px 20px 0 20px", width: "100%", background: "#fff" }}>
            {
                props.rows &&
                props.rows.map(row => {
                    return <FormRow key={key++} {...row} />
                })
            }
        </div>
    );
}
export default FormRows;
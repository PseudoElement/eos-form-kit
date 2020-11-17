import React, { FunctionComponent } from "react";
import { Row } from "@eos/rc-controls";
import FormCell, { IFormCell, IAutoCell, IWidthCell, IThreeFieldsCell } from "./FormCell";

export type CellsType = IFormCell | IAutoCell | IWidthCell | IThreeFieldsCell;
export interface IFormRow {
    cells?: CellsType[];
}
const FormRow: FunctionComponent<IFormRow> = (props: IFormRow) => {
    let key = 0;
    return (
        <Row gutter={[20, 10]}>
            {
                props.cells?.map((cell: CellsType) => {
                    return <FormCell key={key++} {...cell} />
                })
            }
        </Row>
    );
};
export default FormRow;
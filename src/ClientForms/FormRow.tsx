import React, { FunctionComponent } from "react";
import { Row } from "@eos/rc-controls";
import FormCell, { IFormCell, IAutoCell, IWidthCell, IThreeFieldsCell } from "./FormCell";

/**Тип столбцов внутри строки IFormRow. */
export type CellsType = IFormCell | IAutoCell | IWidthCell | IThreeFieldsCell;

/**Настройки компонента строки с полями внутри формы. */
export interface IFormRow {
    /**Список столбцов. */
    cells?: CellsType[];
}

/**Компонент строки с полями внутри формы. */
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
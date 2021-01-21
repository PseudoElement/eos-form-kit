import React, { FunctionComponent, ReactElement } from "react";
import CollapsableFormRow, { ICollapsableFormRow } from "./CollapsableFormRow";
import FormRow, { IFormRow } from "./FormRow";

/**Настройки компонента строк с полями внутри формы. */
export interface IFormRows {
    rows?: RowsType[];
     /**Метод для получения кастомной строки с произвольной разметкой. */
     getCustomRow?: (customType: string) => ReactElement | ReactElement[] | undefined;
}

/**Тип отрисовки строки. */
export enum RowType {
    /**Обычная строка. */
    FormRow = 0,
    /**Строка со сворачиванием */
    CollapsableFormRow = 1,
    /**Строка с произвольной разметкой. */
    CustomFormRow = 2
}

/**Тип строк. */
export type RowsType = IBaseFormRow | IFormRow | ICollapsableFormRow | ICustomFormRow;

export interface IBaseFormRow {
    /**Тип строки. */
    type?: RowType;
}

/**Настройки компонента строки с произвольной разметкой. */
export interface ICustomFormRow extends IBaseFormRow {
    /**Строковое представление типа произвольной строки. По этот же тип должен быть реализован в методе getCustomRow. */
    customType: string;
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
                        case RowType.CustomFormRow:
                            const customFormRowProps: ICustomFormRow = row as ICustomFormRow;
                            const customRow = props?.getCustomRow?.(customFormRowProps.customType);
                            return (<React.Fragment> { customRow && customRow}</React.Fragment>);
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
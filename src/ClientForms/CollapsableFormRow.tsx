import { Collapse, SmartTypography } from "@eos/rc-controls";
import React, { FunctionComponent } from "react";
import FormRow, { IFormRow } from "./FormRow";
import { IBaseFormRow } from "./FormRows";

/**Настройки сворачиваемой строки. */
export interface ICollapsableFormRow extends IBaseFormRow {
    /**Наименование строки при клике на которое происходит сворачивание/разворачивание. */
    title?: string;
    /**true - если необходимо включить сворачивание. */
    collapsable?: boolean;
    /**Список строк внутри сворачиваемого блока. */
    rows?: IFormRow[];
}

/**
 * Сворачиваемая строка, группировка полей.
 * @param props 
 */
const CollapsableFormRow: FunctionComponent<ICollapsableFormRow> = (props: ICollapsableFormRow) => {
    if (props.collapsable)
        return (<Collapsable {...props} />);
    else
        return (<NoCollapsable  {...props} />);
}

export default CollapsableFormRow;

const NoCollapsable: FunctionComponent<ICollapsableFormRow> = (props: ICollapsableFormRow) => {
    let key = 0;
    return (
        <div>
            {
                props.rows &&
                props.rows.map(row => {
                    return <FormRow key={key++} {...row} />
                })
            }
        </div>
    )
}
const Collapsable: FunctionComponent<ICollapsableFormRow> = (props: ICollapsableFormRow) => {
    let key = 0;
    return (
        <React.Fragment>
            <Collapse expandIconPosition={'right'} ghost bordered={true} accordion>
                <Collapse.Panel key="1" header={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SmartTypography.Paragraph style={{ fontSize: "18px", color: "#646464", marginBottom: "5px" }}>
                            {props.title}
                        </SmartTypography.Paragraph>
                    </div>}>
                    {
                        props.rows &&
                        props.rows.map(row => {
                            return <FormRow key={key++} {...row} />
                        })
                    }
                </Collapse.Panel>
            </Collapse>
        </React.Fragment>
    )
}
import { Form, Select as RcSelect} from "@eos/rc-controls";
import React from "react";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";

/**Настройки поля типа "Выпадающий список"*/
export interface ISelect extends IField {
    /**Список значений в выпадающем списке. */
    values?: IOption[];
}

/**Значение в выпадающим списке. */
export interface IOption {
    /**Значение. */
    key: string;
    /**Отображаемое значение в UI. */
    value: string;
}

/**Поле типа "Выпадающий список". */
export const Select = React.forwardRef<any, ISelect>((props: ISelect, ref) => {
    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));
    switch (props.mode) {
        case FormMode.display:
            // return FieldsHelper.getDisplayField(props.label, props.name);
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules} >
                    <RcSelect disabled={true}
                        ref={ref}
                        required={props.required}
                    >
                        {props.values?.map(value => {
                            return <RcSelect.Option key={value.key} value={value.key}>{value.value}</RcSelect.Option>
                        })}
                    </RcSelect>
                </Form.Item >
            );
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules} >
                    <RcSelect
                        ref={ref}
                        required={props.required}
                    >
                        {props.values?.map(value => {
                            return <RcSelect.Option key={value.key} value={value.key}>{value.value}</RcSelect.Option>
                        })}
                    </RcSelect>
                </Form.Item >
            );
    }
});

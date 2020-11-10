import { Form, Select } from "eos-webui-controls";
import React from "react";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField from "./IField";


export interface IFieldSelect extends IField {
    /**Список значений в выпадающем списке. */
    values?: IOption[];
}

export interface IOption {
    /**Значение. */
    key: string;
    /**Отображаемое значение в UI. */
    value: string;
}

/**Полt типа "Выпадающий список". */
export const FieldSelect = React.forwardRef<any, IFieldSelect>((props: IFieldSelect, ref) => {
    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));
    switch (props.mode) {
        case FormMode.display:
            // return FieldsHelper.getDisplayField(props.label, props.name);
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules} >
                    <Select disabled={true}
                        ref={ref}
                        required={props.required}
                    >
                        {props.values?.map(value => {
                            return <Select.Option key={value.key} value={value.key}>{value.value}</Select.Option>
                        })}
                    </Select>
                </Form.Item >
            );
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules} >
                    <Select
                        ref={ref}
                        required={props.required}
                    >
                        {props.values?.map(value => {
                            return <Select.Option key={value.key} value={value.key}>{value.value}</Select.Option>
                        })}
                    </Select>
                </Form.Item >
            );
    }
});

export default FieldSelect;
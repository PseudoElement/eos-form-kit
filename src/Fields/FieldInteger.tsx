import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Form, Number } from "@eos/rc-controls";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField, { IFieldApi } from "./IField";

/**Настройки целочисленного поля. */
export interface IInteger extends IField {
    /**Минимальное число. */
    min?: number;
    /**Максимальное число. */
    max?: number;
    /**Значение по умолчанию. */
    defaultValue?: number;
    /**Показывать кнопки увеличения числа. */
    showCounter?: boolean;
}

/**
 * Целочисленное поле.
 */
export const Integer = React.forwardRef<any, IInteger>((props: IInteger, ref) => {
    const [initialMode, setInitialMode] = useState<FormMode>(props.mode);
    const [mode, setMode] = useState<FormMode>(props.mode);
    useEffect(() => {
        setMode(props.mode);
        setInitialMode(props.mode);
    }, [props.mode]);
  
    const selfRef = useRef();
    const inputRef = useRef<any>();
    useImperativeHandle(ref ?? selfRef, () => {
        const api: IFieldApi = {
            focus() {
                if (inputRef?.current?.focus)
                    inputRef?.current?.focus();
            },
            disable() {
                setMode(FormMode.display);
            },
            enable() {
                setMode(initialMode);
            }
        }
        return api;
    });


    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));

    rules.push(FieldsHelper.getIntegerRule());

    switch (mode) {
        case FormMode.display:
            return FieldsHelper.getDisplayField(props.label, props.name);
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <Number ref={inputRef} style={{ width: "100%" }} required={props.required} defaultValue={props.defaultValue} min={props.min} max={props.max} counter={props.showCounter} />
                </Form.Item>
            );
    }
});

/**Возвращает значение поля типа "Дата". */
export function getFieldValueForClientRender() {
    return 1;
}
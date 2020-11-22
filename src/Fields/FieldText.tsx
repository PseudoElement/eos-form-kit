import React, { ReactElement, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Form, Input } from "@eos/rc-controls";
import { FormMode } from "../ClientForms/FormMode";
import { FieldsHelper } from "./FieldsHelper";
import IField, { IFieldApi } from "./IField";

/**
 * Настройки текстового поля.
 */
export interface IText extends IField {
    /**Отрисовать иконку очистки поля. */
    allowClear?: boolean;
    /**Максимальное количество символов. */
    maxLength?: number;
    /**Дополнительный текст в иконке по наведению. */
    additionalText?: string;
    /**Иконка с дополнительным текстом. */
    icon?: ReactElement;
}

/**
 * Текстовое поле.
 */
export const Text = React.forwardRef<any, IText>((props: IText, ref) => {
    const [initialMode, setInitialMode] = useState<FormMode>(props.mode);
    const [mode, setMode] = useState<FormMode>(props.mode);
    useEffect(() => {
        setMode(props.mode);
        setInitialMode(props.mode);
    }, [props.mode]);

    let rules = [];
    if (props.required)
        rules.push(FieldsHelper.getRequiredRule(props.requiredMessage));
    const suffix: ReactNode | undefined = props.additionalText != undefined && props.additionalText != null && props.additionalText != "" ?
        FieldsHelper.getInputSuffix(props.additionalText, props.icon) :
        undefined;

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

    switch (mode) {
        case FormMode.display:
            return FieldsHelper.getDisplayField(props.label, props.name, props.value, suffix);
        case FormMode.new:
        case FormMode.edit:
        default:
            return (
                <Form.Item label={props.label} name={props.name} style={{ marginBottom: 0, textTransform: "uppercase" }} rules={rules}>
                    <Input value={props.value} suffix={suffix} style={{ width: "100%" }} ref={inputRef} required={props.required} allowClear={props.allowClear} maxLength={props.maxLength} />
                </Form.Item>
            );
    }
});
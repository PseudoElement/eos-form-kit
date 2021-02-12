import React, { useContext, useEffect, useMemo, useState } from "react";
import { IField } from "..";
import { FormMode } from "../ClientForms/FormMode";
import { FormContext } from "../Context/Context";
import { Rule } from "rc-field-form/lib/interface"
import { FieldsHelper } from "./FieldsHelper";

export interface IBaseField {
    field: IField;
    getDisplayField(props: IField, ref: any, rules?: Rule[]): JSX.Element;
    getEditField(props: IField, ref: any, rules?: Rule[], required?: boolean): JSX.Element;
    getNewField(props: IField, ref: any, rules?: Rule[], required?: boolean): JSX.Element;
    rules?: Rule[];
}

export const BaseField = React.forwardRef<any, IBaseField>((props: IBaseField, ref: any) => {
    const context = useContext(FormContext);
    const [mode, setMode] = useState(props.field.mode);
    const [hidden, setHidden] = useState(false);
    const [required, setRequired] = useState(props.field.required);

    useEffect(() => {
        //  Простановка нового типа отрисовки поля.
        const formMode: FormMode = getFormMode();
        if (formMode != mode)
            setMode(formMode);

        //  Простановка видимости поля.
        const hiddenFromContext = getHidden();
        if (hiddenFromContext != hidden)
            setHidden(hiddenFromContext);

        //  Простановка обязательности поля.
        const requiredFromContext = getRequired();
        if (requiredFromContext !== undefined && requiredFromContext !== required)
            setRequired(requiredFromContext);
        else if (props.field.required !== required) {
            setRequired(props.field.required);
        }
    }, [context, props.field.mode]);


    const memoized = useMemo(() => {
        let rules: Rule[] = [];
        if (required)
            rules.push(FieldsHelper.getRequiredRule(props.field.requiredMessage));
        if (props.rules)
            for (let rule of props.rules)
                rules.push(rule);

        let fieldHtml;
        switch (mode) {
            case FormMode.display:
                fieldHtml = props.getDisplayField(props.field, ref, rules);
                break;
            case FormMode.edit:
                fieldHtml = props.getEditField(props.field, ref, rules, required);
                break;
            case FormMode.new:
            default:
                fieldHtml = props.getNewField(props.field, ref, rules, required);
                break;
        }
        return (
            <div style={{ display: (hidden ? "none" : "") }}>
                {fieldHtml}
            </div>);
    }, [hidden, mode, required]);

    return memoized;

    function getFormMode() {
        const field = getFieldFromContext();
        if (field) {
            if (field.disabled)
                return FormMode.display;
            else
                return props.field.mode;
        }
        return props.field.mode;
    }
    function getHidden(): boolean {
        const field = getFieldFromContext();
        return field?.hidden === true;
    }
    function getRequired(): boolean | undefined {
        const field = getFieldFromContext();
        return field?.required;
    }

    function getFieldFromContext() {
        if (context?.fields) {
            for (let field of context.fields) {
                if (field.name === props.field.name) {
                    return field;
                }
            }
        }
        return null;
    }

});
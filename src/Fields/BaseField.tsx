import React, { useContext, useEffect, useMemo, useState } from "react";
import { IField } from "..";
import { FormMode } from "../ClientForms/FormMode";
import { FormContext } from "../Context/Context";
import { Rule } from "rc-field-form/lib/interface"
import { FieldsHelper } from "./FieldsHelper";

export interface IBaseField {
    field: IField;
    getDisplayField(props: IField, ref: any, rules?: Rule[]): JSX.Element;
    getEditField(props: IField, ref: any, rules?: Rule[]): JSX.Element;
    getNewField(props: IField, ref: any, rules?: Rule[]): JSX.Element;
    rules?: Rule[];
}

export const BaseField = React.forwardRef<any, IBaseField>((props: IBaseField, ref: any) => {
    const context = useContext(FormContext);
    const [mode, setMode] = useState(props.field.mode);
    const [hidden, setHidden] = useState(false);

    // useEffect(() => {
    //     const formMode: FormMode = getFormMode();
    //     setMode(formMode);
    // }, [props.field.mode]);
    // useEffect(() => {
    //     const formMode: FormMode = getFormMode();
    //     setMode(formMode);
    // }, [context]);
    useEffect(() => {
        const formMode: FormMode = getFormMode();
        if (formMode != mode)
            setMode(formMode);
        const hiddenFromContext = getHidden();
        if (hiddenFromContext != hidden)
            setHidden(hiddenFromContext);
    }, [context, props.field.mode]);


    let rules: Rule[] = [];
    if (props.field.required)
        rules.push(FieldsHelper.getRequiredRule(props.field.requiredMessage));
    if (props.rules)
        for (let rule of props.rules)
            rules.push(rule);

    // return useMemo(() => {

    // let fieldHtml;
    // switch (mode) {
    //     case FormMode.display:
    //         fieldHtml = props.getDisplayField(props.field, ref, rules);
    //         break;
    //     case FormMode.edit:
    //         fieldHtml = props.getEditField(props.field, ref, rules);
    //         break;
    //     case FormMode.new:
    //     default:
    //         fieldHtml = props.getNewField(props.field, ref, rules);
    //         break;
    // }

    const memoized = useMemo(() => {
        let fieldHtml;
        switch (mode) {
            case FormMode.display:
                fieldHtml = props.getDisplayField(props.field, ref, rules);
                break;
            case FormMode.edit:
                fieldHtml = props.getEditField(props.field, ref, rules);
                break;
            case FormMode.new:
            default:
                fieldHtml = props.getNewField(props.field, ref, rules);
                break;
        }
        return (
            <div style={{ display: (hidden ? "none" : "") }}>
                {fieldHtml}
            </div>);
    }, [hidden, mode]);

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
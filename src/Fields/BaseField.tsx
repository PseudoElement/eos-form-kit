import React, {
    useContext, useEffect,
    useMemo,
    useState
} from "react";
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
    useEffect(() => {
        setMode(props.field.mode);
    }, [props.field.mode]);
    useEffect(() => {
        if (context.fields) {
            for (let field of context.fields) {
                if (field.name === props.field.name) {
                    if (field.disabled)
                        setMode(FormMode.display);
                    else
                        setMode(props.field.mode);
                    break;
                }
            }
        }
    }, [context]);

    let rules: Rule[] = [];
    if (props.field.required)
        rules.push(FieldsHelper.getRequiredRule(props.field.requiredMessage));
    if (props.rules)
        for (let rule of props.rules)
            rules.push(rule);

    return useMemo(() => {
        switch (mode) {
            case FormMode.display:
                return props.getDisplayField(props.field, ref, rules);
            case FormMode.edit:
                return props.getEditField(props.field, ref, rules);
            case FormMode.new:
            default:
                return props.getNewField(props.field, ref, rules);
        }
    }, [mode]);

});
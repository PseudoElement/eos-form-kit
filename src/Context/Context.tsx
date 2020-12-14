import React from "react";

export interface IFormContext {
    formTitle?: string;

    fields?: IField[];
    header?: IFormHeader;

    setFieldValue(name: string, value?: any): void,
    disableField(name: string): void;
    enableField(name: string): void;
    hideLeftIcon(): void;
    showLeftIcon(): void;
    setLeftIconTitle(title?: string): void;
    reset(): void;

    buttons?: IButton[]
    setDisabledButton(disable: boolean, name: string): void
    setVisibleButton(visible: boolean, name: string): void
    setCheckedButton(checked: boolean, name: string): void
}

export interface IField {
    name: string;
    disabled?: boolean;
}

export interface IFormHeader {
    leftIconTitle?: string;
    isLeftIconVisible?: boolean;
}

export interface IButton {
    name: string
    disabled?: boolean
    visible?: boolean
    checked?: boolean
}

export const defaultContext: IFormContext = {
    setFieldValue() { },
    disableField() { },
    enableField() { },
    reset() { },
    hideLeftIcon() { },
    showLeftIcon() { },
    setLeftIconTitle() { },
    setDisabledButton() { },
    setVisibleButton() { },
    setCheckedButton() { }
};
export const FormContext = React.createContext(defaultContext);
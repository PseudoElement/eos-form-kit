import React from "react";

export interface IFormContext {
    formTitle?: string;

    fields?: IField[];
    header?: IFormHeader;

    setFieldValue(name: string, value?: any): void,
    disableField(name: string): void;
    enableField(name: string): void;
    hideField(name: string): void;
    showField(name: string): void;
    hideLeftIcon(): void;
    showLeftIcon(): void;
    setLeftIconTitle(title?: string): void;
    reset(): void;

    menuButtons?: IMenuButton[]
    setDisabledMenuButton(disable: boolean, name: string): void
    setVisibleMenuButton(visible: boolean, name: string): void
    setCheckedMenuButton(checked: boolean, name: string): void
}

export interface IField {
    name: string;
    disabled?: boolean;
    hidden?: boolean;
}

export interface IFormHeader {
    leftIconTitle?: string;
    isLeftIconVisible?: boolean;
}

export interface IMenuButton {
    name: string
    disabled?: boolean
    visible?: boolean
    checked?: boolean
}

export const defaultContext: IFormContext = {
    setFieldValue() { },
    disableField() { },
    enableField() { },
    hideField() { },
    showField() { },
    reset() { },
    hideLeftIcon() { },
    showLeftIcon() { },
    setLeftIconTitle() { },
    setDisabledMenuButton() { },
    setVisibleMenuButton() { },
    setCheckedMenuButton() { }
};
export const FormContext = React.createContext(defaultContext);
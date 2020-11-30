import React from "react";

export interface IFormContext {
    formTitle?: string;


    fields?: IField[];
    header?: IFormHeader;

    disableField(name: string): void;
    enableField(name: string): void;
    hideLeftIcon(): void;
    showLeftIcon(): void;
    setLeftIconTitle(title?: string): void;
    reset(): void;
}

export interface IField {
    name: string;
    disabled?: boolean;
}

export interface IFormHeader {
    leftIconTitle?: string;
    isLeftIconVisible?: boolean;
}

export const defaultContext: IFormContext = {
    disableField() { },
    enableField() { },
    reset() { },
    hideLeftIcon() { },
    showLeftIcon() { },
    setLeftIconTitle() { }
};
export const FormContext = React.createContext(defaultContext);
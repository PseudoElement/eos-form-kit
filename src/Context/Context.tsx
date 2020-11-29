import React from "react";

export interface IFormContext {
    formTitle?: string;
    fields?: IField[];

    disableField(name: string): void;
    enableField(name: string): void;
}

export interface IField {
    name: string;
    disabled?: boolean;
}

export const defaultContext: IFormContext = { 
    disableField(){},
    enableField(){},
 };
export const FormContext = React.createContext(defaultContext);
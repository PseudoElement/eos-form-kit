import React from "react";

export interface IFormContext {
    formTitle?: string;
}
export const defaultContext: IFormContext = { formTitle: undefined };
export const FormContext = React.createContext(defaultContext);
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import FormRow, { IFormRow, IFormRowApi } from "./FormRow";

/**Настройки компонента строк с полями внутри формы. */
export interface IFormRows {
    rows?: IFormRow[];
}
export interface IFormRowsApi {
    disableField(name: string): void;
    enableField(name: string): void;
}


/**Компонент строк с полями внутри формы. */
const FormRows = forwardRef<any, IFormRows>((props: IFormRows, ref: any) => {
    let key = 0;
    const [rowRefs] = useState<any[]>([props.rows?.length || 0]);

    const selfRef = useRef<IFormRowsApi>();
    useImperativeHandle(ref ?? selfRef, () => {
        const api: IFormRowsApi = {
            disableField(name: string) {
                if (rowRefs)
                    for (let rowRef of rowRefs) {
                        const api: React.MutableRefObject<IFormRowApi> = rowRef;
                        api?.current?.disableField(name);
                    }
            },
            enableField(name: string) {
                if (rowRefs)
                    for (let rowRef of rowRefs) {
                        const api: React.MutableRefObject<IFormRowApi> = rowRef;
                        api?.current?.enableField(name);
                    }
            }
        }
        return api;
    });

    let i = 0;
    return (
        <div style={{ padding: "20px 20px 0 20px", width: "100%", background: "#fff" }}>
            {
                props.rows &&
                props.rows.map(row => {
                    const rowRef = useRef<IFormRowApi>();
                    rowRefs[i++] = rowRef;
                    return <FormRow key={key++} ref={rowRef} {...row} />
                })
            }
        </div>
    );
});
export default FormRows;
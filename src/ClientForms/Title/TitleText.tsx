import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

/**API компонента отображения наименования формы. */
export interface ITitleTextApi {
    setTitle(title: string): void;
}
/**Настройки компонента отображения наименования формы. */
export interface ITitleText {
    title: string;
}

/**Компонент отображения наименования формы. */
const TitleText = forwardRef<any, ITitleText>((props: ITitleText, ref: any) => {
    const [title, setTitle] = useState(props.title);
    const selfRef = useRef();

    useEffect(() => {
        setTitle(props.title);
    }, [props.title]);

    useImperativeHandle(ref ?? selfRef, () => {
        const api: ITitleTextApi = {
            setTitle(title: string) {
                setTitle(title);
            }
        }
        return api;
    });

    return (<span title={title} style={{ fontSize: "18px", color: "#646464", verticalAlign: "middle" }}>{title}</span>);
});
export default TitleText;
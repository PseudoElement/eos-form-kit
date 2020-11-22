import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Col, Row, Space } from "@eos/rc-controls";
import IField, { IFieldApi } from "../Fields/IField";
import fields from "../Fields/Fields";

/**Допустимые значения ширины столбца. */
export type WidthType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;

/**Тип отрисовки столбца. */
export enum CellType {
    /**Одно поле в одном столбце с растягиванием поля на 100% по ширине. */
    widthCell = 0,
    /**Поля идут один за другим в одном столбце. */
    autoCell = 1,
    /**В одном столбце два поля между которыми текст. */
    threeFields = 2
}

export interface IFormCellApi {
    disableField(name: string): void;
    enableField(name: string): void;
}

/**Настройки столбца. */
export interface IFormCell {
    /**Тип столбца. */
    type?: CellType;
}
/**Настройки столбца в котором одно поле с растягиванием поля на 100% по ширине. */
export interface IWidthCell extends IFormCell {
    /**Ширина столбца. */
    width?: WidthType;
    /**Список полей. */
    fields?: IField[];
}
/**Настройки столбца в котором поля идут один за другим.*/
export interface IAutoCell extends IFormCell {
    /**Список полей. */
    fields?: IField[];
}
/**Настройки столбца в котором два поля между которыми текст. */
export interface IThreeFieldsCell extends IFormCell {
    /**Ширина столбца. */
    width?: WidthType;
    /**Левое поле. */
    leftField?: IField;
    /**Текст между полями. */
    middleText?: string;
    /**Правое поле. */
    rightField?: IField;
}

/**Компонент для отрисовки столбца внутри формы. */
const FormCell = forwardRef<any, IFormCell | IWidthCell | IAutoCell | IThreeFieldsCell>((props: IFormCell | IWidthCell | IAutoCell | IThreeFieldsCell, ref) => {
    switch (props.type) {
        case CellType.autoCell:
            return (
                <AutoCell ref={ref} {...props} />
            );
        case CellType.threeFields:
            return (
                <ThreeFieldsCell ref={ref} {...props} />
            );
        case CellType.widthCell:
        default:
            return (
                <WidthCell ref={ref} {...props} />
            );

    }
});


// const WidthCell: FunctionComponent<IWidthCell> = (props: IWidthCell) => {
const WidthCell = forwardRef<any, IWidthCell>((props: IWidthCell, ref) => {
    const [fieldRefs] = useState<any[]>([props?.fields?.length || 0]);
    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, () => {
        const api: IFormCellApi = {
            disableField(name: string) {
                if (props && props?.fields)
                    for (let i = 0; i < props?.fields?.length; i++)
                        if (props?.fields[i].name === name && fieldRefs && fieldRefs.length > i) {
                            const api: React.MutableRefObject<IFieldApi> = fieldRefs[i];
                            if (api?.current?.disable)
                                api?.current?.disable();
                        }
            },
            enableField(name: string) {
                if (props && props?.fields)
                    for (let i = 0; i < props?.fields?.length; i++)
                        if (props?.fields[i].name === name && fieldRefs && fieldRefs.length > i) {
                            const api: React.MutableRefObject<IFieldApi> = fieldRefs[i];
                            if (api?.current?.enable)
                                api?.current?.enable();
                        }
            },
        }
        return api;
    });

    let i = 0;
    return (
        <Col xs={props.width} md={props.width}>
            {
                props.fields?.map(field => {
                    const fieldRef = useRef<IFieldApi>();
                    fieldRefs[i++] = fieldRef;
                    return React.createElement(fields[field.type], { ...field, key: field.name, ref: fieldRef })
                })
            }
        </Col>
    );
});
const AutoCell = forwardRef<any, IAutoCell>((props: IAutoCell, ref) => {
    const [fieldRefs] = useState<any[]>([props?.fields?.length || 0]);
    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, () => {
        const api: IFormCellApi = {
            disableField(name: string) {
                if (props && props?.fields)
                    for (let i = 0; i < props?.fields?.length; i++)
                        if (props?.fields[i].name === name && fieldRefs && fieldRefs.length > i) {
                            const api: React.MutableRefObject<IFieldApi> = fieldRefs[i];
                            if (api?.current?.disable)
                                api?.current?.disable();
                        }
            },
            enableField(name: string) {
                if (props && props?.fields)
                    for (let i = 0; i < props?.fields?.length; i++)
                        if (props?.fields[i].name === name && fieldRefs && fieldRefs.length > i) {
                            const api: React.MutableRefObject<IFieldApi> = fieldRefs[i];
                            if (api?.current?.enable)
                                api?.current?.enable();
                        }
            },
        }
        return api;
    });

    let i = 0;
    return (
        <Col flex="auto">
            <Space size="middle" direction="horizontal">
                {
                    props.fields?.map(field => {
                        const fieldRef = useRef<IFieldApi>();
                        fieldRefs[i++] = fieldRef;
                        return React.createElement(fields[field.type], { ...field, key: field.name, ref: fieldRef })
                    })
                }
            </Space>
        </Col>
    );
});
const ThreeFieldsCell = forwardRef<any, IThreeFieldsCell>((props: IThreeFieldsCell, ref) => {
    const selfRef = useRef();
    useImperativeHandle(ref ?? selfRef, () => {
        const api: IFormCellApi = {
            disableField(name: string) {
                if (props?.leftField?.name === name && leftFieldRef?.current?.disable)
                    leftFieldRef?.current?.disable();
                if (props?.rightField?.name === name && rightFieldRef?.current?.disable)
                    rightFieldRef?.current?.disable();
            },
            enableField(name: string) {
                if (props?.leftField?.name === name && leftFieldRef?.current?.enable)
                    leftFieldRef?.current?.enable();
                if (props?.rightField?.name === name && rightFieldRef?.current?.enable)
                    rightFieldRef?.current?.enable();
            }
        }
        return api;
    });
    const leftFieldRef = useRef<IFieldApi>();
    const rightFieldRef = useRef<IFieldApi>();

    return (
        <Col xs={props.width} md={props.width} >
            <Row align="middle" style={{ flexWrap: "nowrap" }}>
                <Col flex="auto">
                    {
                        props?.leftField &&
                        React.createElement(fields[props?.leftField?.type], { ...props?.leftField, ref: leftFieldRef })
                    }
                </Col>
                <Col flex="0 0 auto" style={{ padding: "0 5px 5px", alignSelf: "flex-end" }}><span>{props?.middleText}</span></Col>
                <Col flex="auto">
                    {
                        props?.rightField &&
                        React.createElement(fields[props?.rightField?.type], { ...props?.rightField, ref: rightFieldRef })
                    }
                </Col>
            </Row>
        </Col>
    );
});

export default FormCell;

import React, { FunctionComponent } from "react";
import { Col, Row, Space } from "@eos/rc-controls";
import IField from "../Fields/IField";
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
const FormCell: FunctionComponent<IFormCell | IWidthCell | IAutoCell | IThreeFieldsCell> = (props: IFormCell | IWidthCell | IAutoCell | IThreeFieldsCell) => {
    switch (props.type) {
        case CellType.autoCell:
            return (
                <AutoCell {...props} />
            );
        case CellType.threeFields:
            return (
                <ThreeFieldsCell {...props} />
            );
        case CellType.widthCell:
        default:
            return (
                <WidthCell {...props} />
            );

    }
};


const WidthCell: FunctionComponent<IWidthCell> = (props: IWidthCell) => {
    return (
        <Col xs={props.width} md={props.width}>
            {
                props.fields?.map(field => {
                    return React.createElement(fields[field.type], { ...field, key: field.name })
                })
            }
        </Col>
    );
}
const AutoCell: FunctionComponent<IAutoCell> = (props: IAutoCell) => {
    return (
        <Col flex="auto">
            <Space size="middle" direction="horizontal">
                {
                    props.fields?.map(field => {
                        return React.createElement(fields[field.type], { ...field, key: field.name })
                    })
                }
            </Space>
        </Col>
    );
}
const ThreeFieldsCell: FunctionComponent<IThreeFieldsCell> = (props: IThreeFieldsCell) => {
    return (
        <Col xs={props.width} md={props.width} >
            <Row align="middle" style={{ flexWrap: "nowrap" }}>
                <Col flex="auto">
                    {
                        props?.leftField &&
                        React.createElement(fields[props?.leftField?.type], { ...props?.leftField })
                    }
                </Col>
                <Col flex="0 0 auto" style={{ padding: "0 5px 5px", alignSelf: "flex-end" }}><span>{props?.middleText}</span></Col>
                <Col flex="auto">
                    {
                        props?.rightField &&
                        React.createElement(fields[props?.rightField?.type], { ...props?.rightField })
                    }
                </Col>
            </Row>
        </Col>
    );
}

export default FormCell;

import React, { useState, useRef, ReactNode } from 'react';
import { Select as RcSelect, Spin, Button, DirectoryBookIcon } from "@eos/rc-controls";

/** Структура и описание пропсов AjaxSelect */
export interface IInlineSelect {
    /** Объект для осуществления запроса */
    dataService?: IDataService;

    /** Текст при отсутсвии элементов */
    notFoundContent?: string;

    /** ручной ввод */
    manualInputAllowed?: boolean;

    /** инфо текст */
    resultInfoText?: string;

    /** отображение инфо текста */
    showResultInfoText?: boolean;

    /**вызовется при выборе элемента списка */
    onValueSelected(item?: any): void;
    
    /** Событие при клике на кнопку */
    onButtonClick?(): void
    
    /**html атрибут placeholder. */
    placeholder?: string;
}

/** Структура элемента выпадающего списка */
export interface IOptionItem {
    /** Программное значение которое вернёт компонент. */
    key?: string;

    /** Отображаемый текст значения для пользователя. */
    value?: string;

    /** Параметр запрета на выбор значения */
    disabled?: boolean;

    /** Значения других полей */
    other?: IOtherValue[];

    /** Подскраска поля (необходима для выделения структурного признака синим цветом) */
    isSpecific?: boolean;
}

/** Структура других полей */
export interface IOtherValue {
    /**Наименование поля. */
    name: string;
    /**Отображаемый текст значения для пользователя. */
    value?: string;
}

/** Управление запросом */
export interface IDataService {
    /** Функция useLazyQuery для отправки и обработки запроса */
    loadDataAsync(search?: string): Promise<IOptionItem[]>;

    /** Количество запрашивамых результатов */
    resultsAmount?: number;
}

/** Поле с выпадающим списком, реагирует на изменения в поле последующим запросом на совпадения по подстроке */
export const InlineSelect = React.forwardRef<any, IInlineSelect>(({
    notFoundContent,
    dataService: getDataService,
    manualInputAllowed,
    showResultInfoText,
    resultInfoText,
    onValueSelected,
    onButtonClick,    
    placeholder
}) => {
    /** Объект индикатор загрузки */
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /** Индикатор открытия списка */
    const [isOpen, setIsOpen] = useState<boolean>(false);

    /** Цвет особого элемента списка */
    const SPECIFIC_ELEM_COLOR_VALUE: string = "#2196F3";
    /** Цвет задизейбленного элемента списка */
    const DISABLED_ELEM_COLOR_VALUE: string = "#BABABA";
    /** Ключ для информационного элемента списка (количество элементов) */
    const INFO_ELEM_KEY_VALUE: string | number = "queryAmountInfo";
    /** Текстовое значение информационного элемента списка */
    const INFO_ELEM_TEXT_VALUE: string = getInfoText();

    /** Значение типа курсора при наведении на информационный жлемент списка */
    const INFO_ELEM_CURSOR_VALUE: string = "default";

    /** Время задержки отправки поискового запроса при изменении значения поля */
    const DEFAULT_SEARCH_DELAY_MS_VALUE: number = 200;

    /** Элементы выпадающего списка */
    const [items, setItems] = useState<IOptionItem[]>([]);

    /** Индикатора показа инфотекста */
    const [showInfo, setShowInfo] = useState<boolean>();

    /** Реф для установки фокуса */
    const focusRef = useRef<any>();

    /** Идникатор количества элементов (при кол-во эл-тов = 1 - сделать его активным для выбора) */
    const [isSingleElem, setIsSingleElem] = useState<boolean>();

    /** Запрос
     * @search параметры запроса
     */
    async function loadItemById(search?: string) {
        setIsLoading(true);
        return getDataService?.loadDataAsync(search ?? '').then(
            (data: IOptionItem[]) => {
                let items: IOptionItem[] = data;
                if (getDataService?.resultsAmount !== null && getDataService?.resultsAmount !== undefined) {
                    if (items?.length >= getDataService?.resultsAmount) {
                        let shortArray = items?.slice(0, getDataService?.resultsAmount - 1);
                        if (showResultInfoText === true || showResultInfoText === undefined) {
                            setShowInfo(true);
                        }
                        setIsSingleElem([...shortArray].length === 1);
                        setItems([...shortArray]);
                    } 
                    else {
                        setShowInfo(false)
                        setIsSingleElem(items.length === 1);
                        setItems(items);
                    }
                }
                else {
                    if (showResultInfoText === true || showResultInfoText === undefined) {
                        setShowInfo(true);
                    }      
                    setIsSingleElem(items.length === 1);       
                    setItems(items);
                }
                setIsLoading(false);
            }
        )
            .catch(
                (err: any) => {
                    console.error(err);
                    setItems([]);
                    setIsLoading(false)
                }
            )
    }

    /** Очистка значения формы */
    let onClear = () => {
        loadItemById("");
    }

    /** Отправка запроса на показ дополнительных вариантов введенного значения при фокусе на поле */
    let onFocus = () => {
        // отправить запрос со значением на поиск
        loadItemById("");
        setIsOpen(true)
    }

    /** Обработчик ввода в поле
     * @param value строкове значение, передаваемое в запрос на поиск
     */
    let handleSearch = (value?: string) => {
        // Получить сделать запрос на получение данных по обрезанной строке
        value = value?.trim() ?? '';
        loadItemById(value);
    }

    /** Проставка выбранного значения в поле
     * @param value строковое значение для проставки в поле
     * @param option объект {key, value, label(аналогичен value)}
     */
    let onSelect = (value: any, option: any) => {
        if (value) {
            loadItemById(value?.trim() ?? ''); 
        }
        if (onValueSelected) {
            onValueSelected(option?.item);
        }
        setIsOpen(false)
        if (focusRef?.current && focusRef?.current?.blur) {
            focusRef?.current?.blur();
        }
        handleSetFocus();
    }

    let handleSetFocus = () => {
        if (focusRef?.current && focusRef?.current?.focus) {
            focusRef?.current?.focus();
        }
        onFocus();
    }

    /** событие по потере фокуса */
    let onBlur = () => {
        setIsOpen(false);
    }

    return (
        <Spin spinning={isLoading}>
            <div style={{display: "flex"}}>
                <RcSelect ref={focusRef}
                    placeholder={placeholder}
                    showSearch={manualInputAllowed !== undefined && manualInputAllowed !== null ? manualInputAllowed : true }
                    value={''}
                    notFoundContent={notFoundContent}
                    onSearch={handleSearch}
                    onFocus={onFocus}
                    onClear={onClear}
                    onSelect={onSelect}
                    delay={DEFAULT_SEARCH_DELAY_MS_VALUE}
                    open={isOpen}
                    onBlur={onBlur}
                    allowClear={true}
                    filterOption={false}
                    defaultActiveFirstOption={isSingleElem}
                >
                    {getOptionList()}
                </RcSelect>
                {onButtonClick && <Button onClick={onButtonClick}>
                    <DirectoryBookIcon />
                </Button>}
            </div>
        </Spin>
    );

    // Получить список элементов для отрисовки
    function getOptionList(): ReactNode | ReactNode[] {
        if (showInfo) {
            return [<RcSelect.Option key={INFO_ELEM_KEY_VALUE} value={INFO_ELEM_KEY_VALUE} disabled style={{cursor: INFO_ELEM_CURSOR_VALUE}}>{INFO_ELEM_TEXT_VALUE}</RcSelect.Option>,
                ...items.map((item: IOptionItem) => {
                    return <RcSelect.Option 
                                key={`${item?.key}`} 
                                value={item?.value ?? `${item?.key}`}
                                disabled={item?.disabled}
                                item={item}
                                style={item?.disabled ? {color: DISABLED_ELEM_COLOR_VALUE} : item?.isSpecific ? {color: SPECIFIC_ELEM_COLOR_VALUE} : {}}
                                >
                                    {item?.value ?? `${item?.key}`}
                            </RcSelect.Option>
            })]
        } 
        else {
            return items.map((item: IOptionItem) => {
                return <RcSelect.Option 
                            key={`${item?.key}`} 
                            value={item?.value ?? `${item?.key}`}
                            disabled={item?.disabled}
                            item={item}
                            style={item?.disabled ? {color: DISABLED_ELEM_COLOR_VALUE} : item?.isSpecific ? {color: SPECIFIC_ELEM_COLOR_VALUE} : {}}
                            >
                                {item?.value ?? `${item?.key}`}
                        </RcSelect.Option>
            })
        }
    }

    /** получить информационный текст */
    function getInfoText(): string {
        if (resultInfoText) {
            // переданный текст
            return resultInfoText;
        }
        else {
            // предустановленный текст
            if (getDataService?.resultsAmount !== null && getDataService?.resultsAmount !== undefined) {
                return `Отображены первые ${getDataService?.resultsAmount - 1} элементов`;
            }
            else {
                return `Отображены все результаты`;
            }
        }
    }
});
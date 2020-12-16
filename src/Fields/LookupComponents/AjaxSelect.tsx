import React, { useEffect, useState, useRef } from 'react';
import { Select as RcSelect, Spin } from "@eos/rc-controls";

/** Структура и описание пропсов AjaxSelect */
export interface ISelect {
    /** Объект для осуществления запроса */
    dataService?: IDataService;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    /** Имя поля */
    fieldName?: string;

    /** Объект значения поля*/
    value?: IOptionItem;

    /** Текст при отсутсвии элементов */
    notFoundContent?: string;

    /** Обзяательность заполнения поля */
    required?: boolean;

    /** конекст */
    ctx?: any;

    /** ручной ввод */
    manualInputAllowed?: boolean;
}

/**
 * Структура элемента выпадающего списка
 */
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

export interface IOtherValue {
    /**Наименование поля. */
    name: string;
    /**Отображаемый текст значения для пользователя. */
    value?: string;
}

export interface IDataService {
    /** Функция useLazyQuery для отправки и обработки запроса */
    loadDataAsync(search?: string): Promise<IOptionItem[]>;

    /** Количество запрашивамых результатов */
    resultsAmount: number;
}

/** Поле с выпадающим списком, реагирует на изменения в поле последующим запросом на совпадения по подстроке */
export const Select = React.forwardRef<any, ISelect>(({
    onChange,
    fieldName,
    value,
    notFoundContent,
    required,
    dataService: getDataService,
    ctx,
    manualInputAllowed
}) => {
    /** Объект значения */
    const [currentValue, setCurrentValue] = useState<IOptionItem | undefined>(value);
    useEffect(() => {
        setCurrentValue(value);
    }, [value])
    /** Объект индикатор загрузки */
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /** Индикатор открытия списка */
    const [isOpen, setIsOpen] = useState<boolean>(false);

    /** Цвет особого элемента списка */
    const SPECIFIC_ELEM_COROL_VALUE: string = "#2196F3";
    /** Цвет задизейбленного элемента списка */
    const DISABLED_ELEM_COROL_VALUE: string = "#BABABA";
    /** Ключ для информационного элемента списка (количество элементов) */
    const INFO_ELEM_KEY_VALUE: string | number = "queryAmountInfo";
    /** Значение типа курсора при наведении на информационный жлемент списка */
    const INFO_ELEM_CURSOR_VALUE: string = "default";

    /** Сообщение об отображаемом количестве элементов в выпадающем списке */
    const [queryAmountInfo, setQueryAmountInfo] = useState<string>("");

    /** Время задержки отправки поискового запроса при изменении значения поля */
    const DEFAULT_SEARCH_DELAY_MS_VALUE: number = 200;

    /** Элементы выпадающего списка */
    const [items, setItems] = useState<IOptionItem[]>([]);

    const focusRef = useRef<any>();

    /** Запрос
     * @search search параметры запроса
     */
    async function loadItemById(search?: string) {
        setIsLoading(true);
        return getDataService?.loadDataAsync(search).then(
            (data: IOptionItem[]) => {
                let items: IOptionItem[] = data;
                switch (true) {
                    case (items.length >= getDataService.resultsAmount):
                        // При количестве результатов 11 и более отображается надпись "Отображены первые 10 результатов"
                        let shortArray = items.slice(0, getDataService.resultsAmount - 1);
                        // Использование useTranslate
                        // const QUERY_AMOUNT_INFO_TEXT: string = optionsAmountInfo.t(optionsAmountInfo.namespace, { amount: getDataService.resultsAmount - 1 });
                        const QUERY_AMOUNT_INFO_TEXT: string = `Отображены первые ${getDataService.resultsAmount - 1} результатов`;
                        // Добавляет в выпадающий список надпись "Отображены первые 10 результатов"
                        setQueryAmountInfo(QUERY_AMOUNT_INFO_TEXT);
                        setItems([...shortArray]);
                        break;
                    case (items.length && items.length <= getDataService.resultsAmount - 1):
                        // Убирает надпись "Отображены первые 10 результатов" при количестве элементов списка 10 и менее
                        setQueryAmountInfo("");
                        setItems(items);
                        break;
                    default:
                        setQueryAmountInfo("");
                        setItems([]);
                        break;
                }
                setIsLoading(false);
            }
        )
            .catch(
                (err: any) => {
                    console.error(err);
                    setQueryAmountInfo("");
                    setItems([]);
                    setIsLoading(false)
                }
            )
    }

    /** Очистка значения формы */
    let onClear = () => {
        setCurrentValue(undefined);
        setValueToForm(undefined);
        if (onChange)
            onChange(null);
        loadItemById("");
    }

    /** Отправка запроса на показ дополнительных вариантов введенного значения при фокусе на поле */
    let onFocus = () => {
        // Если поле со значением, то отправить запрос со значением на поиск
        if (currentValue?.value) {
            loadItemById(currentValue?.value?.trim());
        } else {
            // Если без - пустую строку на показ всех доступных значений
            loadItemById("");
        }
        setIsOpen(true)
    }

    /** Обработчик ввода в поле
     * @param value строкове значение, передаваемое в запрос на поиск
     */
    let handleSearch = (value: string) => {
        // Получить сделать запрос на получение данных по обрезанной строке
        loadItemById(value.trim());

        // Приведение value полученных объектов к UpperCase для дальнейшего сравнения
        let options: any = items?.map(item => item.value?.toLocaleUpperCase());

        // Если есть options совпадающий с введенной строкой и они не равны пустой строке, то сделать значение выбранным, 
        // если нет - остается предыдущее введенное значение либо значение
        if (options?.indexOf(value?.toLocaleUpperCase().trim()) > -1 && value.trim() !== "") {

            // Проставить объект IOptionItem в отображение
            setCurrentValue({ value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key });

            // Проставить объект IOptionItem в форму
            setValueToForm({ value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key });
            // onSelectComponentChange(value, { value: value, label: value, item: { value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key } });
        }
    }

    /** Проставка выбранного значения в поле
     * @param value строковое значение для проставки в поле
     * @param option объект {key, value, label(аналогичен value)}
     */
    let onSelect = (value: any, option: any) => {
        setCurrentValue(option?.item);
        setValueToForm(option?.item);
        if (value) {
            loadItemById(value?.trim()); 
        }
        if (onChange) {
            onChange(option?.item);
        }
        if (!value) {}
        setIsOpen(false)
        if (focusRef?.current && focusRef?.current?.blur)
        focusRef?.current?.blur()
    }

    let onBlur = () => {
        setIsOpen(false);
    }

    return (
        <Spin spinning={isLoading}>
            <RcSelect ref={focusRef}
                required={required}
                showSearch={manualInputAllowed !== undefined && manualInputAllowed !== null ? manualInputAllowed : true }
                value={currentValue?.value}
                notFoundContent={notFoundContent}
                onSearch={handleSearch}
                onFocus={onFocus}
                onClear={onClear}
                onSelect={onSelect}
                delay={DEFAULT_SEARCH_DELAY_MS_VALUE}
                open={isOpen}
                onBlur={onBlur}
                allowClear={true}>
                    {
                        queryAmountInfo === ""
                        ? items.map((item: IOptionItem) => {
                            return <RcSelect.Option 
                                        key={`${item?.key}`} 
                                        value={item?.value ?? `${item?.key}`}
                                        disabled={item?.disabled}
                                        item={item}
                                        style={item?.isSpecific ? {color: SPECIFIC_ELEM_COROL_VALUE} : item?.disabled ? {color: DISABLED_ELEM_COROL_VALUE} : {}}
                                        >
                                            {item?.value ?? `${item?.key}`}
                                    </RcSelect.Option>
                        })

                        :   [<RcSelect.Option key={INFO_ELEM_KEY_VALUE} value={INFO_ELEM_KEY_VALUE} disabled style={{cursor: INFO_ELEM_CURSOR_VALUE}}>{queryAmountInfo}</RcSelect.Option>,
                            ...items?.map((item: IOptionItem) => {
                                return <RcSelect.Option 
                                            key={`${item?.key}`} 
                                            value={item?.value ?? `${item?.key}`}
                                            disabled={item?.disabled}
                                            item={item}
                                            style={item?.isSpecific ? {color: SPECIFIC_ELEM_COROL_VALUE} : item?.disabled ? {color: DISABLED_ELEM_COROL_VALUE} : {}}
                                            >
                                                {item?.value ?? `${item?.key}`}
                                        </RcSelect.Option>
                            })]
                        
                    }
            </RcSelect >
        </Spin>
    );

    /**
     * Проставляет значение в форму.
     * @param value Значение для простановки в форму.
     */
    function setValueToForm(value?: IOptionItem): boolean {
        if (ctx) {
            ctx.setFieldValue(fieldName, value);
            return true;
        }
        return false;
    }
});
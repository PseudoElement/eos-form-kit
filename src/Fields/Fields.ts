
import { DateTime as FieldDateTime } from './FieldDateTime';
import { Integer as FieldInteger } from './FieldInteger';
import { MultiText as FieldMultiText } from './FieldMultiText';
import { Select as FieldSelect } from './FieldSelect';
import { Text as FieldText } from './FieldText';
import { Lookup as FieldLookup } from './FieldLookup';
import { Checkbox as FieldCheckbox } from './FieldCheckbox';

/**Типы доступных полей. */
const fields = {
    FieldDateTime,
    FieldInteger,
    FieldMultiText,
    FieldSelect,
    FieldText,
    FieldLookup,
    FieldCheckbox
}

export default fields;
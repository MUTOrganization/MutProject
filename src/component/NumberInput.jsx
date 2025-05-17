import { Input } from "@heroui/react";
import { useMemo } from "react";
import { cFormatter } from "@/utils/numberFormatter";

export default function NumberInput({
    className = '', 
    style = {}, 
    value, 
    onChange, 
    placeholder = '', 
    isDisabled = false, 
    isInValid, errorMessage, 
    maxValue = 9999999999999, maxDecimal = 2
}) {
    const _value = useMemo(() => {
        const [whole, decimal] = value.split('.');
        
        const str = decimal !== undefined ? `${cFormatter(whole)}.${decimal}` : cFormatter(whole)
        return str;
    })

    function handleInput(e) {
        /** @type {String} */
        let inputValue = e.target.value;
        if(maxDecimal <= 0){
            inputValue = inputValue.replace('.', '')
        }
        inputValue = inputValue.replace(/,/g, '');
        if(Number(inputValue) > maxValue) inputValue = String(maxValue);
        const [whole, decimal] = inputValue.split('.');
        const de = decimal !== undefined ? `.${decimal.slice(0,maxDecimal)}` : '';
        inputValue = whole + de;
        const decimalRegex = /^\d*\.?\d*$/;
        if (decimalRegex.test(inputValue)) {
            if (isNaN(parseFloat(inputValue))) {
                onChange('0')
                return;
            }
            if (inputValue.length > 1 && inputValue[0] === "0" && !inputValue.startsWith("0.")) {
                onChange(inputValue.slice(1));
            } else {
                onChange(inputValue);
            }
        }
    };

    return (
        <Input 
            value={_value}
            onChange={handleInput}
            style={style}
            variant="bordered"
            type="text"
            className={className}
            placeholder={placeholder}
            isDisabled={isDisabled}
            isInvalid={isInValid}
            errorMessage={errorMessage}
            inputMode="decimal"
        />
    )
}
import { InputBaseComponentProps } from '@mui/material';
import React from 'react';
import { IMaskInput } from 'react-imask';

interface TextMaskCustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, TextMaskCustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <IMaskInput
                {...other}
                mask="+7 (#00) 000 00-00"
                definitions={{
                    '#': /[1-9]/,
                }}
                inputRef={ref}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    },
);

export default TextMaskCustom as any;

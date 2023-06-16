import React, {useState} from 'react';

const EditableText = (props) => {
    const [value, setValue] = useState(props.value || '');
    const [edit, setEdit] = useState(false);
    const [backup, setBackup] = useState('');

    const editHandler = () => {
        setEdit(!edit);
    };

    const focusHandler = (event) => {
        const value = event.target.value;
        event.target.value = '';
        event.target.value = value;
        setBackup(value);
    };

    const changeHandler = (event) => {
        setValue(event.target.value);
        props.onChange(event.target.value); // Invoke the onChange prop with the new value
    };

    const blurHandler = () => {
        setEdit(false);
    };

    const keyUpHandler = (event) => {
        if (event.key === 'Escape') {
            setEdit(false);
            setValue(backup);
        }
        if (event.key === 'Enter') {
            setEdit(false);
        }
    };

    return (
        edit === true ? (
            <input
                name={props.name}
                type={props.type || 'text'}
                value={value}
                className={props.editClassName}
                autoFocus
                onFocus={focusHandler}
                onChange={changeHandler}
                onBlur={blurHandler}
                onKeyUp={keyUpHandler}
            />
        ) : (
            <span onClick={editHandler}>
        {value}
      </span>
        )
    );
};

export default EditableText;

'use strict'

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
    inputContainer: {
        display: 'flex',
        width: '100%',
        height: '10rem',
        backgroundColor: '#000',
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    topicContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    topicInput: {
        border: '2px solid #ffffff',
        borderRadius: '10px',
        padding: '1rem',
        boxSizing: 'border-box',
        height: '4rem',
        width: '100%',
        backgroundColor: '#000',
        color: '#fff',
        '::-webkit-input-placeholder': {
            color: '#fff'
        }
    },
    topicInputClicked: {
        border: '2px solid #fff',
        borderRadius: '10px',
        padding: '1rem',
        boxSizing: 'border-box',
        height: '6rem',
        width: '100%',
        backgroundColor: '#000',
        color: '#fff',
        '::-webkit-input-placeholder': {
            color: '#fff'
        }
    },
    topicInputText: {
        width: '100%',
        height: '100%',
        background: 'transparent',
        color: '#fff',
        border: 'none',
        outline: 'none',
        fontSize: '1.25rem',
        lineHeight: '1.25rem',
    },
    topicInputTitle: {
        textAlign: 'left',
        lineHeight: '16px',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
    },
    topicFilled: {
        textAlign: 'left',
        fontSize: '18px',
        lineHeight: '21.09px',
        fontFamily: 'sans-serif',
        border: '2px solid #fff',
        borderRadius: '10px',
        padding: '1rem',
    },
    textCount: {
        textAlign: 'right',
        margin: '6px 0px',
    },
})


export function InputElement() {
    const classes = useStyles();
    const [ inputClicked, changeInput ] = useState(false);
    const [ showFill, setShowFill ] = useState(false);
    const [ formData, setFormData ] = useState({title: ""});

    const handleChange = e => {
        const {name, value} = e.target
        setFormData(data => ({
            ...data,
            [name]: value
        }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        changeInput(false)
        setShowFill(true)
    }

    if (inputClicked) {
        return (
            <div className={classes.inputContainer}>
                <div className={classes.topicContainer}>
                <form className={classes.topicInputClicked} onSubmit={handleSubmit} onBlur={handleSubmit}>
                    <div className={classes.topicInputTitle}>TOPIC 1</div>
                    <input maxLength="50" autoFocus name="title" value={formData.title} onChange={handleChange} className={classes['topicInputText']} />
                    <div className={classes.textCount}>{formData.title.length}/50</div>
                </form>
                </div>
            </div>
        )
    } else if (showFill) {
        return (
           <div className={classes.inputContainer}>
                <div className={classes.topicContainer}>
                    <div className={classes.topicFilled}>{formData.title}</div>
                </div>
            </div>
        )
    } else {
        return (
           <div className={classes.inputContainer}>
                <div className={classes.topicContainer}>
                    <div className={classes.topicInput}>
                        <input type='text' className={classes.topicInputText} placeholder={`TOPIC 1`} onClick={() => changeInput(true)} />
                    </div>
                </div>
            </div>
        )
    }
}

export default InputElement
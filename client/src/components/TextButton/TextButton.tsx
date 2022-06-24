import React, { MouseEventHandler } from 'react';
import "./TextButton.css"

function TextButton({text, onClick}: {text: string; onClick: MouseEventHandler<HTMLButtonElement>})  {
    return (
        <div>
            <button onClick={onClick}>{text}</button>
        </div>
    );
};

export default TextButton;
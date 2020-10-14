import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const TextTooltip = ({ text, placement, children }) => {
    const renderTooltip = props =>
        text.length ? <Tooltip {...props}>{text}</Tooltip> : <div></div>

    return (
        <OverlayTrigger
            placement={placement !== undefined ? placement : 'right'}
            delay={{ show: 250, hide: 0 }}
            overlay={renderTooltip}
        >
            {children}
        </OverlayTrigger>
    )
}

export default TextTooltip

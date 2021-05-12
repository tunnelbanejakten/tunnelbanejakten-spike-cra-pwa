import React, {useMemo} from 'react'
import './index.css'

export const Status = {
    PENDING: 'pending',
    FAILURE: 'failure',
    SUCCESS: 'success',
    USER_INTERACTION_REQUIRED: 'user_interaction_required'
}

const getStatusIcon = (status) => {
    switch (status) {
        case Status.PENDING:
            return '⏳'
        case Status.FAILURE:
            return '💥'
        case Status.SUCCESS:
            return '✅'
        case Status.USER_INTERACTION_REQUIRED:
            return '👋'
    }
}

const PrerequisiteStatus = ({icon, label, status, onButtonClick, buttonLabel}) => {
    return (
        <div className="prerequisite-status">
            <div>{icon}</div>
            <div>{label}</div>
            {buttonLabel && <button onClick={onButtonClick}>{buttonLabel}️</button>}
            <div>{getStatusIcon(status)}</div>
        </div>
    )
}

export default PrerequisiteStatus

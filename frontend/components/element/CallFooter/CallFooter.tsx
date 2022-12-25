import React, { FC } from 'react';
import IconButton from '../../ui/IconButton';

import styles from './CallFooter.module.scss';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';

type CallFooterProps = {
    toggleCamer: () => void;
    toggleMicro: () => void;
    leaveCall: () => void;
    offMicro: boolean;
    offVideo: boolean;
};

const CallFooter: FC<CallFooterProps> = ({
    toggleCamer,
    toggleMicro,
    leaveCall,
    offMicro,
    offVideo,
}) => {
    return (
        <div className={styles.CallFooter}>
            <IconButton variant="contained" onClick={toggleMicro}>
                {offMicro ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
            <IconButton variant="contained" onClick={toggleCamer}>
                {offVideo ? <VideocamOffIcon /> : <VideocamIcon />}
            </IconButton>
            <IconButton variant="contained" color="error" onClick={leaveCall}>
                <CallEndIcon />
            </IconButton>
        </div>
    );
};

export default CallFooter;

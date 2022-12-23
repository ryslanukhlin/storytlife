export const checkMediaDevices = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (stream.getAudioTracks().length >= 0 && stream.getVideoTracks().length >= 0) return true;
        else false;
    } catch {
        return false;
    }
};

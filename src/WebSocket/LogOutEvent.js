import wsRef  from './wsRef';

export function handleClose() {
    if (typeof handleClose === 'function') {
        if (wsRef.current) {
            wsRef.current.close();
        }
    }
}

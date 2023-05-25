import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message, type) => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'warning':
            toast.warning(message);
            break;
        default:
            toast(message);
    }
};

export const ToastContainerComponent = () => {
    return <ToastContainer/>;
};

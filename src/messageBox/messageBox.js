import { toast,Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const MessageBox = (messageContent, type) => {

    if (type === 'Success') {
        toast.success(messageContent, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            transition: Zoom
        });
    }

    else if (type === 'Error') {
        toast.error(messageContent, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            transition: Zoom
        });
    }
};
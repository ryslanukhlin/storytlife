import { useEffect, useState } from 'react';

const useWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const resizeWidth = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', resizeWidth);

        resizeWidth();

        return () => {
            window.removeEventListener('resize', resizeWidth);
        };
    }, []);

    return width;
};

export default useWidth;

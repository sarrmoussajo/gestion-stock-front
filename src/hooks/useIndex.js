import { useState } from 'react';
import { useEffect } from 'react';
import API from 'utils/api';

const useIndex = (url) => {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState(['']);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        try {
            async function getData() {
                const response = await API.get(url);
                // console.log(response);
                const { data, status } = response.data;
                setData(data);
                setStatus(status);
            }
            getData();
        } catch (error) {
            console.log(error);
        }
    }, [url]);
    return { data, status };
};
export default useIndex;

import { useEffect } from 'react';
import { useRef } from 'react';

// ==============================|| ELEMENT REFERENCE HOOKS  ||============================== //

const useScriptRef = () => {
    const scripted = useRef(true);

    useEffect(
        () => () => {
            scripted.current = false;
        },
        []
    );

    return scripted;
};

export default useScriptRef;

import { useEffect, useState } from 'react';
interface SpinNameProps {
    listData?: string[];
    valueSelected?: string;
    playing?: boolean;
    placeholder?: string;
}
const SpinName = (props: SpinNameProps) => {
    const { listData, valueSelected, playing, } = props;

    const [currentNameIndex, setCurrentNameIndex] = useState(0);
    const [displayedName, setDisplayedName] = useState<string | null>(null);

    useEffect(() => {
        if (!listData || listData.length === 0) {
            setDisplayedName(null);
            return;
        }

        let intervalId: NodeJS.Timeout;

        if (currentNameIndex < listData.length && !valueSelected && playing) {
            setTimeout(() => { })
            intervalId = setInterval(() => {
                setDisplayedName(listData[currentNameIndex]);
                setCurrentNameIndex((prevIndex) => prevIndex === (listData?.length - 1) ? prevIndex = 0 : prevIndex += 1);
            }, 100);
        }

        return () => clearInterval(intervalId); // Clear interval on unmount or dependency change
    }, [listData, currentNameIndex, valueSelected, playing]); // Add names and currentNameIndex as dependencies




    return (
        <div className='spin-name__container'>
            {valueSelected ? valueSelected : displayedName}
        </div>
    );
};

export default SpinName;
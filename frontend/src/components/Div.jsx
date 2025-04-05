import React, { useRef, useState } from 'react';
import Loading from './Loading';

const Div = ({ headingText, text, img }) => {
    const imgRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleLoad = () => {
        setIsLoaded(imgRef.current.complete);
    }

    return (
        <div className='flex items-center flex-wrap justify-around mb-20 even:flex-row-reverse'>
            {!isLoaded && <Loading />}
            {img && (
                <img 
                    onLoad={handleLoad} 
                    ref={imgRef} 
                    loading='lazy' 
                    className={`${isLoaded ? "sm:w-[300px] w-72" : "w-0"} rounded-md`} 
                    src={img} 
                    alt="feature" 
                />
            )}
            <div className='flex flex-col gap-6'>
                <h2 className='font-heading text-2xl text-center sm:text-3xl sm:text-start text-white'>{headingText}</h2>
                <p className='sm:text-lg sm:text-start text-base text-center text-gray-300'>{text}</p>
            </div>
        </div>
    );
}

export default Div; 
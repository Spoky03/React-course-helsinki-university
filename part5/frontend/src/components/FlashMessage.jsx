import { useEffect } from 'react'
export const FlashMessage = ({message, setFlashedMessage}) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            setFlashedMessage(null)
        }, 5000)
        return () => clearTimeout(timer)
    }, [message])
    return (
        <>
        <div className='bg-gray-900 text-white p-2 rounded-md'>
            {message.body}
            {message.type === 'error' && <span className='text-red-500'>❌</span>}
            {message.type === 'success' && <span className='text-green-500'>✅</span>}
        </div>
        </>
    )
}
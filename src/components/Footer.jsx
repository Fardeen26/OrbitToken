import React from 'react'

const Footer = () => {
    return (
        <div className='flex items-center justify-between px-5'>
            <div className="text-xs pt-4">Made by <a href="https://github.com/Fardeen26" className='underline'>Fardeen</a> </div>
            <div className="flex pt-4 text-xs gap-2">
                <a href="https://github.com/Fardeen26/OrbitToken/tree/main" className='underline'>GitHub</a>
                <a href="https://x.com/fardeen14693425" className='underline'>Twitter</a>
                <a href="www.linkedin.com/in/fardeenmansoori" className='underline'>LinkedIn</a>
            </div>
        </div>
    )
}

export default Footer
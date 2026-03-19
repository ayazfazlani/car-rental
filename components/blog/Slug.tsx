import React from 'react'
type SlugProps = {
    text: string
    color?: string
}
export function Slug({ text, color }: SlugProps) {
    return (
        <div className='flex'>
            <div className='py-[6px] px-3 rounded-[6px]' style={{ backgroundColor: color ? color : '#EF466F' }}>
                <p className='text-avg text-white'>{text}</p>
            </div>
        </div>
    )
}

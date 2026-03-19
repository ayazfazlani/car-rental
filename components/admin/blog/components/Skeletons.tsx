import React from 'react'


export function SmallSkeletons() {
    return (
        <div className='flex w-full gap-16 animate-pulse'>
            <div className='h-[250px] w-[300px] bg-darkGrayishBlueAlt5 rounded-xl'>
            </div>
            <div className='flex flex-col gap-2 mt-2 w-full animate-pulse'>
                <div className='flex flex-col gap-3 w-full'>
                    <h2 className='bg-darkGrayishBlueAlt5 rounded-lg w-96 h-10'></h2>
                    <p className='w-52 bg-darkGrayishBlueAlt5 rounded-lg h-4 animate-pulse'></p>
                    <p className=' bg-darkGrayishBlueAlt5 rounded-lg w-80 h-4'></p>
                    <p className=' bg-darkGrayishBlueAlt5 rounded-lg w-80 h-4'></p>
                    <p className=' bg-darkGrayishBlueAlt5 rounded-lg w-80 h-4'></p>
                </div>
            </div>
        </div>
    )
}

export function RenderSkeleton() {
    return (
        <div className='flex flex-wrap items-center justify-center w-full gap-8 px-16 pb-16'>
            <SmallSkeletons />
            <SmallSkeletons />
            <SmallSkeletons />
        </div>
    )
}

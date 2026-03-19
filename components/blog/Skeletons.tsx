import React from 'react'

export function LargeSkeletons() {
    return (
        <div className='flex flex-col md:flex-row w-full animate-pulse'>
            <div className='w-full lg:w-3/5 h-[410px] md:h-[500px] relative lg:flex-1 bg-darkGrayishBlueAlt5 rounded-xl'>
            </div>
            <div className='flex flex-col items-start justify-start w-full lg:w-2/5 mb-5 md:mb-20 lg:mb-[100px] pl-5 lg:pl-[70px]'>
                <div className='mb-1 mt-2 md:mt-0 bg-darkGrayishBlueAlt5 w-52 h-8 rounded-xl'></div>
                <div className='mb-1 mt-2 md:mt-0 bg-darkGrayishBlueAlt5 w-96 h-12 rounded-xl '></div>
                <div className='mb-1 mt-2 md:mt-0 bg-darkGrayishBlueAlt5 w-96 h-12 rounded-xl'></div>
                <div className='mb-1 mt-2 md:mt-0 bg-darkGrayishBlueAlt5 w-72 h-6 rounded-xl'></div>
                <div className='mb-1 mt-2 md:mt-0 bg-darkGrayishBlueAlt5 w-72 h-6 rounded-xl'></div>
                <div className='mb-1 mt-2 md:mt-0 bg-darkGrayishBlueAlt5 w-72 h-6 rounded-xl'></div>
                <div className='mb-1 mt-2 md:mt-0 bg-darkGrayishBlueAlt5 w-72 h-6 rounded-xl'></div>
                <div className='flex mt-8 gap-2'>
                    <div className=' bg-darkGrayishBlueAlt5 rounded-lg w-52 h-8'></div>
                    <div className=' bg-darkGrayishBlueAlt5 rounded-lg w-28 h-8'></div>
                </div>
            </div>
        </div>
    )
}

export function SmallSkeletons() {
    return (
        <div className='flex flex-col w-full md:w-[410px] gap-4 animate-pulse'>
            <div className='h-[410px] w-[410px] bg-darkGrayishBlueAlt5 rounded-xl'>
            </div>
            <div className='flex flex-col gap-2 w-full animate-pulse'>
                <p className='w-52 bg-darkGrayishBlueAlt5 rounded-lg h-4 animate-pulse'></p>
                <div className='flex flex-col gap-3 w-full'>
                    <h2 className='bg-darkGrayishBlueAlt5 rounded-lg w-96 h-10'></h2>
                    <h2 className='bg-darkGrayishBlueAlt5 rounded-lg w-60 h-10'></h2>
                    <p className=' bg-darkGrayishBlueAlt5 rounded-lg w-80 h-4'></p>
                    <p className=' bg-darkGrayishBlueAlt5 rounded-lg w-80 h-4'></p>
                    <p className=' bg-darkGrayishBlueAlt5 rounded-lg w-80 h-4'></p>
                </div>
            </div>
        </div>
    )
}

export function RenderSkeleton({ page }: { page: number }) {
    return (
        <div className='flex flex-wrap items-center justify-center w-full gap-8 px-16 pb-16'>
            {page === 1 &&
                <LargeSkeletons />
            }
            {page !== 1 &&
                <SmallSkeletons />
            }
            <SmallSkeletons />
            <SmallSkeletons />
            <SmallSkeletons />
            <SmallSkeletons />
            <SmallSkeletons />
            <SmallSkeletons />
        </div>
    )
}

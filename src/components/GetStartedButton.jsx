import React from 'react'

export default function GetStartedButton({ContinueWithGOOGLE}) {
    return (
        <div onClick={ContinueWithGOOGLE}
                    className="w-full px-5 md:px-0 md:w-auto max-w-sm  bg-gradient-to-tb  from-blue-900 to-gray-800 flex flex-col rounded-full md:rounded-2xl ">

            <div className="flex w-full md:w-auto gap-2.5 ">
                <a href="#" style={{
                    background: 'linear-gradient(0deg, #48B2FC, #3297FF, #1C7FFF)',
                }}
                   className="flex w-full place-items-center justify-center rounded-full md:rounded-md  py-1.5 px-[1.5rem]  shadow-md bg-[#3083FF]">
  <span className="h-10 ">

  </span>
                    <div className=" ml-2 flex place-items-center  justify-centerflex-col">

                        <button className="text-white PlusJakartaSans-Medium  md:PlusJakartaSans-Bold  leading-4">Let's Get Started</button>
                    </div>
                </a>

            </div>
        </div>
    )
}
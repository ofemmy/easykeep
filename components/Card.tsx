import React from 'react'
import Link from "next/link"
const Card = ({icon,title,bgColor,value,footerHref}) => {
    return (
        <div className={`${bgColor} text-white overflow-hidden shadow rounded-lg relative`}>
          <div className="p-5">
            <div className="flex items-center lg:mt-4">
              <div className="flex-shrink-0">
                {icon}
              </div>
              <div className="ml-1 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium truncate">
                    {title}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium">
                      {value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className=" text-white uppercase border-t-2 border-gray-100 px-5 py-3 lg:absolute bottom-0 left-0 right-0">
            <div className="text-sm">
              <Link href={footerHref}>
              <a
                className="font-medium hover:text-gray-200"
              >
                View all
              </a>
              </Link>
             
            </div>
          </div>
        </div>
    )
}

export default Card

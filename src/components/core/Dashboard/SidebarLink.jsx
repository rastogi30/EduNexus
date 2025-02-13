import React from 'react'
import * as LucideIcons from "lucide-react"
import { useDispatch } from 'react-redux'
import { NavLink, matchPath, useLocation } from 'react-router-dom'

const SidebarLink = ({ link, iconName, onClick }) => {
    const Icon = LucideIcons[iconName] || LucideIcons.Circle
    const location = useLocation()
    const dispatch = useDispatch()

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
    }

    return (
        <NavLink
            to={link.path}
            onClick={onClick}
            className={`group relative flex items-center gap-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg
                ${matchRoute(link.path)
                    ? "bg-yellow-800 text-yellow-50"
                    : "text-richblack-300 hover:bg-richblack-700 hover:text-richblack-50"
                }
            `}
        >
            <span className={`absolute left-0 top-0 h-full w-[3px] bg-yellow-50 rounded-r transition-all duration-200
                ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}
            `}/>
            <Icon className="h-4 w-4" />
            <span className="truncate">{link.name}</span>
        </NavLink>
    )
}

export default SidebarLink
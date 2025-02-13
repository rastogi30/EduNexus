import { useState, useEffect } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnectors"
import { categories } from "../../services/apis"
import ProfileDropDown from "../core/auths/ProfileDropDown"
import { ACCOUNT_TYPE } from "../../utils/constants"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCatalog, setShowCatalog] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  const matchRoute = (route) => {
    if (!route) return false
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
      location.pathname !== "/" ? "bg-richblack-800" : ""
    } transition-all duration-200`}>
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dqclwnyni/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1738871022/1_enhanced_lfj1vn.png"
              alt="Logo"
              width={160}
              height={32}
              loading="lazy"
            />
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <nav className="hidden md:block mx-auto">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className={`group relative flex cursor-pointer items-center gap-1`}>
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : (
                        subLinks?.map((subLink, i) => (
                          <Link
                            to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            key={i}
                          >
                            <p>{subLink.name}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path || "/"}>
                    <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side - Auth Buttons & Cart */}
        <div className="hidden md:flex items-center gap-x-4">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null ? (
            <div className="flex gap-x-4">
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:text-white">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:text-white">
                  Sign up
                </button>
              </Link>
            </div>
          ) : (
            <ProfileDropDown />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[1000] md:hidden">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-[250px] bg-richblack-900 p-4">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-6">
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <img
                      src="https://res.cloudinary.com/dqclwnyni/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1738871022/1_enhanced_lfj1vn.png"
                      alt="Logo"
                      className="h-8"
                    />
                  </Link>
                  <button onClick={() => setIsMenuOpen(false)} className="text-richblack-100">
                    ✕
                  </button>
                </div>

                {/* Mobile Menu Navigation Links */}
                <nav className="mb-6">
                  <ul className="space-y-4">
                    {NavbarLinks.map((link, index) => (
                      <li key={index}>
                        {link.title === "Catalog" ? (
                          <div className="px-4 py-2">
                            <div 
                              className="flex items-center justify-between text-richblack-100 cursor-pointer"
                              onClick={() => setShowCatalog(!showCatalog)}
                            >
                              <span>Catalog</span>
                              <BsChevronDown className={`transition-transform duration-200 ${
                                showCatalog ? "rotate-180" : ""
                              }`} />
                            </div>
                            
                            {/* Catalog Dropdown for Mobile */}
                            {showCatalog && (
                              <div className="mt-2 ml-4 space-y-2">
                                {loading ? (
                                  <div className="text-richblack-100">Loading...</div>
                                ) : (
                                  subLinks?.map((subLink, i) => (
                                    <Link
                                      key={i}
                                      to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                      className="block px-4 py-2 text-richblack-100 hover:text-yellow-25 transition-all duration-200"
                                      onClick={() => {
                                        setIsMenuOpen(false);
                                        setShowCatalog(false);
                                      }}
                                    >
                                      {subLink.name}
                                    </Link>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={link?.path || "/"}
                            className={`block px-4 py-2 ${
                              matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-100"
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {link.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Auth Buttons & Cart */}
                <div className="mt-6 space-y-4">
                  {token === null ? (
                    <div className="flex flex-col gap-4">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-center rounded-lg bg-richblack-800 text-richblack-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-center rounded-lg bg-richblack-800 text-richblack-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </div>
                  ) : (
                    <div className="px-4">
                      <div className="flex items-center gap-x-4">
                        {user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                          <Link
                            to="/dashboard/cart"
                            className="relative"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {totalItems > 0 && (
                              <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                {totalItems}
                              </span>
                            )}
                          </Link>
                        )}
                        <ProfileDropDown />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
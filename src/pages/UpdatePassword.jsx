import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { AiFillEye } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Spinner from './Spinners';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
    
    const navigate = useNavigate();
    const [formData, setFormData]= useState({
        password:"",
        confirmPassword:"",
    })
    const [showPassword, setShowPassword]= useState(false);
    const [showConfirmPassword, setShowConfirmPassword]= useState(false);
    const {loading}= useSelector((state) => state.auth);


    const dispatch= useDispatch();
    const location= useLocation();
    const token= location.pathname.split('/').at(-1);
    const {password, confirmPassword}= formData;
    console.log("update:", password, confirmPassword, token);

    const handleOnChange =(e)=>{
        setFormData((prevData)=>(
        {
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handleOnSubmit =(e)=>{
        e.preventDefault();
        dispatch(resetPassword(password , confirmPassword, token,navigate))

    }
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        {loading ? (
            <Spinner/>
        ) : (
            <div className="max-w-[500px] w-full p-4 md:p-8">
                <h1 className="text-2xl md:text-[1.875rem] font-semibold leading-[1.4] md:leading-[2.375rem] text-richblack-5">
                    Create New Password
                </h1>
                <p className="mt-3 mb-6 text-base md:text-[1.125rem] leading-[1.625rem] text-richblack-100">
                    Almost Done. Enter your new password below.
                </p>
                <form onSubmit={handleOnSubmit} className='w-full'>
                    <label className='relative block mb-6'>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            New Password*
                        </p>
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={handleOnChange}
                            placeholder='Password'
                            className="w-full p-3 bg-[#161D29] rounded-[8px] text-richblack-5"
                        />
                        <span 
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                            {showPassword ? 
                                <AiFillEye fontSize={24} color='white'/> : 
                                <AiFillEyeInvisible fontSize={24} color='white'/>
                            }
                        </span>
                    </label>

                    <label className="relative block mb-6">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm New Password*
                        </p>
                        <input
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleOnChange}
                            placeholder='Confirm Password'
                            className="w-full p-3 bg-[#161D29] rounded-[8px] text-richblack-5"
                        />
                        <span 
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                            {showConfirmPassword ? 
                                <AiFillEye fontSize={24} color='white'/> : 
                                <AiFillEyeInvisible fontSize={24} color='white'/>
                            }
                        </span>
                    </label>

                    <button 
                        type='submit'
                        className="w-full rounded-[8px] bg-yellow-50 py-3 px-3 font-medium text-richblack-900"
                    >
                        Reset Password
                    </button>
                </form>

                <div className="mt-6">
                    <Link to='/login'>
                        <p className="flex items-center gap-x-2 text-richblack-5">
                            Back to Login
                        </p>
                    </Link>
                </div>
            </div>
        )}
    </div>
  )
};

export default UpdatePassword;
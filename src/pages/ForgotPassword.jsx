import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';
import { FaArrowLeft } from "react-icons/fa6";
import Spinner from './Spinners';

const ForgotPassword = () => {

    const[emailSent, setEmailSent] = useState(false);
    const [email, setEmail]= useState("");
    const {loading}= useSelector((state)=> state.auth);
    const dispatch= useDispatch();

    const handleOnSubmit = (e) =>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent))

    }


  return (
    <div className='text-white min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4'>
        {
            loading ? ( <Spinner/>):
            (<div className='max-w-[500px] w-full flex flex-col items-start justify-center gap-4 p-4 md:p-8'>
                <h1 className='text-[#F1F2FF] text-2xl md:text-3xl font-bold'>
                    {
                        !emailSent ?"Reset Your Password" : "Check your Email"
                    }
                </h1>

                <p className='text-[#AFB2BF] text-base md:text-lg font-inter'>
                    {
                       !emailSent ?"Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery" :
                        `We have sent the reset email to ${email}`
                    } 
                </p>
                <form onSubmit={handleOnSubmit} className='w-full'>
                    {
                        !emailSent && (
                            <label className='w-full'>
                                <p className='mb-1 text-richblack-5'>Email Address*</p>
                                <input
                                    required
                                    type='email'
                                    name='email'
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    placeholder='Enter Your Email Address'
                                    className='w-full bg-[#161D29] p-3 rounded-[8px] text-white'
                                />
                            </label>
                        )
                    }
                    <button 
                        type='submit'
                        className="w-full text-center mt-6 px-6 py-3 rounded-md font-bold bg-yellow-50 text-black hover:scale-95 transition-all duration-200"
                    >
                        {
                            !emailSent ? "Reset Password" : "Resend Email"
                        }
                    </button>
                </form>

                <Link to="/login" className='flex items-center gap-2 text-richblack-5 mt-2'>
                    <FaArrowLeft/>
                    <p>Back to Login</p>
                </Link>
            </div>)
        }
    </div>
  )
}

export default ForgotPassword
import React from 'react'
import toast from 'react-hot-toast';
import { apiConnector } from '../apiConnectors';
import { catalogData } from '../apis';

export const getCatalogPageData = async (categoryId) => {
    
    const toastId= toast.loading("Loading...");
    let result = [];
    try{
        const response= await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId:categoryId});
        console.log("response after api..", response);
        if(!response.data.success){
            throw new Error("Could not Fetch Category Page Details");}

         result=response?.data;
         console.log("backend se API call ke baad kya aya..",result);

    }
    catch(error){
        console.log("CATALOG PAGE DATA API Error...", error);
        toast.error(error.message);
        result=error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}


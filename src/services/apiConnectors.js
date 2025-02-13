import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method:`${method}`,  // method is directly used
    url:`${url}`,   // url is directly used
    data: bodyData? bodyData : null,
    headers: headers? headers : null, // default value is empty object
    params: params? params : null,  // default value is empty object
  });
};
import axios from "axios";
export const saveInvoice = (baseURL,payload)=>{
   return axios.post(`${baseURL}/invoice`, payload);
}
export const getInvoices = (baseURL)=>{
   return axios.post(`${baseURL}`);
}
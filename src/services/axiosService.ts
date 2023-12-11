import axios from 'axios';
import { JSONObject } from '../interfaces/general.interface';
import { API_BASE } from './constantsService';

async function DO_REQUEST(_url: string, method = "GET", data?: JSONObject, config?: JSONObject) {
    const url = /^http(s)?:.+/.test(_url) ? _url : `${API_BASE}/${_url}`
    try {
        const response = await axios({
            method,
            url,
            data,
            ...config,
        });

        return response.data;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

export default DO_REQUEST;
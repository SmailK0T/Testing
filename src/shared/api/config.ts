import axios from 'axios';

export const API_URL = '/b2api';
export const SERIAL = 'a7307e89-fbeb-4b28-a8ce-55b7fb3c32aa';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'serial': SERIAL
    }
});

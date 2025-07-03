import { Component } from 'react';

const SERVER_URL = 'http://localhost:3000/';

class APIRequests extends Component {

    static async getRequest(restUrl) {    
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'GET',
            headers: this.buildHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred during the request';
            throw new Error(errorMessage);
        }

        return data;
    }


    static async postRequest(restUrl, objectToAdd) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'POST',
            headers: this.buildHeaders(),
            body: JSON.stringify(objectToAdd),
        })

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred during the request';
            throw new Error(errorMessage);
        }

        return data;
    }


    static async patchRequest(restUrl, fieldsToUpdate) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'PATCH',
            headers: this.buildHeaders(),
            body: JSON.stringify(fieldsToUpdate),
        })

        const data = await response.json();


        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred during the request';
            throw new Error(errorMessage);
        }

        return data;

    }


    static async deleteRequest(restUrl) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'DELETE',
            headers: this.buildHeaders(false)
        });

        if (!response.ok) {
            throw new Error(`DELETE HTTP error! status: ${response.status}`);
        }
    }


    static buildHeaders(contentType = true) {
        const token = sessionStorage.getItem("token");
        const headers = {};

        if (contentType) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }
}



export default APIRequests;
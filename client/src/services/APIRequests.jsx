import { Component } from 'react';

const SERVER_URL = 'http://localhost:3000/';

class APIRequests extends Component {

    static async getRequest(restUrl) {
        try {
            console.log(`Making GET request to: ${SERVER_URL}${restUrl}`);

            const response = await fetch(`${SERVER_URL}${restUrl}`, {
                method: 'GET',
                headers: this.buildHeaders(false)
            });

            if (!response.ok) {
                throw new Error(`GET HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('An error occurred:', error);
            return [];
        }

    }

    static async postRequest(restUrl, objectToAdd) {
        try {
            const response = await fetch(`${SERVER_URL}${restUrl}`, {
                method: 'POST',
                headers: this.buildHeaders(),
                body: JSON.stringify(objectToAdd),
            })

            if (!response.ok) {
                throw new Error(`POST HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('An error occurred:', error);
            return [];
        }

    }

    static async patchRequest(restUrl, fieldsToUpdate) {
        try {
            const response = await fetch(`${SERVER_URL}${restUrl}`, {
                method: 'PATCH',
                headers: this.buildHeaders(),
                body: JSON.stringify(fieldsToUpdate),
            })

            if (!response.ok) {
                throw new Error(`PATCH HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('An error occurred:', error);
            return [];
        }

    }

    static async deleteRequest(restUrl) {
        try {
            const response = await fetch(`${SERVER_URL}${restUrl}`, {
                method: 'DELETE',
                headers: this.buildHeaders(false)
            })

            if (!response.ok) {
                throw new Error(`DELETE HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('An error occurred:', error);
            return [];
        }

    }

    static async buildHeaders(contentType = true) {
        const token = localStorage.getItem("token");
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
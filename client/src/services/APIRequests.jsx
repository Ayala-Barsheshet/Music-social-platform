import { Component } from 'react';

const SERVER_URL = 'http://localhost:3000/';
const token = localStorage.getItem("token");

class APIRequests extends Component {

    static async getRequest(restUrl) {
        try {
            console.log(`Making GET request to: ${SERVER_URL}${restUrl}`);
            
            const response = await fetch(`${SERVER_URL}${restUrl}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error(`DELETE HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('An error occurred:', error);
            return [];
        }

    }
}

export default APIRequests;
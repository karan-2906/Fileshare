import React, { useState } from "react";
import toast from "react-hot-toast";

const url = process.env.REACT_APP_BASE_URL;

const host = `${url}/api/files`

export function useGetallfiles() {
    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const authToken = localStorage.getItem('auth')

    const getallfiles = async () => {
        setisLoading(true);
        setError(null);
        try {
            const response = await fetch(`${host}/getallfiles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setData(data);
            setisLoading(false)
        } catch (err) {
            console.log("Fetch error: ", err);
            toast.error("Failed to fetch data");
            setisLoading(false);
            setError(err)
        }
        return data;
    }

    const getuserfiles = async () => {
        setisLoading(true);
        setError(null);
        try {
            const response = await fetch(`${host}/getuserfiles/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setData(data);
            setisLoading(false)
        } catch (err) {
            console.log("Fetch error: ", err);
            toast.error("Failed to fetch data");
            setisLoading(false);
            setError(err)
        }
        return data
    }

    return { data, getallfiles, getuserfiles };

}

export function useUpload() {
    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState(null);
    const authToken = localStorage.getItem('auth')

    const upload = async (name, file, visibility) => {
        setisLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('name', name)
            formData.append('file', file);
            formData.append('visibility', visibility);
            const response = await fetch(`${host}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            toast.success("File uploaded successfully");
            setisLoading(false)
        } catch (err) {
            console.log("Fetch error: ", err);
            toast.error("Failed to upload file");
            setisLoading(false);
            setError(err)
        }
    }

    return { isLoading, error, upload };
}

export function useDelete() {
    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState(null);
    const authToken = localStorage.getItem('auth')

    const deleteFile = async (id) => {
        setisLoading(true);
        setError(null);
        try {
            const response = await fetch(`${host}/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            console.log(response)
            if (!response.ok) {
                toast.error("Unauthorised to Delete")
            }
            else{
            toast.success("File deleted successfully");

            }
            const data = await response.json();
            console.log(data);
            setisLoading(false)
        } catch (err) {
            console.log("Fetch error: ", err);
            toast.error("Failed to delete file");
            setisLoading(false);
            setError(err)
        }
    }

    return { isLoading, error, deleteFile };
}
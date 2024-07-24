import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import { toast } from "react-toastify";



const url = process.env.REACT_APP_BASE_URL;

const host = `${url}/api/user`

export function useHello() {
    const hello = async () => {
        try {
            const response = await fetch(`${host}/hello`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            toast.success("hello");
        } catch (err) {
            console.log("Fetch error: ", err);
            toast.error("Failed to fetch data");
        }
    };
    return { hello }
}

export function useLogin() {


    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const navigate = useNavigate();



    const login = async (email, password) => {
        setisLoading(true);
        setError(null);
        try {
            const response = await fetch(`${host}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });
            const responseData = await response.json();
            if (response.ok) {
                toast.success('user logged in succesfully')
                localStorage.setItem('auth', responseData.token)
                localStorage.setItem('username', responseData.username)
                navigate('/home');
            }
            else {
                toast.error(responseData.message);
                throw new Error(responseData.message);
            }
            setIsLogged(true);
            setisLoading(false);
        } catch (err) {
            toast.error('error logging in!!');
            console.log(err)
            setError(err.message);
            setisLoading(false);
        }
    }

    return { isLoading, error, isLogged, login };
}


export function useRegister() {

    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSignedUp, setIsSignedUp] = useState(false);
    const navigate = useNavigate();

    const register = async (name, email, password) => {
        setisLoading(true);
        setError(null);
        try {
            const response = await fetch(`${host}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                }),
            });
            const responseData = await response.json();
            if (response.ok) {
                toast.success('user signed up succesfully')
                navigate('/')
            }
            else {
                toast.error(responseData.message);
                throw new Error(responseData.message);
            }
            setIsSignedUp(true);
            setisLoading(false);
        } catch (err) {
            toast.error('error signing up!!');
            setError(err.message);
            setisLoading(false);
        }
    }

    return { isLoading, error, isSignedUp, register };

}

export function useUserInfo() {
    const [user, setUser] = useState();
    const [isLoggedin, setisLoggedin] = useState(false);

    const userInfo = async (req, res) => {
        try {
            const authToken = localStorage.getItem('auth');

            const response = await fetch(`${host}/userinfo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },

            })
            const responseData = await response.json();
            if (response.ok) {

                setUser(responseData.user)
                setisLoggedin(true)
            }
            else {
                setisLoggedin(false);
                throw new Error(responseData.error)

            }

        } catch (error) {
            console.log(error)
        }
    }

    return { userInfo, user, isLoggedin }
}
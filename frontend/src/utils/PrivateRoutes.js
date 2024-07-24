import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useUserInfo } from '../hooks/user';
import PageSkeleton from '../components/PageSekeleton';


const PrivateRoutes = () => {
    const { user, isLoggedin, userInfo } = useUserInfo();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            await userInfo();
            setLoading(false);
        };

        fetchUserInfo();
    }, []);

    if (isLoading) {

        return <div>
            <PageSkeleton />
        </div>;
    }

    return (
        <>
            {isLoggedin ? <Outlet /> : <Navigate to="/" />}
        </>
    );
};

export default PrivateRoutes;

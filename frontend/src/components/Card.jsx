import React from 'react'
import moment from 'moment';
import { FaLock, FaLockOpen } from "react-icons/fa";
const url = process.env.REACT_APP_BASE_URL;
const username = localStorage.getItem('username')

const Card = ({ file, setDeletemodal, setDeleteid, deletemodal }) => {


    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
        return (bytes / 1073741824).toFixed(1) + " GB";
    };

    const handledeletemodal = (id) => {
        setDeletemodal(!deletemodal)
        setDeleteid(file._id)
    }

    return (
        <div className='w-80 border-2 mt-12 p-2 dark:bg-gray-300 shadow-md shadow-black dark:shadow-white h-60 flex flex-col justify-between'>
            <div className='absolute flex pl-64 pt-2 text-3xl' >
                {file.visibility == "public" ? <FaLockOpen className='text-green-600' /> : <FaLock className='text-red-600' />}
            </div>
            <h1 className='text-3xl font-semibold pb-2 w-64 overflow-scroll' id='FileName'>{(file.filename).split('.')[0]}</h1>
            <div>
                <div className=' text-sm font-medium pb-1'>
                    <h1>Uploaded by - {file.user.name}</h1>
                    <h1>Type - {(file.type).split("/")[1]}</h1>
                </div>
                <div className=' text-sm flex justify-between font-medium pb-3'>
                    <h1>Date - {moment(file.createdAt).format('DD/MM/YYYY')}</h1>
                    <h1>Size - {formatFileSize(file.size)}</h1>
                </div>
                <div className='flex justify-between'>
                    <a href={`${url}/${file.path}`} target='_blank' className='bg-blue-500 text-lg p-2 rounded-xl text-white' > View</a>
                    {file.user.name == username ? <button className='bg-red-600 text-lg p-2 rounded-xl text-white' onClick={() => { handledeletemodal(file._id) }}> Delete</button>: null}
                    
                </div>
            </div>
        </div>
    )
}

export default Card
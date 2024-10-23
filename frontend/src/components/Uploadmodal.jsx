import React, { useState } from 'react'
import { FaLock, FaLockOpen } from "react-icons/fa";
import toast from "react-hot-toast";
import { useUpload } from '../hooks/file';

const Uploadmodal = ({ isuploadmodel }) => {

    const { upload } = useUpload()

    const [filename, setFilename] = useState('')
    const [selectedFile, setSelectedFile] = useState(null);
    const [visibility, setVisibility] = useState("public");
    const [isUploading, setIsUploading] = useState(false); // New state to track upload status

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select a valid file to upload.");
            return;
        }
        
        setIsUploading(true); // Disable the button
        await upload(filename, selectedFile, visibility);
        setIsUploading(false); // Re-enable the button if needed
        isuploadmodel();
    };

    const toggleVisibility = () => {
        setVisibility((prev) => (prev === "public" ? "private" : "public"));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Check file size
        if (file.size > 50 * 1024 * 1024) {
            toast.error("File size exceeds 50MB");
            return;
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPEG, PNG images, and PDFs are allowed.");
            return;
        }
        setSelectedFile(file);
    };
    return (
        <div className='absolute z-10 top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white shadow-md dark:bg-black dark:shadow-white p-4 w-96'>
                <h1 className='text-2xl font-semibold dark:text-white mb-3 text-center' >Upload File</h1>
                <label htmlFor="name" className='text-lg font-medium p-2 mt-4 dark:text-white'> Enter File Name</label>
                <input type="text" name="name" id="name" className='p-2 border-2 w-full ml-2 mb-3' placeholder='(optional)' onChange={(e) => { setFilename(e.target.value) }} />

                <label htmlFor="file" className='text-lg font-medium p-4 mt-4  dark:text-white'> Select File</label>
                <input type="file" className='p-2 border-2 w-full ml-2 mb-3'
                    accept='image/*,.pdf' // Allow only images and PDFs
                    onChange={handleFileChange} />
                <div className='flex flex-col'>
                    <label htmlFor="visibility" className='text-lg font-medium p-2 dark:text-white'> Visibility Type</label>
                    <div className='flex items-center gap-2 dark:text-white'>
                        <p className='text-md font-semibold'>Public</p>
                        <div className={`relative inline-block h-8 w-14 cursor-pointer rounded-full  transition [-webkit-tap-highlight-color:_transparent] ${visibility === "private" ? "bg-red-400" : "bg-green-400"}`}>

                            <input
                                type="checkbox"
                                id="toggle"
                                checked={visibility === "private"}
                                onChange={toggleVisibility}
                                className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
                            />

                            <span
                                className="absolute inset-y-0 start-0 z-10 m-1 inline-flex size-6 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600"
                                onClick={toggleVisibility}
                            >
                                {visibility === "public" ? <FaLockOpen className='text-blue-500 ' /> : <FaLock className='text-red-500' />}

                            </span>
                        </div>
                        <p className='text-md font-semibold'>Private</p>
                    </div>
                </div>
                <div className='flex justify-between mt-4'>
                    <button 
                        className='bg-green-500 text-white p-2 rounded-xl'
                        onClick={handleUpload}
                        disabled={isUploading} // Disable button when uploading
                    > 
                        {isUploading ? "Uploading..." : "Upload"} 
                    </button>
                    <button onClick={isuploadmodel} className='bg-red-600 text-white p-2 rounded-xl' > Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Uploadmodal

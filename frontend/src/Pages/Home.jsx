import React, { useEffect, useState } from 'react';
import { useGetallfiles, useDelete } from '../hooks/file';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Uploadmodal from '../components/Uploadmodal';

const username = localStorage.getItem('username'); // Assuming username is stored in local storage

const Home = () => {
    const { getallfiles, getuserfiles, data } = useGetallfiles();
    const { deleteFile } = useDelete();

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [uploadmodel, setUploadmodel] = useState(false);

    const [deletemodal, setDeletemodal] = useState(false);
    const [files, setFiles] = useState([]);
    const [deleteid, setDeleteid] = useState('');

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const fetchedFiles = await getallfiles(); // Fetch files from the backend
            setFiles(fetchedFiles); // Set the fetched files to state
            console.log(fetchedFiles);
        } catch (error) {
            toast.error('Failed to fetch files.');
        } finally {
            setIsLoading(false);
        }
    };

    const filtersearch = Array.isArray(data) && data.filter(data =>
        data.filename?.toLowerCase().includes(search?.toLowerCase())
      );

    useEffect(() => {
        if (filter === "All") {
            fetchFiles()
        } else {
            getuserfiles();
        }
    }, [filter]);

    const isuploadmodel = async () => {
        setUploadmodel(!uploadmodel);
        await fetchFiles(); // Fetch files after uploading
    };

    const handledeletemodal = (id) => {
        setDeletemodal(!deletemodal);
        setDeleteid(id);
    };

    const handledelete = async () => {
        await deleteFile(deleteid);
        handledeletemodal();
        await fetchFiles(); // Fetch files after deletion
    };



    return (
        <div className="pt-20 flex flex-col items-center">
            
            <div className="w-full pt-4 flex flex-wrap gap-4 justify-center items-center">
                <button onClick={isuploadmodel} className="bg-green-500 px-5 text-xl py-2 rounded-xl text-white">
                    Upload File
                </button>
                <input
                    type="text"
                    className="border-2 p-2 w-3/6 font-semibold"
                    placeholder="Search Files"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="bg-blue-500 px-6 text-xl py-2 rounded-xl text-white">Search</button>
                <div>
                    <label htmlFor="filter" className="text-lg font-medium p-4 dark:text-white">
                        Filter Files
                    </label>
                    <select
                        name="filter"
                        id="filter"
                        className="border-2 p-2 rounded-xl font-medium text-lg"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Personal">Personal</option>
                    </select>
                </div>
            </div>

            {uploadmodel && <Uploadmodal isuploadmodel={isuploadmodel} />}

            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <h1 className="text-xl font-semibold dark:text-white">Loading files...</h1>
                </div>
            ) : (
                <div className="flex flex-wrap gap-10 items-center justify-center">
                    {filtersearch.map((file) => (
                        <Card
                            key={file.id}
                            file={file}
                            setDeletemodal={setDeletemodal}
                            setDeleteid={setDeleteid}
                            deletemodal={deletemodal}
                        />
                    ))}

                    {deletemodal && (
                        <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white shadow-md dark:bg-slate-600 dark:shadow-white p-4 w-96">
                                <h1 className="text-2xl font-semibold dark:text-white mb-3 text-center">Delete File</h1>
                                <div className="flex justify-center gap-4">
                                    <button className="bg-green-500 text-white p-2 rounded-xl" onClick={handledelete}>
                                        Yes
                                    </button>
                                    <button onClick={handledeletemodal} className="bg-red-600 text-white p-2 rounded-xl">
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;

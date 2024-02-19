import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

function Information({bucket}) { 

    const [files,setFiles] = useState([]);
    const [editBtn, setEditBtn] = useState(false);
    const [filesEditName, setFilesEditName] = useState("");

    useEffect(() => { 
 
        const getFileFromBucket = async () => { 
            const res = await fetch(`http://localhost:8080/minio/file/all/${bucket}`)
            const data = await res.json()
            setFiles(data) 
        }
 
        getFileFromBucket()
    },[])

    const deleteFile = async (file) => { 
        try {

            Swal.fire({
                title: "Are you sure?",
                text: "You wan't to delete File!!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then(async (result) => {
                if (result.isConfirmed) {  
                  await deleteFile(file);
                }
              });

            async function deleteFile(file) {
                const res = await fetch(`http://localhost:8080/minio/file/delete/${bucket}/${file}`,{
                    method: "DELETE",
                    headers: {
                        'X-HTTP-Method-Override': 'DELETE', 
                    },
                });
            
                if (res.ok) {
                    Swal.fire({
                        title: "Delete File successfully",
                        text: "Please Check your File!!!",
                        icon: "success" ,
                        showConfirmButton: false, 
                        timer: 1000
                    });
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500); 
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Failed Delete file!!!", 
                        timer: 1000 
                    }); 
                } 
            }
            
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed Delete file!!!", 
                timer: 1000  
            }); 
        }
    };   

    const downloadFile = async (fileName) => {
        const res = await fetch(`http://localhost:8080/minio/download/file/${bucket}/${fileName}`, {
            method: "GET",
        });
    
        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); 
            Swal.fire({
                title: "Downloaded File Successfully!!",
                text: "Please Check your File!!!",
                icon: "success",
                showConfirmButton: false, 
                timer: 1000
              });
            setTimeout(() => {
                window.location.reload()
            }, 1500); 
        } else { 
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error Downloading file!!!",
                showConfirmButton: false,  
                timer: 1000
            });
        }
    };
    
    const convertDate = (dateString) => { 
        const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' });
        const dateObj = new Date(dateString);
        dateObj.setHours(dateObj.getHours() + 7);
        return formatter.format(dateObj);
    };
    
    const setFileEditedName = (file) => {
        setFilesEditName(file);
        setEditBtn(!editBtn);
    }; 
    
    const convertBytes = (bytes) => {

        if ((bytes/1024/1024) >= 1024) {
            return (bytes / 1024/1024/1024).toFixed(2) + ' GB';
        } else if ((bytes/1024) >= 1024) {
            return (bytes / 1024/1024).toFixed(2) + ' MB';
        } else {
            return (bytes / 1024).toFixed(2) + ' KB';
        }
    }

    return (
        <>
            <div className='bg-slate-100 w-full sm:w-[450px] md:w-[550px] lg:w-[650px] xl:w-[800px] py-5 mt-10 '>
                <h1 className='text-xl font-bold border-b-2 p-2'>Bucket : <span className='text-red-500'>${bucket}</span></h1>
                {files.length == 0 &&
                    (
                    <>
                        <p className='m-5 bg-red-500 text-white font-mono border-l-red-500 border p-2'>No File !!!</p>
                    </>
                    )
                }
                {files.map((file) => (
                    <div className='flex flex-col items-center justify-center border p-5 wza-full'>
                        <div className='w-full mx-auto flex flex-col justify-end items-start gap-5'>
                            <div className="flex flex-col hover:bg-gray-400 hover:text-white transition-all duration-200 w-[240px] sm:w-full mx-auto overflow-hidden bg-white p-2 border-black border rounded-xl">
                                <p className='break-words'><b>Name : </b>{file.fileName}</p>
                                <p><b>Size : </b>{convertBytes(file.fileSize)}</p>
                                <p><b>Last Modified : </b>{convertDate(file.creationDate)}</p>
                            </div>
                            <div className='flex flex-row flex-wrap gap-3 mt-2 md:mt-0 sm:ml-2 w-full justify-center sm:justify-end'>
                                <button className='bg-purple-500 text-white px-2 py-1 font-mono rounded-lg hover:bg-purple-800'>PREVIEW</button>
                                <button onClick={() => downloadFile(file.fileName)}  className='bg-blue-500 text-white px-2 py-1 font-mono rounded-lg hover:bg-blue-800'>Download</button>
                                <button onClick={() => setFileEditedName(file.fileName)} className='bg-gray-500 text-white px-2 py-1 font-mono rounded-lg hover:bg-gray-800'>Edit</button>
                                <button onClick={() => deleteFile(file.fileName)} className='bg-red-500 text-white px-2 py-1 font-mono rounded-lg hover:bg-red-800'>DELETE</button>
                            </div> 
                            <div className={` ${editBtn === true && filesEditName === file.fileName ? 'h-44 p-2' : 'h-0'} overflow-hidden transition-all w-full border shadow-lg bg-white flex flex-col justify-center items-center mx-auto border-t-8 border-t-green-500 rounded-b-2xl mb-2`}>
                                    <label className="text-xl my-2"><b>Input new File Bucket Name!!</b></label>
                                    <input onChange={(e) => setNewName(e.target.value)} type="text" className="p-2 rounded-md w-full border" />
                                    <button className="bg-red-500 w-full my-2 p-2 cursor-pointer text-white font-medium hover:bg-red-800 border-2 border-gray-700">OK</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Information;
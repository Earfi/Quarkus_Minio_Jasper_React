import { useEffect, useState } from "react";
import AddBucket from "./AddBucket";
import { Link } from "react-router-dom";

function ListBuckets() { 

    const [buckets,setBuckets] = useState([]);
     

    useEffect(() => { 
        const getBacket = async () => {
            const res = await fetch("http://localhost:8080/minio/all/bucket",{
                method: "GET"
            });
            const data = await res.json();
            setBuckets(data);
        };  
        getBacket();
    },[]);

    const deleteBucket = async (bucket) => { 
        try {
            const res = await fetch(`http://localhost:8080/minio/${bucket}/delete`,{
                method: "DELETE",
                headers: {
                    'X-HTTP-Method-Override': 'DELETE', 
                },
            });

            if (res.ok) {
                alert("Delete bucket successfully"); 
                window.location.reload();
            } else {
                alert("Error Delete bucket!!!, Check File In Bucket!!!"); 
            } 
        } catch (error) {
            alert("Error Delete bucket!!!"); 
        }
    };   

    return ( 
        <div className='bg-gray-300 w-full sm:w-[450px] md:w-[550px] lg:w-[800px] xl:w-full px-10 py-5 mx-auto mt-0 h-fit border border-black shadow-xl'>
            <AddBucket/>
            <h1 className='text-xl font-bold border-b-2 border-black pb-2 mt-3'>ALL : <span className="text-purple-600">Bucket &#9778;</span></h1>
            <div className='flex flex-col my-2 border-2 border-gray-600 bg-white'>
                <div className="flex justify-between my-5 mx-10 border-b-gray-900 font-bold text-lg bg-black text-white py-2 px-5">
                    <h1 className="w-[200px]">Bucket Name</h1>
                    <h1 className="hidden lg:block">Object</h1>
                    <h1 className="hidden lg:block">Size</h1>
                    <h1 className="hidden lg:block">Access</h1> 
                </div>
                <div className="flex flex-col justify-between border pb-5">
                    {buckets.map((bucket) => (
                       <div className="border-b-4 border-gray-300 p-2">
                            <Link to={`/file/${bucket}`}>
                                <div className="flex flex-col lg:flex-row items-start lg:justify-between lg:items-center my-2 mx-10 font-mono bg-gray-100 py-2 px-5 border-b-2 cursor-pointer hover:bg-gray-200 text-xs">
                                    <p className="w-[100px] md:w-[200px]">&#9778; <b className="font-extrabold">{bucket}</b></p>
                                    <p>Obj</p>
                                    <p>296 MIB</p>
                                    <p>R/W</p>
                                    
                                </div>
                            </Link>
                            <div className="flex justify-center gap-5 md:justify-end md:mr-20"> 
                                <button onClick={() => deleteBucket(bucket)}  className="bg-red-500 w-[100px] text-white px-2 py-1 hover:bg-red-800">Delete</button>
                                <button className="bg-purple-500 w-[100px] text-white px-2 py-1 hover:bg-purple-800">Edit</button>
                            </div>
                       </div>
                    ))}
                    {buckets.length === 0 && (
                        <p className='m-5 bg-red-500 text-white font-mono border-l-red-500 border p-2'>No Buckets!!!</p>
                    )}
                </div>
 
            </div>
        </div>
    )
}

export default ListBuckets;
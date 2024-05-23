import { useParams, useNavigate } from "react-router-dom"; 
import Sidebar from "../../components/Sidebar";
import ListFile from "../../components/minio/file/ListFile";
import UploadFile from "../../components/minio/file/UploadFile";
import { useEffect, useState } from "react";

function FileBucket() {
    const { bucket } = useParams(); 
    const navigate = useNavigate();
    const [token,setToken] = useState(null);

    useEffect(() => { 
        setToken(localStorage.getItem("token"))
    }, []);

    return (
        <div className="w-full overflow-hidden min-h-[90vh] bg-slate-100">  
            <div className="flex flex-row ">
                <div className="fixed ">
                    <Sidebar/>  
                </div>
                <div className="flex flex-col w-full"> 
                    <div className="md:mx-auto ">
                        {/* <h1 onClick={() => navigate(-1)} className="absolute text-4xl text-white md:text-black md:-left-20 cursor-pointer hover:text-red-500 z-0">&#10094;</h1> */}
                        <div className={`${token == null ? 'hidden' : 'block'}`}>
                            <UploadFile/> 
                        </div>
                        <ListFile bucket={bucket} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileBucket;

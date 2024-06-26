import { useState } from "react";
import Swal from 'sweetalert2'

function AddBucket() { 

    const [showAdd,setShowAdd] = useState(false);
    const [inputBucket,setInputBucket] = useState(null); 

    const showSwal = () => {
        Swal.fire({
            title: "Bucket add successfully",
            text: "Please Check your bucket!!!",
            icon: "success" ,
            showConfirmButton: false, 
            timer: 1000
          });
    } 
    const showSwalErr = () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error adding Bucket!!!", 
        }); 
    } 

    const uploadBucket = async () => {
        try{
            if(inputBucket == null){ 
                Swal.fire({
                    title: "Please Input Bucket Name !!",
                    text: "Please Input Bucket Name !!",
                    icon: "warning"
                  });
                return;
            }  

            const requestData = {
                bucketName: inputBucket,
            };

            const res = await fetch("http://localhost:8080/minio/bucket/upload",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ` + localStorage.getItem("token")
                },
                body: JSON.stringify(requestData),
            })
            console.log(res);
            if (res.status == 200) {
                showSwal();  
                setTimeout(() => {
                    window.location.reload()
                }, 1200); 
            } else if (!res.ok){
                showSwalErr(); 
            }
        } catch(error) {
            alert("Error adding Bucket!! :", error);
        }
    }

    return (
        <div className="flex flex-col items-end transition-all relative"> 
            <button onClick={(e) => setShowAdd(!showAdd)} className="bg-red-500 w-28 float-right text-white px-2 py-1 rounded-md font-semibold border shadow-md hover:bg-red-800">
                Add Bucket
            </button> 
            {showAdd == true && (
                <div className="flex flex-col mt-5 bg-white p-2 absolute top-5 shadow-2xl border-black border-2 w-48">
                    <h1 className="font-mono">Input Bucket!!!</h1>
                    <input onChange={(e) => setInputBucket(e.target.value)} type="text" className="border px-2 py-1"/> 
                    <p className="text-red-500">&#42; Only lowercase English letters are allowed. Special characters are not permitted , bucket name must be at least 3 and no more than 63 characters long &#42;</p>
                    <button onClick={uploadBucket} className="bg-red-500 mt-2 text-white px-2 py-1 rounded-md font-semibold border shadow-md hover:bg-red-800">Add</button>
                </div>
            )

            }
        </div>
    )
}

export default AddBucket;
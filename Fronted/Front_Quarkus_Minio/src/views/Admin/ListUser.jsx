import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Swal from 'sweetalert2'
import CreateUser from "./CreateUser";

function ListUser() {
    const [user,setUser] = useState([]); 
    
    useEffect(() => {  
 
        const getUser = async () => { 
            const res = await fetch(`http://localhost:8080/user`,{
                method: "GET",
                headers: { 
                    'Authorization': `Bearer ` + localStorage.getItem("token")
                },
            }) 
            const data = await res.json() 
            setUser(data) 

        }
 
        getUser()
    },[])

    const deleteUser = async (id) => { 
        try {

            Swal.fire({
                title: "Are you sure?",
                text: "You wan't to delete User!!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then(async (result) => {
                if (result.isConfirmed) {  
                  await deleteUser(id);
                }
              });

            async function deleteUser(id) {
                const res = await fetch(`http://localhost:8080/user/delete/${id}`,{
                    method: "DELETE",
                    headers: {
                        'X-HTTP-Method-Override': 'DELETE', 
                        'Authorization': `Bearer ` + localStorage.getItem("token")
                    },
                });
            
                if (res.ok) {
                    Swal.fire({
                        title: "Delete User successfully",
                        text: "Please Check your DB!!!",
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
                        text: "Failed Delete User!!!", 
                        timer: 1000 
                    }); 
                } 
            }
            
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed Delete User!!!", 
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

    return(
        <div className="w-full h-[100vh] flex min-w-[1300px] overflow-hidden">
            <div className="w-[20%] h-full shadow-2xl">
                <Sidebar/>
            </div>

            <div className="w-[80%] h-full overflow-hidden">
                <div className="w-[90%] h-[100vh] overflow-auto mx-auto bg-slate-100">
                    <div className="h-full">
                        <div className="h-16 w-full bg-gray-900 flex justify-between items-center px-20 "> 
                            <input className="w-96 h-10 text-black rounded-2xl p-2" placeholder="Search User..." type="text" />
                            <CreateUser/>
                        </div>

                        <table class="w-[90%] mx-auto bg-white shadow-md rounded my-6">
                            <thead>
                                <tr class="bg-gray-600 text-white border-2">
                                    <th class="py-4 px-6">Username</th>
                                    <th class="py-4 px-6">Birthday</th>
                                    <th class="py-4 px-6">Roles</th>
                                    <th class="py-4 px-6">Created At</th>
                                    <th class="py-4 px-6">Updated At</th>
                                    <th class="py-4 px-6"></th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-700">
                                {user.length > 0 ? (
                                    <>
                                        {user.map((u) => (
                                            <tr key={u.id} className="bg-white text-gray-700 border-b-2 border-gray-300 text-center">
                                                <td className="py-4 px-6">{u.username}</td>
                                                <td className="py-4 px-6">{u.birthdate}</td>
                                                <td className="py-4 px-6">{u.roles}</td>
                                                <td className="py-4 px-6">{convertDate(u.created_at)}</td>
                                                <td className="py-4 px-6">{convertDate(u.updated_at)}</td>
                                                <td onClick={() => deleteUser(u.id)} className="py-1 px-2 bg-red-500 cursor-pointer text-white font-bold hover:bg-red-800"><button>DELETE</button></td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (
                                    <tr className="bg-white text-gray-700 border-b-2 border-gray-300 text-center">
                                        <td className="py-4 px-6" colSpan="5">No User</td>
                                    </tr>
                                )} 
                            </tbody>
                        </table> 

                    </div>
                </div>
            </div>
 
        </div>
    )
}

export default ListUser;
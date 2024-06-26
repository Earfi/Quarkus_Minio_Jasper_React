import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Swal from 'sweetalert2'
import CreateUser from "./CreateUser"; 
import { Link,useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 

function ListUser() {
    const navigate = useNavigate();
 
    const [user,setUser] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [searchValue,setSearchValue] = useState("");  
 
    useEffect(() => {   
        if (localStorage.getItem("token") === null) {
            navigate('/'); 
        }
    
        const token = localStorage.getItem("token") 
    
        if (token) {   
          const decodedToken = jwtDecode(token); 
          if (decodedToken.groups !== 'Admin') {
              navigate('/'); 
          } 
        }  

        const getUser = async () => { 
            const res = await fetch(`http://localhost:8080/user`,{
                method: "GET",
                headers: { 
                    'Authorization': `Bearer ` + localStorage.getItem("token")
                },
            })  

            if (res.ok) {
                const data = await res.json()  
                setUser(data)  
            } else if(res.status == 401) {
                Swal.fire({
                    icon: "error",
                    title: "Oops... Session does Exits!!",
                    text: "Please Login!!!",  
                }).then(async (result) => {
                    if (result.isConfirmed) {  
                        localStorage.removeItem("token")
                        localStorage.removeItem("role")
                        navigate('/login');
                    }
                });
            } 
        }
 
        getUser()
    },[navigate])
    
    useEffect(() => { 
        const filtered = user.filter(u => u.username.includes(searchValue));
        setSearchTerm(filtered); 
    }, [searchValue, user]);

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
                    }, 1000); 
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
 

    return (
        <div className="min-h-screen bg-slate-100">
          <div>
            <Sidebar />
            <div className="flex-1 min-h-screen overflow-auto bg-white shadow-md rounded-md mx-4 p-4">
              <div className="flex justify-between items-center mb-4">
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full md:w-64 h-10 text-black rounded-md p-2 border focus:outline-none focus:border-blue-500"
                  placeholder="Search User..."
                  type="text"
                />
                <CreateUser />
              </div>
      
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-md my-6">
                  <thead>
                    <tr className="bg-gray-600 text-white">
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Birthday</th>
                      <th className="py-3 px-4">Roles</th>
                      <th className="py-3 px-4">Created At</th>
                      <th className="py-3 px-4">Updated At</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {searchTerm.length > 0 ? (
                      searchTerm.map((u) => (
                        <tr key={u.id} className="bg-white text-gray-700 border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-3 px-4">{u.username}</td>
                          <td className="py-3 px-4">{u.birthdate}</td>
                          <td className="py-3 px-4">{u.roles}</td>
                          <td className="py-3 px-4">{convertDate(u.created_at)}</td>
                          <td className="py-3 px-4">{convertDate(u.updated_at)}</td>
                          <td className="py-3 px-4">
                            <Link to={`/dashboard/edituser/${u.id}`} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded-md mr-2">Edit</Link>
                            <button onClick={() => deleteUser(u.id)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-md">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white text-gray-700 border-b border-gray-200">
                        <td className="py-4 px-6" colSpan="6">No User</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
      
              <div className="w-full flex justify-center mt-4">
                <div className="join">
                  <input className="join-item btn btn-square" type="radio" name="options" aria-label="1" checked />
                  <input className="join-item btn btn-square" type="radio" name="options" aria-label="2" />
                  <input className="join-item btn btn-square" type="radio" name="options" aria-label="3" />
                  <input className="join-item btn btn-square" type="radio" name="options" aria-label="4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      
      
}

export default ListUser;

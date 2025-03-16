import "./home.scss";
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AvatarImg from "../assets/images/avatar.jpg";
import { useState } from 'react';
import CreateEmploye from "../create";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export const api:any  = "http://localhost:5137/api";

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}


const Home = ()=> {

 const [initialValue, setInitialValue] = useState<IUser | null>(null);
 const [open, setOpen] = useState(false);

  const { isLoading, isError:getIsError, data, error:getError, refetch } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axios.get<IUser[]>(`${api}/Employees`);

      return res.data.map((user) => ({
        ...user,
        avatar: AvatarImg,
      }));
    },
  });

  const {mutate, isPending, isError:delIsError, error:delError} = useMutation({
    mutationFn:(id:number) => axios.delete(`${api}/Employees/${id}`).then((res) => res.data),
    onSuccess:() => {
      console.log("woring");
      
      refetch();
    }
  })

  const handleEditClick = (id:number) =>{
    
    if (id) {
      const findUser = data?.find(user => user.id == id)
      
      setInitialValue(findUser || null)
    }
    setOpen(true)
  }

  const isError = getIsError || delIsError;
  const error = getError || delError;

 
  
  if (isLoading || isPending) {
    return <p> Loading</p> ;
  }


  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div className="containerr">
      <header>
        <div className="modals">

        <CreateEmploye  open={open} setOpen={setOpen} setInitialValue={setInitialValue} initialValue={initialValue} refetch={refetch} className="e-modal"/>
        </div>
      </header>
      <section className="user-section"></section>
    <h2 className="title">Users List</h2>
    <div className="users-container">
      {data?.map(user => (
        <div key={user.id} className="user-card">
            <img className="card-img" src={user.avatar} alt="img" width={100} height={100}/>
        
          <div className="user-info">
            <p className="user-name">Name: {user.name}</p>
            <p className="user-email">Email: {user.email}</p>
            <p className="user-phone">Phone: {user.phone}</p>
          </div>
          <div className="btn-wrap">

          <Button danger onClick={()=>mutate(user.id)}><DeleteOutlined /></Button>
          <Button onClick={() => handleEditClick(user.id)}><EditOutlined /></Button>
          </div>
        </div>
      ))}
    </div>
   
  </div>
  )
}

export default Home
'use client'
import { useState,useEffect } from "react";
import PocketBase from "pocketbase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import AvUser from "@/components/ustawUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Link from "next/link";
import { LoginForm } from "@/components/loginForm";
import Edit from "@/components/editpost";
import Delete from "@/components/delposts";

const pb = new PocketBase('http://172.16.15.138:8080');

export default function Home() {

  const [user,setUser]=useState(null)
  const [posts,setPosts]=useState(null)
  useEffect(()=>{
    const getData = async ()=>{
      try{
        const records = await pb.collection('posts').getFullList({
          sort: '-created',
      });
      console.log(records)
      setPosts(records)
      }catch(err){
        console.log(err)
      }finally{

      }
    }
    getData()
  },[])
  useEffect(()=>{
      setUser(pb.authStore.model)
      console.log(pb.authStore.model)
  },[])
  const login = async ()=>{
    setUser(pb.authStore.model)
    console.log(user)
}
const logout = async()=>{
  pb.authStore.clear();
  setUser(null)
}
const updated = (item)=>{
  console.log(item)

    var index = null
    var tmpPosty = [...posts]
    for(let i in posts){
      if(posts[i].id == item.id){
        index = i
      }
    }
    tmpPosty[index] = item
    console.log(item)
    setPosts(tmpPosty)
    console.log("index: " + index)
  
}
const deleted = (id)=>{
  setPosts((prev)=>(
    prev.filter((ele)=>{
      return ele.id != id 
    })
  ))
}


  return(
    <div>
      <div className="flex flex-row gap-2">
            <Link href=".">Strona1</Link>
            {user?<Link href="/strona2">Strona2</Link>:"Strona2"}
        </div>
    <div className="flex flex-row justify-end items-end">
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar>
      <AvatarImage src={user && pb.files.getUrl(user, user.avatar)} alt="@shadcn" />
      <AvatarFallback>user</AvatarFallback>
    </Avatar>
    </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>{user?user.username : "niezalogowany"}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {user?
    <>
    <DropdownMenuItem asChild><Button onClick={logout}>wyloguj</Button></DropdownMenuItem>
    <DropdownMenuItem asChild><AvUser user={user} setUser={setUser}>Ustawienia</AvUser></DropdownMenuItem>
    </>
    :
    <DropdownMenuItem asChild><LoginForm onLogin={login}>logowanie</LoginForm></DropdownMenuItem>
}
    
  </DropdownMenuContent>
</DropdownMenu>

      
    </div>
    {user && 
      <div className="flex justify-center w-full flex-wrap gap-5">
          {posts && posts.map((post)=>(
            <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.tytul}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              {post.opis}
            </CardContent>
            <CardFooter>
              {user.id==post.autor?<><Edit item={post} onupdated={updated}/><Delete id={post.id} ondeleted={deleted}/></>:";)"}
              
            </CardFooter>
          </Card>
          ))}
        </div>
    }
    </div>
  )
}
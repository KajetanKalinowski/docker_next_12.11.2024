'use client'
import { useState,useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import PocketBase from "pocketbase";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"  
const pb = new PocketBase('http://172.16.15.138:8080');
export default function AvUser({user,setUser}){
    const [open,setOpen]=useState(false)
    
    useEffect(()=>{
        setUser(pb.authStore.model)
    },[])
    const [zdjecie, setZdjecie] = useState(null)
    const handleZdjecie = (e) =>{
        setZdjecie(e.target.files[0])
        
      }
      const handleButtonClick = async ()=>{
        console.log(zdjecie) 

        const formData = new FormData()
        formData.append("avatar",zdjecie)

        try{
        const record = await pb.collection('users').update(user.id,formData);
        console.log(record)
        setOpen()
        window.location.reload()
        
    }catch(err){
        console.log(err)
    }
    }

return(
    <div>
        <AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger asChild><Button variant="outline">Ustawienia</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
      <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor='zdjecie'>
            Zdjecie
            </Label>
          <Input 
            type='file' 
            id='zdjecie' 
            placeholder='Zdjecie'
            onChange={(e)=>{handleZdjecie(e)}}
          />
        </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction asChild><Button onClick={handleButtonClick}>Change</Button></AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </div>
)
}
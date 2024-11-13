'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "./ui/input"
import PocketBase from 'pocketbase';
import { DialogClose } from "@radix-ui/react-dialog"
import Image from "next/image"

export default function Edit({item, onupdated}){

    const [dane, setDane] = useState({tytul: item.tytul, opis: item.opis})
    const pb = new PocketBase('http://172.16.15.138:8080');

    const handleInputChange = (id, e) =>{

        setDane((prev)=>({
          ...prev,
          [id]: e.target.value
      }))
      console.log(dane)
      }

    const update = async ()=>{
        const formData = new FormData()

        formData.append("tytul", dane.tytul)
        formData.append("opis", dane.opis)
        const record = await pb.collection('posts').update(item.id, formData);


        onupdated(record)
    }

    return(
    <Dialog>
        <DialogTrigger>
            <Button>Edytuj</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                <div className="mt-5 flex flex-col items-center flex-wrap gap-5">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor='tytul'>Tytuł</Label>
                      <Input defaultValue={item.tytul} onChange={(e)=>{handleInputChange('tytul', e)}} type='text' id='tytul' placeholder='Tytuł'></Input>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor='opis'>Opis</Label>
                      <Input defaultValue={item.opis} onChange={(e)=>{handleInputChange('opis', e)}} type='text' id='opis' placeholder='Opis'></Input>
                    </div>
                  </div>
                    <DialogClose asChild>
                        <Button onClick={update}>Save changes</Button>
                    </DialogClose>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
    )
}
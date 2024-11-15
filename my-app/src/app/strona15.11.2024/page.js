'use client'
import PocketBase from 'pocketbase';
import { useState,useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
  

export default function Home(){
    const pb = new PocketBase('http://172.16.15.138:8080');
    const [dane,setDane] = useState(null)
    const [msg,setMsg] = useState(null)
    const userID = "cwf74ha3or86ry5"
    useEffect(()=>{
        const getData = async ()=>{
            try{
        const resultList = await pb.collection('chat1').getList(1, 50, {
        sort: '-created',
        });
        console.log(resultList.items)
        setDane(resultList.items)
    }catch(err){
        console.log(err)
    }
        }
        getData()
    },[])
useEffect(()=>{
    // Subscribe to changes in any chat1 record
pb.collection('chat1').subscribe('*', function (e) {
    console.log(e.action);
    console.log(e.record);

    if(e.action=="create"){
    setDane((prev)=>([...prev,e.record]))



}

   

});

return () => {
    pb.collection('chat1').unsubscribe('*'); 

}
},[])
const handleSend = async()=>{
    const data = {
        user_id: userID,
        message: msg
    }
    const record = await pb.collection('chat1').create(data);
}
const handleInput = (e)=>{
    setMsg(e.target.value)

}
    
const getClassName = (id_msg)=>{
    const className2 = "flex justify-start"

    if(userID==id_msg){
        const className1 = "flex justify-end"
        return className1
    }else{
        return className2
    }
}

    return(
        <div className='flex flex-col justify-center items-center'>
           
            <Card className="w-[50%] h-[50vh]">
            {dane && dane.map((wiadomosc)=>(
                
                <div key={wiadomosc.id} className={getClassName(wiadomosc.user_id)}>
                    <Card className="w-[50%] py-5">
                        <p>{wiadomosc.message}</p>
                    </Card>
                </div>

            ))}
            </Card>
            <div className='flex mt-5 w-[50%] gap-2'>
                <Input onChange={(e)=>{handleInput(e)}}></Input>
                <Button onClick={handleSend}><Send></Send></Button>
            </div>

        </div>
    )
}
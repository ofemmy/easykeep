import {useMemo,useEffect,useState, useCallback} from "react";
import NewTable from "../components/NewTable";
import {format} from "date-fns"
import axios from "axios";
import { useQuery } from "react-query";
const columns =[
    {
        Header:"Title",
        accessor:"title"
    },
    {
        Header:"Amount",
        accessor:"amount"
    },
    {
        Header:"Category",
        accessor:"category"
    },
    {
        Header:"Type",
        accessor:"type"
    },
    {
        Header:"Date",
        accessor:row=>format(new Date(row.date),"MM/dd/yyyy")
    }
]
async function getTrxList(limit,skip) {
    const res = await axios.get(`/api/test?limit=${limit}&skip=${skip}`);
    return res.data;
  }
  
export default function TablePage(){
    const [limit, setLimit] = useState(5)
    const [skip, setSkip] = useState(0)
    let {data,isLoading}=useQuery(["items",limit,skip],()=>getTrxList(limit,skip),{keepPreviousData:true})
    const pageCount = Math.ceil(23/limit)
    if(isLoading)return <div>Loading....</div>
    return (

        <NewTable cols={columns} data={data.data} pageCount={pageCount} setSkip={setSkip}/>
    )
}


import { Mongoose } from 'mongoose'
import Head from 'next/head'
import { connectToDatabase } from '../util/mongodb'

export default function Home({ isConnected }) {
  return (<div>Successfully connected to DB - {isConnected}</div>)
    
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase()
  console.log("from index page",db.connection.readyState);
  return {
    props: { isConnected:true },
  }
}

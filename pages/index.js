import Head from 'next/head'

import { ApolloProvider, InMemoryCache, gql, ApolloClient } from '@apollo/client';

import styles from '../styles/Home.module.css'


export default function Home({launches}) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Space X Launch</title>
        <meta name="description" content="Space X launches" />
        
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Space X Launches
        </h1>

        <p className={styles.description}>
          Latest 10 launches from Space X
        </p>

        <div className={styles.grid}>
         {launches.map(launch=> {
           return (
              <a key={launch.id} href={launch.links.video_link}  className={styles.card}>
              <h2>{launch.mission_name}</h2>
              <p>Launch Time: <strong> { new Date (launch.launch_date_local).toLocaleDateString("en-US")}</strong></p>
            </a>
           )
         })}
         
        </div>
      </main>

    
    </div>
  )
}


export async function getStaticProps() {
   const client = new ApolloClient({
     uri: 'https://api.spacex.land/graphql/',
     cache: new InMemoryCache()
   })

   const {data}= await client.query({
     query:gql`
          {
        launchesPast(limit: 10) {
          id
          mission_name
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
          launch_date_local
          launch_site {
              site_name_long
            }
          }
          }     
     `
   })
   console.log('data',data)

  return {
    props: {
      launches: data.launchesPast
    }, 
  }
}
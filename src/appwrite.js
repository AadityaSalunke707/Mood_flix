const DATABASE_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID=import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID;
import {Client,ID, Databases,Query} from 'appwrite'

const client=new Client()
.setEndpoint('https://cloud.appwrite.io/v1')// here we pointing to appwrite servers
.setProject(PROJECT_ID); // we have to set project to point current project id


//Q) which functionality we have to use from appwrite

const database=new Databases(client);
export const updateSearchCount=async(searchTerm,movie)=>{
   //1.use the Appwrite sdk to check the search term exist in the database
   try {
        const result=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.equal('searchTerm',searchTerm), //we ,match what users are searching for
        ])

     //2. If it does,update the Count
        if(result.documents.length>0){
            const doc=result.documents[0];
            await database.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id,{
                count:doc.count+1,
            })
        }
        //3. If it Doesnt, create a new Document with the Search term and count as 1
        else{
            await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
                searchTerm,
                count:1,
                movie_id:movie.id,
                poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
        
   } catch (error) {
    console.error(error);
   }
  
}


export const getTrendingMovies=async()=>{
    try {
         const result=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc("count")
         ])
         return result.documents;
    } catch (error) {
        console.error(error);
    }
}
import conf from '../conf/conf.js'
import {Client, ID, Databases, Storage, Query } from 'appwrite'

export class Service{
client = new Client();
databases;
bucket;

constructor(){
    this.client.setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);
 this.databases = new Databases(this.client);
 this.bucket = new Storage(this.client);  
}

//creatint post
async createPost({title, slug, content, featuredImage, status,userId,userName }){
    try{
return await this.databases.createDocument(
    conf.appwriteDatabaseId, 
    conf.appwriteCollectionId,
    slug,
    { 
      title,
      content, 
      featuredImage, status, userId,userName 
    }
)
    }catch(e){
      console.log("appwrite create post err : ", e)
    }
}

async updatePost( slug, {title, content, featuredImage, status}){
    try{
 return  await this.databases.updateDocument(
    conf.appwriteDatabaseId,
    conf.appwriteCollectionId,
    slug,{
        title,
        content,
        featuredImage, 
        status
    }
)
    }catch(e){
        console.log("appwrite update post err : ", e)
    }
}

async deletePost(slug){
    try{
await this.databases.deleteDocument(
    conf.appwriteDatabaseId, conf.appwriteCollectionId, slug
) 
return true;
    }catch(e){
        console.log("appwrite delete post err : ", e)
           return false;
    }

}

//now may be we need to get one post or get all post so seperate method willl be formed for these two...
//list documents and getdocument

async getPost(slug){
    try{
return await this.databases.getDocument(
    conf.appwriteDatabaseId,
    conf.appwriteCollectionId,
    slug
)
    }catch(e){
        console.log("appwrite getpost  err : ", e)
return false
    }
}

//list doc for getting all post using a query for filter so using query only actove status post doc we get using indexing(indx imp to use qry)
async getPosts(queries = [Query.equal("status", "active")]){
    try{
return await this.databases.listDocuments(
    conf.appwriteDatabaseId,
    conf.appwriteCollectionId,queries
)
           
    }catch(e){
        console.log("appwrite getposts all  err : ", e)
        return false
    }
}

//file upload service will pass the blob of file as file arg
async uploadFile(file){
    try{
return await this.bucket.createFile(
    conf.appwriteBucketId,
    ID.unique(),
    file,
    
)
    }catch(e){
        console.log("appwrite upload post  err : ", e)
    }
}

//delete file service

async deleteFile(fileId){
    try{
        await this.bucket.deleteFile(
            conf.appwriteBucketId,
            fileId
        )
        return true
    }catch(e){
        console.log("appwrite delete file post err : ", e)
    }
}

//othr service get file preview(gives a normal preview not orignl file)
getFilePreview(fileId){
    return this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId
    )
}

getFileView(fileId) {
    return this.bucket.getFileView(
        conf.appwriteBucketId,
         fileId);
  }
  
}

const service = new Service()
export default service

import sharp from 'sharp'
import { unlink } from 'fs/promises'
import fs from 'fs'

//Models
import User from '../models/User'
import Profile, {IProfile, Photo, ProfileDocument} from '../models/Profile'
import {Types} from 'mongoose'

export {IProfile} 

export const userProfile = async(reqUser:Express.User | undefined): Promise<ProfileDocument | Error> => {
   const user = reqUser as InstanceType<typeof User>
   const profile = await Profile.findOne({user: user?.id})

   if(!profile) return new Error('Usuário não existe')

   return profile as ProfileDocument
}

export const checkEditable = async(username:string, reqUser:Express.User | undefined): Promise<boolean> => {
   const user = reqUser as InstanceType<typeof User>

   //Checks if the username in the URL is the same as the logged user
   let editable = false
   if(username === user?.username) editable = true

   return editable
}

export const findProfile = async(username:string): Promise<ProfileDocument> => {
   const user = await User.findOne({username})

   const profile = await Profile.findOne({user: user?.id})
      .populate<{user: typeof User}>
      ({path: 'user', select: 'username'})
   
   return profile as unknown as ProfileDocument
}

export const findPhoto = async(id:string): Promise<Photo | undefined> => {
   const profile = await Profile.findOne({_id: id})
   const photo = profile?.photo?.find(e => e?.url ? e : null);

   return photo
}

export const deletePhoto = async(id:string): Promise<void> => {
   const photo = await findPhoto(id)
   if(photo){
      const pathUrl = `./public/assets/media/${photo?.url}.png`
      if(fs.existsSync(pathUrl)){
         await unlink(pathUrl)
      }
   }
}

export const addPhoto = async(file:Express.Multer.File | undefined): Promise<false | Photo>=> {
   
   if(!file) return false

   let photo = {} as Photo
   await sharp(file.path)
      .toFormat('png')
      .resize(200)
      .toFile(`./public/assets/media/${file?.filename}.png`)
         
   photo.url = file?.filename

   // Use this whenever you use -+unlink
   sharp.cache(false);
   await unlink(file.path)
   return photo
}

// Function that adds new photo if uploaded,
// if it is not, it returns the photo that is on the profile.
export const processPhoto = async(file:Express.Multer.File | undefined, id:string): Promise<Photo> => {
   let photo = await addPhoto(file)
   if(!photo) return await findPhoto(id) as Photo
   
   await deletePhoto(id)
   return photo
}

export const updateProfile = async(data:IProfile, id:string): Promise<Error | void> => {
   const profile = await Profile.findOne({_id: id})
   if(!profile) return new Error('Perfil não encontrado')

   const updates:IProfile = {
      name: data.name ?? profile?.name,
      bio: data.bio ?? profile?.bio,
      website: data.website ?? profile?.website,
      celphone: data.celphone ?? profile?.celphone,
      gender: data.gender ?? profile?.gender,
      followers: data.followers ?? profile?.followers,
      photo: data.photo
   }
   await profile?.updateOne(updates)
}

export const setFollowing = async(username:string, idUser:Types.ObjectId): Promise<boolean> => {
   const profile = await findProfile(username)
   let following = profile?.followers?.find(e => e.idProfile == idUser)
   
   if(!following) { //Follow User
     await Profile.findByIdAndUpdate(profile?.id, {
      $push: {
         followers: {
            idProfile: idUser
         }
      }})

      await Profile.findByIdAndUpdate(idUser, {
         $push: {
            following: {
               idProfile: profile?.id
            }
      }})
      
      return true
   } 
   else { //UnFollow User
      await Profile.findByIdAndUpdate(profile?.id, {
         $pull: {
            followers: {
               idProfile: idUser
            }
      }})

      await Profile.findByIdAndUpdate(idUser, {
         $pull: {
            following: {
               idProfile: profile?.id
            }
      }})
      return false
   }
}
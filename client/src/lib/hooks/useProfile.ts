import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Photo, Profile, User } from "../types"
import agent from "../api/agent"
import { useMemo } from "react"

export const useProfile = (id?: string) => {

    const queryClient = useQueryClient();

    const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({ // assign a name to the destructured returned data to be "profile" and isLoading to be "loadingProfile". This is not similar to assigning a type since we are getting a return value
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await agent.get<Profile>(`/profiles/${id}`);
            return response.data;
        },
        enabled: !!id
    })

    const { data: photos, isLoading: loadingPhotos } = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
            return response.data
        },
        enabled: !!id
    })

    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            // the HTTP agent function which takes in the endpoint, the body of the request, and the header of the request
            const response = await agent.post('/profiles/add-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data
        },
        onSuccess: async (photo: Photo) => { // on success, update the existing data
            await queryClient.invalidateQueries({ // first invalidate the existing data on the cache for the current user
                queryKey: ['photos', id]
            });
            queryClient.setQueryData(['user'], (data: User) => { // then update the data on the cache with the query key 'user'
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
            queryClient.setQueryData(['profile', id], (data: Profile) => { // and also update the data on the cache for the same user but for his profile
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
        }
    })

    const setMainPhoto = useMutation({
        mutationFn: async (photo: Photo) => {
            await agent.put(`/profiles/${photo.id}/setMain`)
        },
        onSuccess: (_, photo) => { // operations on the cache after the api call succeeds
            queryClient.setQueryData(['user'], (userData: User) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    imageUrl: photo.url
                }
            });
            queryClient.setQueryData(['profile', id], (profile: Profile) => {
                if (!profile) return profile;
                return {
                    ...profile,
                    imageUrl: photo.url
                }
            });

        }
    })

    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await agent.delete(`/profiles/${photoId}/photos`)
        },
        onSuccess: (_, photoId) => {
            queryClient.setQueryData(['photos', id], (photos: Photo[]) => {
                return photos?.filter(x => x.id !== photoId)
            })
        }
    })

    const isCurrentUser = useMemo(() => {
        return id === queryClient.getQueryData<User>(['user'])?.id // compare if the id we are passing to the component that will make the query is the same as the id of the currently logged in user by checking the cached data of the "user" query
    }, [id, queryClient])



    return { // returns 1 or more objects (so it can be destructured by the caller)
        profile,
        loadingProfile,
        photos,
        loadingPhotos,
        isCurrentUser,
        uploadPhoto,
        setMainPhoto,
        deletePhoto
    }
}
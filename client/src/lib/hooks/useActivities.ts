import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import type { Activity } from "../types";
import { useAccount } from "./useAccount";

export const useActivities = (id?: string) => {

    const queryClient = useQueryClient();
    const { currentUser } = useAccount();
    const location = useLocation();

    const { data: activities, isLoading } = useQuery({ // useQuery Hook from React Query instead of useState from baseline React to GET data and utilize global state mgmt. functionalities
        queryKey: ['activities'],
        queryFn: async () => {
            const response = await agent.get<Activity[]>('/activities'); // actual HTTP Client request by axios
            return response.data;
        },
        enabled: !id && location.pathname === '/activities' && !!currentUser,
        select: data => { // when the list of data comes back from the API, loop into it and check if the current user is the host.
            return data.map(activity => {
                return {
                    ...activity,
                    isHost: currentUser?.id === activity.hostId,
                    isGoing: activity.attendees.some(x => x.id === currentUser?.id)
                }
            })
        }
    });

    const { data: activity, isLoading: isLoadingActivity } = useQuery({
        queryKey: ['activities', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data
        },
        enabled: !!id && !!currentUser,
        select: data => { // when the data comes back from the API, check if the current user is the host.
            return {
                ...data,
                isHost: currentUser?.id === data.hostId,
                isGoing: data.attendees.some(x => x.id === currentUser?.id)
            }
        }
    })

    const updateActivity = useMutation({ //useMutation Hook from React Query to POST data and utilize global state mgmt. functionalities
        mutationFn: async (activity: Activity) => {
            await agent.put('/activities', activity)
        },
        onSuccess: async () => { // Cache management. this line tells react query that the cached data for this query ID is stale now since using this mutation will update data on the server
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    })

    const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            const response = await agent.post('/activities', activity);
            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    })

    const deleteActivity = useMutation({
        mutationFn: async (id: string) => {
            await agent.delete(`/activities/${id}`)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    })

    const updateAttendance = useMutation({
        mutationFn: async (id: string) => {

            await agent.post(`/activities/${id}/attend`)
        },
        onMutate: async (activityId: string) => {
            await queryClient.cancelQueries({queryKey: ['activities', activityId]}); // cancel all ongoing queries

            const prevActivity = queryClient.getQueryData<Activity>(['activities', activityId]) // obtain a copy of the query data from the cache

            queryClient.setQueryData<Activity>(['activities', activityId], oldActivity => { // replace the cache data
                if (!oldActivity || !currentUser){
                    return oldActivity
                }

                const isHost = oldActivity.hostId === currentUser.id;
                const isAttending = oldActivity.attendees.some(x => x.id === currentUser.id);

                return { // adding an attendance, cancelling, reactivating an activity
                    ...oldActivity,
                    isCancelled: isHost ? !oldActivity.isCancelled : oldActivity.isCancelled,
                    attendees: isAttending ? isHost ? oldActivity.attendees : oldActivity.attendees.filter(x => x.id !== currentUser.id)
                    : [...oldActivity.attendees, {
                        id: currentUser.id,
                        displayName: currentUser.displayName,
                        imageUrl: currentUser.imageUrl
                    }]
                }
            })

            return {prevActivity}; // return the previous activity if we get an error
        },
        onError: (error, activityId, context) => { // which we then use to set the cache back as the previous activity
            console.log('prevActivity ' + context?.prevActivity);
            console.log(error);
            if (context?.prevActivity){
                queryClient.setQueryData(['activities', activityId], context.prevActivity)
            }
        }
    })

    return {
        activities,
        isLoading,
        updateActivity,
        createActivity,
        deleteActivity,
        activity,
        isLoadingActivity,
        updateAttendance
    }
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

export const useActivities = () => {

    const queryClient = useQueryClient();

    const { data: activities, isPending } = useQuery({ // useQuery Hook from React Query instead of useState from baseline React to GET data and utilize global state mgmt. functionalities
        queryKey: ['activities'],
        queryFn: async () => {
            const response = await agent.get<Activity[]>('/activities'); // actual HTTP Client request by axios
            return response.data;
        }
    });

    const updateActivity = useMutation({ //useMutation Hook from React Query to POST data and utilize global state mgmt. functionalities
        mutationFn: async (activity: Activity) => {
            await agent.put('/activities', activity)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    })

    const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            await agent.post('/activities', activity)
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

    return {
        activities,
        isPending,
        updateActivity,
        createActivity,
        deleteActivity
    }
}
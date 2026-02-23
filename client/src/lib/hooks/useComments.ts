import { useLocalObservable } from "mobx-react-lite"
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr'
import { useEffect, useRef } from "react";
import type { ChatComment } from "../types";
import { runInAction } from "mobx";

export const useComments = (activityId?: string) => {
    const created = useRef(false);

    // hook to establish the connection to the SignalR Hub (Server) as a SignalR client (Websocket client not an HTTP Client)
    const commentStore = useLocalObservable(() => ({ // Creates a local Mobx store that lives inside the component
        comments: [] as ChatComment[], /// The Comments MobX observable store
        hubConnection: null as HubConnection | null, // The SignalR Connection MobX observable store

        createHubConnection(activityId: string) { // Function to start the connection
            if (!activityId) return;

            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_COMMENTS_URL}?activityId=${activityId}`, {
                    withCredentials: true
                }).withAutomaticReconnect()
                .build();

            this.hubConnection.start().catch(error =>
                console.log('Error establishing connection: ', error));
            
            this.hubConnection.on('LoadComments', comments => {
                runInAction(() => {
                    this.comments = comments
                })
                
            })

            this.hubConnection.on('ReceiveComment', comment => {
                runInAction(() => {
                    this.comments.unshift(comment);
                })
            })

        },

        stopHubConnection() { // Function to stop the connection
            if (this.hubConnection?.state === HubConnectionState.Connected) {
                this.hubConnection.stop().catch(error =>
                    console.log('Error stopping connection', error))
            }
        }
    }));

    // The actual trigger to call the hook when the component renders or stop the hook when the component is dismounted
    useEffect(() => {
        if (activityId && !created.current) {
            commentStore.createHubConnection(activityId)
            created.current = true;
        }
        return () => {
            commentStore.stopHubConnection();
            commentStore.comments = [];
        }
    }, [activityId, commentStore])


    return {
        commentStore
    }
}
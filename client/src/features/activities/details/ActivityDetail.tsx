import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import { useActivities } from "../../../lib/hooks/useActivities";

type Props = {
    selectedActivity: Activity
    cancelSelectActivity: () => void;
    openForm: (id: string) => void;
}

export default function ActivityDetails({ selectedActivity, cancelSelectActivity, openForm }: Props) {
    const {activities} = useActivities();
    const activity = activities?.find(x => x.id === selectedActivity.id);

    if (!activity) return <Typography>Loading...</Typography>

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardMedia component='img' src={`/images/categoryImages/${activity.category}.jpg`} />
            <CardContent>
                <Typography variant='h5'>{activity.title}</Typography>
                <Typography variant='subtitle1' fontWeight='light'>{activity.date}</Typography>
                <Typography variant='body1'>{activity.description}</Typography>
            </CardContent>
            <CardActions>
                {/* 
                Wrapper function here is used to pass the openForm function 
                as a reference to onClick and not to execute the function 
                when the page renders. If you use openForm without the 
                wrapper function, it will execute during page load
                leaving react with no function to call onClick

                On the other hand, cancelSelectActivity is being passed as
                reference by default to onClick since it does not take any arguments.
                When we write it we are just using the variable to pass it to OnClick
                as reference. But if it takes arguments and we passed it without a wrapper
                function, it will be executed on page render and not onClick
                */}
                <Button color='primary' onClick={() => openForm(activity.id)}>Edit</Button>
                <Button onClick={cancelSelectActivity} color='inherit'>Cancel</Button>
            </CardActions>
        </Card>
    )
}

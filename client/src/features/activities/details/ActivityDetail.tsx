import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import { Link, useNavigate, useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";

export default function ActivityDetails() {
    const navigate = useNavigate();
    const {id} = useParams();
    const {activity, isLoadingActivity} = useActivities(id);

    if (isLoadingActivity) return <Typography>Loading...</Typography>

    if (!activity) return <Typography>Activity not found</Typography>

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
                <Button component={Link} to={`/manage/${activity.id}`} color='primary'>Edit</Button>
                <Button onClick={() => navigate('/activities')} color='inherit'>Cancel</Button>
            </CardActions>
        </Card>
    )
}

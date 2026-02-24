import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useState, type SyntheticEvent } from "react"
import ProfilePhotos from "./ProfilePhotos";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";


export default function ProfileContent() {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  } // anonymous function where 1st parameter is not needed but 2nd parameter is needed

  const tabContent = [
    { label: 'About', content: <ProfileAbout/> },
    { label: 'Photos', content: <ProfilePhotos /> },
    { label: 'Events', content: <div>Events</div> },
    { label: 'Followers', content: <ProfileFollowings activeTab={value}/> },
    { label: 'Following', content: <ProfileFollowings activeTab={value}/> },
  ]


  return (
    <Box
      component={Paper}
      mt={2}
      p={3}
      elevation={3}
      height={500}
      sx={{ display: "flex", alignItems: "flex-start", borderRadius: 3 }}
    >
      <Tabs // renders the Tabs component. Tabs is the container for each tab we have defined
        orientation="vertical"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, height: 450, minWidth: 200 }}
      >
        {tabContent.map((tab, index) => (
          <Tab key={index} label={tab.label} sx={{ mr: 3 }} /> // the actual tabs that we have defined in tabContent (Rendered dynamically by looping through the list and displaying them to make it scaleable)
        ))}
      </Tabs>

      <Box sx={{ flexGrow: 1, p: 3, pt: 0 }}> {/* The content of the tab rendered separately. But they stay in sync because they both depend on the same piece of state: value */}
        {tabContent[value].content}
      </Box>
    </Box>
  )
}

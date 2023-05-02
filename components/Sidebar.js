import { useContext, useState } from 'react';
import CreateHomeDialog from './reusable/CreateHomeDialog'
import HomesSidebar from '../components/reusable/HomesSidebar'
import ProfileSidebar from '../components/reusable/ProfileSidebar'

import { ThemeContext } from './ThemeProvider';


const Sidebar = ({ userProfile }) => {
  const { isDark, toggleTheme, theme } = useContext(ThemeContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dialogonCLose = () => {
    setIsDialogOpen(false)
  }

  const handleAddHomeClick = () => {
    console.log('toggleed')
    setIsDialogOpen(true);
  };

  // console.log(userProfile);
// style={{ display: showSidebar ? 'block' : 'none' }}
  return (
    <>
      {/* Sidebar toggle button for small screens */}

      {/* Sidebar for large screens */}
      
      <div className={`w-full h-full ${theme.boxbg} ${theme.primaryTextColor} overflow-y-auto`}>

        <div>
          <ProfileSidebar userprofile={userProfile} />
        </div>

        {/* homes */}
        <div>
          <HomesSidebar homes={userProfile.homes} />
        </div>

        <button className={` ${theme.primaryBtn} ${theme.hoverBtn} text-white text-sm font-bold  p-2 rounded ml-4 mt-10`} onClick={handleAddHomeClick}>
          Add Home
        </button>

        {isDialogOpen && (
          <CreateHomeDialog setIsDialogOpen={setIsDialogOpen} />
        )}
      </div>
    </>
  );
};


export default Sidebar
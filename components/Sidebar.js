import { useState } from 'react';
import CreateHomeDialog from './reusable/CreateHomeDialog'
import HomesSidebar from '../components/reusable/HomesSidebar'
import ProfileSidebar from '../components/reusable/ProfileSidebar'

const Sidebar = ({ userProfile, showSidebar, showprofile }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dialogonCLose = () => {
    setIsDialogOpen(false)
  }

  const handleAddHomeClick = () => {
    setIsDialogOpen(true);
  };

  // console.log(userProfile);

  return (
    <>
      {/* Sidebar toggle button for small screens */}

      {/* Sidebar for large screens */}
      <div className="overflow-y-auto" style={{ display: showSidebar ? 'block' : 'none' }}>
        
        <div style={{ display: showprofile ? 'block' : 'none' }}>
          <ProfileSidebar userprofile={userProfile} />
        </div>

        {/* homes */}
        <div>
          <HomesSidebar homes={userProfile.homes} />
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddHomeClick}>
          Add Home
        </button>
        
        {isDialogOpen && (
          <CreateHomeDialog onClose={dialogonCLose} />
        )}
      </div>
    </>
  );
};


export default Sidebar
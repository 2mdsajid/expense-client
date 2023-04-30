import { useState } from 'react';
import CreateHomeDialog from './reusable/CreateHomeDialog'
import HomesSidebar from '../components/reusable/HomesSidebar'
import ProfileSidebar from '../components/reusable/ProfileSidebar'



const Sidebar = ({ userProfile }) => {
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
      <div className="overflow-y-auto">

        <div>
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
          <CreateHomeDialog setIsDialogOpen={setIsDialogOpen} />
        )}
      </div>
    </>
  );
};


export default Sidebar
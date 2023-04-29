import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  const handleNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const notification = new Notification('New Message', {
          body: 'You have a new message!',
          icon: '/path/to/icon.png'
        });

        notification.onclick = (event) => {
          // handle click event here
        };
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            const notification = new Notification('New Message', {
              body: 'You have a new message!',
              icon: '/path/to/icon.png'
            });

            notification.onclick = (event) => {
              // handle click event here
            };
          }
        });
      }
    }
  };

  return (
    <div>
      <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} />
      <button onClick={handleNotification}>Send Notification</button>
    </div>
  );
}

export default App;

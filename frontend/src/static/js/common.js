import api from './APIClient.js';

export function getCurrentUserId() {
    return api.get('/api/currentuser') // Make the API call to the server
        .then(data => {
            if (data && data.user) {
                return data.user.id; // Return the user ID
            } else {
                throw new Error('User data is not available');
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            throw error; // Re-throw the error to handle it in the calling code
        });
}

export function logOut() {
    return api.post('/api/users/logout') // Assuming you have a logout endpoint
        .then(() => {
            // Clear any client-side storage here if necessary
            localStorage.removeItem('token'); // If you're using localStorage to store the token
            // Redirect to the login page which is index haha
            document.location = './';
        })
        .catch(error => {
            console.error('Logout failed:', error);
            // Handle logout error (maybe display a message to the user)
        });
}


/*********************\
* SERVICE WORKER CODE *
\*********************/

function registerServiceWorker() {
    if (!navigator.serviceWorker) { // Are SWs supported?
      return;
    }
  
    navigator.serviceWorker.register('./serviceWorker.js')
      .then(registration => {
        /*if (!navigator.serviceWorker.controller) {
          //Our page is not yet controlled by anything. It's our first SW
          return;
        }*/
  
        if (registration.installing) {
          console.log('Service worker installing');
        } else if (registration.waiting) {
          console.log('Service worker installed, but waiting');
          newServiceWorkerReady(registration.waiting);
        } else if (registration.active) {
          console.log('Service worker active');
        }
  
        registration.addEventListener('updatefound', () => { //This is fired whenever registration.installing gets a new worker
          
          console.log("SW update found", registration, navigator.serviceWorker.controller);
          newServiceWorkerReady(registration.installing);
        });
      })
      .catch(error => {
        console.error(`Registration failed with error: ${error}`);
      });
  
    navigator.serviceWorker.addEventListener('message', event => {
      console.log('SW message', event.data);
    });
  
    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload" in dev tools.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if(refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  
  };
  
  registerServiceWorker();
  
  
  //This method is used to notify the user of a new version
  function newServiceWorkerReady(worker) {
    const popup =  document.createElement('div');
    popup.className = "popup";
    popup.innerHTML = '<div>New Version Available</div>';
  
    const buttonOk = document.createElement('button');
    buttonOk.innerHTML = 'Update';
    buttonOk.addEventListener('click', e => {
      worker.postMessage({action: 'skipWaiting'});
    });
    popup.appendChild(buttonOk);
  
    const buttonCancel = document.createElement('button');
    buttonCancel.innerHTML = 'Dismiss';
    buttonCancel.addEventListener('click', e => {
      document.body.removeChild(popup);
    });
    popup.appendChild(buttonCancel);
  
    document.body.appendChild(popup);
  }
  
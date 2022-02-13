import '../styles/globals.css';
import Navbar from '@components/Navbar';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '@lib/context';
import { useUserData } from '@lib/hooks';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster
        position="bottom-center"
        containerStyle={{
          bottom: 40,
        }}
      />
    </UserContext.Provider>
  );
}

export default MyApp;

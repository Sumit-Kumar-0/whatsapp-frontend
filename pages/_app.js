import { Provider } from 'react-redux';
import { store } from '../store/store';
import '../styles/globals.css';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
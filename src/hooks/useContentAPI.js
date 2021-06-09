import { useEffect, useState } from 'react';

const useContentAPI = (initialUrl) => {
  const [ url, setUrl ] = useState(initialUrl);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ data, setData ] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const response = await fetch(url);
      const apiData = await response.json();

      console.log(apiData);
    }

    if (url) {
      fetchData();
    }
  }, [url])

  return [
    data, 
    isLoading, 
    setUrl
  ]
}

export default useContentAPI;
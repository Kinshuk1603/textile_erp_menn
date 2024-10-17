import { useEffect } from 'react';
import { useRouter } from 'next/router';

const IndexPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = false; // Replace with your actual authentication check logic

    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    } else {
      router.push('/signup'); // Redirect to home page if authenticated
    }
  }, [router]);

  return null; // No need to render anything, just handle redirection
};

export default IndexPage;

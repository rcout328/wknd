'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';

const HomePage = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {userEmail ? (
        <p>Logged in as: {userEmail}</p>
      ) : (
        <p>
          Please <Link href="/login-register">log in</Link>.
        </p>
      )}
    </div>
  );
};

export default HomePage;
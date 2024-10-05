import { useEffect, useState } from 'react';
import Link from 'next/link';

const AdminHomePage = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the Admin Home Page</h1>
      {userEmail === 'admin123@gmail.com' ? (
        <p>Logged in as: {userEmail}</p>
      ) : (
        <p>
          Please <Link href="/login-register">log in</Link>.
        </p>
      )}
    </div>
  );
};

export default AdminHomePage;
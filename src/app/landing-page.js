import { useUser } from '@/context/UserContext';

const LandingPage = () => {
  const { userEmail } = useUser(); // Access the user email from context

  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      {userEmail ? <p>Logged in as: {userEmail}</p> : <p>Please log in.</p>}
    </div>
  );
};

export default LandingPage;
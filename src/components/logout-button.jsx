import { useUser } from '@/context/UserContext';
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const { clearUserEmail } = useUser();

  const handleLogout = () => {
    clearUserEmail(); // Clear email from context and local storage
    // Optionally redirect to login page
    window.location.href = '/login-register'; // Adjust the path as necessary
  };

  return (
    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
      Logout
    </Button>
  );
};

export default LogoutButton;
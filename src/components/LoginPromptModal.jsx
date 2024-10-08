import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const LoginPromptModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
        </DialogHeader>
        <p className="text-center">You must be logged in to order items. Please log in to continue.</p>
        <DialogFooter>
          <Link href="/login-register">
            <Button onClick={onClose}>Go to Login</Button>
          </Link>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPromptModal;
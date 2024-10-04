import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SidebarMenu({ isOpen, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-pink-100 bg-opacity-30 backdrop-blur-sm transition-opacity z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white bg-opacity-40 backdrop-blur-md shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex justify-end p-4">
          <Button variant="ghost" onClick={onClose}>
            <X className="h-6 w-6 text-pink-600" />
          </Button>
        </div>
        <nav className="px-4">
          <ul className="space-y-4">
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Home</a></li>
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Menu</a></li>
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Custom Cakes</a></li>
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">About Us</a></li>
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Contact</a></li>
          </ul>
        </nav>
      </div>
    </>
  );
}
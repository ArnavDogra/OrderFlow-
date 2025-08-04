import { ShoppingCart, User, LogOut } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container-fluid">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xl font-semibold">Order Management System</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-4 w-4" />
              <span>Admin User</span>
            </div>
            <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

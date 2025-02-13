
import { Activity, Calendar, Newspaper, User, Crown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-6 sm:top-0 sm:bottom-auto">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center gap-4">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive("/") ? "text-primary" : "text-neutral hover:text-primary"
            }`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs sm:text-sm">Workouts</span>
          </Link>
          <Link
            to="/schedule"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive("/schedule") ? "text-primary" : "text-neutral hover:text-primary"
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs sm:text-sm">Schedule</span>
          </Link>
          <Link
            to="/subscriptions"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive("/subscriptions") ? "text-primary" : "text-neutral hover:text-primary"
            }`}
          >
            <Crown className="w-6 h-6" />
            <span className="text-xs sm:text-sm">Premium</span>
          </Link>
          <Link
            to="/news"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive("/news") ? "text-primary" : "text-neutral hover:text-primary"
            }`}
          >
            <Newspaper className="w-6 h-6" />
            <span className="text-xs sm:text-sm">News</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive("/profile") ? "text-primary" : "text-neutral hover:text-primary"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs sm:text-sm">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

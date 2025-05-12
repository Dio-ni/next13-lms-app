
import { Button } from "@/components/ui/button";
import { Book, LogIn } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CourseSpark</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="nav-link">Мүмкіндіктер</a>
            <a href="#courses" className="nav-link">Курстар</a>
            <a href="#instructors" className="nav-link">Оқытушылар</a>
            <Button className="bg-primary text-white" variant="default">
              <LogIn className="mr-2 h-4 w-4" />
              Кіру
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

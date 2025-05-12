
import { Book, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { 
      icon: Github, 
      href: "https://github.com/coursespark", 
      label: "GitHub" 
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/coursespark", 
      label: "LinkedIn" 
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/coursespark", 
      label: "Twitter" 
    }
  ];

  const quickLinks = [
    { label: "Мүмкіндіктер", href: "#features" },
    { label: "Курстар", href: "#courses" },
    { label: "Оқытушылар", href: "#instructors" },
    { label: "Байланыс", href: "#contact" }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Book className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CourseSpark</span>
            </div>
            <p className="text-gray-400">
              Заманауи онлайн курстар арқылы өзіңіздің кәсіби дағдыларыңызды дамытыңыз
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Сілтемелер</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Байланыс</h4>
            <div className="space-y-2 text-gray-400">
              <p>Email: info@coursespark.kz</p>
              <p>Телефон: +7 (707) 123 45 67</p>
              <p>Қазақстан, Алматы</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Əлеуметтік желілер</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="text-white border-gray-700">
                Хабарламаларды алу
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>© {currentYear} CourseSpark. Барлық құқықтар қорғалған.</p>
        </div>
      </div>
    </footer>
  );
};


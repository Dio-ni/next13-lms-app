"use client";
import { useUser } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { enrollUserInCourse } from "@/actions/enrollUserInCourse";  // Import the enroll function

function EnrollButton({
  courseId,
  isEnrolled,
}: {
  courseId: string;
  isEnrolled: boolean;
}) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter(); // Router hook to handle redirects
  const [isPending, startTransition] = useTransition();

  // Show loading state while checking user is loading
  if (!isUserLoaded || isPending) {
    return (
      <div className="w-full h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show enrolled state with link to course
  if (isEnrolled) {
    return (
      <Link
        prefetch={false}
        href={`/dashboard/courses/${courseId}`}
        className="w-full rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 h-12 flex items-center justify-center gap-2 group"
      >
        <span>Курсты ашу</span>
        <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </Link>
    );
  }

 
  const handleEnrollClick = async () => {
    if (!user?.id) {
      alert("Курска тіркелу үшін жүйеге кіріңіз.");
      return;
    }
  
    startTransition(async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/enroll`, {
          method: "POST",
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Unknown error");
        }
  
        router.push(`/dashboard/courses/${courseId}`);
      } catch (error: any) {
        console.error("Enrollment error:", error);
        alert("тіркелу сәтсіз аяқталды: " + error.message);
      }
    });
  };

  

  // Show enroll button only when we're sure user is not enrolled
  return (
  <button
      className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-300 ease-in-out relative h-12
        ${
          isPending || !user?.id
            ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
            : "bg-white text-black hover:scale-105 hover:shadow-lg hover:shadow-black/10"
        }
      `}
      disabled={!user?.id || isPending}
      onClick={handleEnrollClick} // Trigger enrollment and redirect
    >
      {!user?.id ? (
        <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
          Тіркелі үшін кіріңіз
        </span>
      ) : (
        <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
          Қазір тіркелу
        </span>
      )}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}

export default EnrollButton;

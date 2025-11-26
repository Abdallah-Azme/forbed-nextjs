"use client";
import SignupForm from "@/features/auth/components/singup-form";

export default function Page() {
  return (
    <div className="flex  w-full items-center justify-center p-6 md:p-10">
      <div className="w-full  ">
        <SignupForm />
      </div>
    </div>
  );
}

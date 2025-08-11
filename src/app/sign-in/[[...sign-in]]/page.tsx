import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path" 
          path="/sign-in"
          redirectUrl="/profile"
        />
      </div>
    </div>
  );
}
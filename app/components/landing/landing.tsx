import LandingContent from "./LandingContent";
import LandingSignIn from "./LandingSignIn";

export default function Landing() {
  return (
    <div className="flex flex-row h-screen">
      <LandingContent />
      <LandingSignIn />
    </div>
  )
}
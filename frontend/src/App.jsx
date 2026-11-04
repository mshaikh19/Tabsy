import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Auth from "./components/auth/Auth";
import ForgotPassword from "./components/auth/ForgotPassword";
import SetNewPassword from "./components/auth/SetNewPassword";
import VerifyEmail from "./components/auth/VerifyEmail";
import Onboarding from "./pages/Onboarding";
import OnboardingPersonalize from "./pages/OnboardingPersonalize";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileSetupPreferences from "./pages/ProfileSetupPreferences";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth initialMode="login" />} />
        <Route path="/signup" element={<Auth initialMode="signup" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/personalize" element={<OnboardingPersonalize />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/profile-setup/preferences" element={<ProfileSetupPreferences />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

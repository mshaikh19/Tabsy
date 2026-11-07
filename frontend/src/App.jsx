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
import Dashboard from "./pages/Dashboard";
import Activity from "./pages/Activity";
import Balances from "./pages/Balances";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import GroupDetails from "./pages/GroupDetails";
import GroupExpenses from "./pages/GroupExpenses";
import Notifications from "./pages/Notifications";
import QuickActions from "./pages/QuickActions";

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
        <Route
          path="/onboarding/personalize"
          element={<OnboardingPersonalize />}
        />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route
          path="/profile-setup/preferences"
          element={<ProfileSetupPreferences />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/balances" element={<Balances />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/create-group" element={<CreateGroup />} />
<Route path="/group-details" element={<GroupDetails />} />
<Route path="/group-expenses" element={<GroupExpenses />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/quick-actions" element={<QuickActions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

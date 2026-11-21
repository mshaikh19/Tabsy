import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Auth from "./components/auth/Auth";
import ForgotPassword from "./components/auth/ForgotPassword";
import SetNewPassword from "./components/auth/SetNewPassword";
import VerifyEmail from "./components/auth/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
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
import AddExpense from "./pages/AddExpense";
import GroupMembers from "./pages/GroupMembers";
import GroupBalances from "./pages/GroupBalances";
import GroupActivity from "./pages/GroupActivity";
import GroupSettings from "./pages/GroupSettings";
import LeaveGroup from "./pages/LeaveGroup";
import EditGroup from "./pages/EditGroup";
import AddMembers from "./pages/AddMembers";
import Notifications from "./pages/Notifications";
import QuickActions from "./pages/QuickActions";
import Expenses from "./pages/Expenses";
import ExpenseDetails from "./pages/ExpenseDetails";
import SplitExpense from "./pages/SplitExpense";
import ManageParticipants from "./pages/ManageParticipants";
import EditExpense from "./pages/EditExpense";
import DeleteExpense from "./pages/DeleteExpense";

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
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route
          path="/onboarding/personalize"
          element={<ProtectedRoute><OnboardingPersonalize /></ProtectedRoute>}
        />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route
          path="/profile-setup/preferences"
          element={<ProtectedRoute><ProfileSetupPreferences /></ProtectedRoute>}
        />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
        <Route path="/balances" element={<ProtectedRoute><Balances /></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
        <Route path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
        <Route path="/group-details" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
        <Route path="/group-expenses" element={<ProtectedRoute><GroupExpenses /></ProtectedRoute>} />
        <Route path="/group-expenses/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
        <Route path="/group-members" element={<ProtectedRoute><GroupMembers /></ProtectedRoute>} />
        <Route path="/group-balances" element={<ProtectedRoute><GroupBalances /></ProtectedRoute>} />
        <Route path="/group-activity" element={<ProtectedRoute><GroupActivity /></ProtectedRoute>} />
        <Route path="/group-settings" element={<ProtectedRoute><GroupSettings /></ProtectedRoute>} />
        <Route path="/group-edit" element={<ProtectedRoute><EditGroup /></ProtectedRoute>} />
        <Route path="/group-leave" element={<ProtectedRoute><LeaveGroup /></ProtectedRoute>} />
        <Route path="/group-members/add" element={<ProtectedRoute><AddMembers /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/quick-actions" element={<ProtectedRoute><QuickActions /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/expense-details" element={<ProtectedRoute><ExpenseDetails /></ProtectedRoute>} />
        <Route path="/split-expense" element={<ProtectedRoute><SplitExpense /></ProtectedRoute>} />
        <Route path="/group-members/manage" element={<ProtectedRoute><ManageParticipants /></ProtectedRoute>} />
        <Route path="/expense-edit" element={<ProtectedRoute><EditExpense /></ProtectedRoute>} />
        <Route path="/expense-delete" element={<ProtectedRoute><DeleteExpense /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

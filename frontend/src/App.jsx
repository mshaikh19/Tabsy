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
import RecurringExpenses from "./pages/RecurringExpenses";
import ExpenseHistory from "./pages/ExpenseHistory";
import Categories from "./pages/Categories";

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
        <Route path="/group-expenses/add" element={<AddExpense />} />
        <Route path="/group-members" element={<GroupMembers />} />
        <Route path="/group-balances" element={<GroupBalances />} />
        <Route path="/group-activity" element={<GroupActivity />} />
        <Route path="/group-settings" element={<GroupSettings />} />
        <Route path="/group-edit" element={<EditGroup />} />
        <Route path="/group-leave" element={<LeaveGroup />} />
        <Route path="/group-members/add" element={<AddMembers />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/quick-actions" element={<QuickActions />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expense-details" element={<ExpenseDetails />} />
        <Route path="/split-expense" element={<SplitExpense />} />
        <Route path="/group-members/manage" element={<ManageParticipants />} />
        <Route path="/expense-edit" element={<EditExpense />} />
        <Route path="/expense-delete" element={<DeleteExpense />} />
        <Route path="/recurring-expenses" element={<RecurringExpenses />} />
        <Route path="/expense-history" element={<ExpenseHistory />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

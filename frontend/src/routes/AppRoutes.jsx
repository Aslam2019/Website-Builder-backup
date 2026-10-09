import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import PublicRoute from './PublicRoute'

// Public pages
import Home from '../pages/public/Home'
import About from '../pages/public/About'
import HowItWorks from '../pages/public/HowItWorks'
import WhyChooseUs from '../pages/public/WhyChooseUs'
import Pricing from '../pages/public/Pricing'
import Contact from '../pages/public/Contact'

// Auth pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// User pages
import Dashboard from '../pages/user/Dashboard'
import Templates from '../pages/user/Templates'
import WebsiteForm from '../pages/user/WebsiteForm'
import MyWebsite from '../pages/user/MyWebsite'
import Payments from '../pages/user/Payments'
import Profile from '../pages/user/Profile'
import Checkout from '../pages/user/Checkout'

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageCategories from '../pages/admin/ManageCategories'
import ManageTemplates from '../pages/admin/ManageTemplates'
import ManagePricing from '../pages/admin/ManagePricing'
import ManageWebsites from '../pages/admin/ManageWebsites'
import ManagePayments from '../pages/admin/ManagePayments'
import AdminSettings from '../pages/admin/AdminSettings'

// Generated website
import GeneratedWebsite from '../pages/generated/GeneratedWebsite'

export default function AppRoutes() {
  return (
    <Routes>
      {/* -------- Public ---------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/why-choose-us" element={<WhyChooseUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* -------- Auth (redirect if logged in) ---------- */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* -------- User dashboard ---------- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/templates" element={<Templates />} />
          <Route path="/dashboard/website-form" element={<WebsiteForm />} />
          <Route path="/dashboard/my-website" element={<MyWebsite />} />
          <Route path="/dashboard/payments" element={<Payments />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/checkout" element={<Checkout />} />
        </Route>
      </Route>

      {/* -------- Admin ---------- */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/templates" element={<ManageTemplates />} />
          <Route path="/admin/pricing" element={<ManagePricing />} />
          <Route path="/admin/websites" element={<ManageWebsites />} />
          <Route path="/admin/payments" element={<ManagePayments />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* -------- Public generated website preview ---------- */}
      <Route path="/site/:websiteId" element={<GeneratedWebsite />} />

      {/* -------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
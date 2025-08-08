import React, { useState, useEffect } from 'react';
import { User, Save, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { authAPI, paymentAPI } from '../lib/api';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCreatingPassword, setIsCreatingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [createPasswordData, setCreatePasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user's order count
  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const response = await paymentAPI.getOrders();
        if (response.success) {
          // Filter out pending orders to match MyOrdersPage behavior
          const completedOrders = response.data.orders.filter((order: any) => order.status !== 'pending');
          setOrderCount(completedOrders.length);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Don't show error to user, just keep count at 0
      }
    };

    if (user) {
      fetchOrderCount();
    }
  }, [user]);

  // Check if user has a password (Google users might not have one)
  const hasPassword = !user?.googleId;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.updateProfile(profileData.name, profileData.avatar);
      
      if (response.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Update user context if needed
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (response.success) {
        toast.success('Password changed successfully!');
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (createPasswordData.newPassword !== createPasswordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (createPasswordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // For Google users creating their first password, we don't need current password
      const response = await authAPI.changePassword('', createPasswordData.newPassword);
      
      if (response.success) {
        toast.success('Password created successfully!');
        setIsCreatingPassword(false);
        setCreatePasswordData({
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.message || 'Failed to create password');
      }
    } catch (error) {
      toast.error('Failed to create password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 font-serif text-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent font-serif">Profile Settings</h1>
          <p className="text-xl text-slate-600 font-light">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-24 h-24 rounded-full object-cover shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg ${profileData.avatar ? 'hidden' : ''}`}>
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 font-serif">{profileData.name}</h2>
                <p className="text-slate-600 break-words max-w-xs mx-auto text-sm truncate font-light">
                  {profileData.email}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 font-serif">
                    ✓ Verified Account
                  </span>
                </div>
                {user?.googleId && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 font-serif">
                      🔗 Google Account
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 font-serif">Profile Information</h3>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="font-serif"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          name: user?.name || '',
                          email: user?.email || '',
                          avatar: user?.avatar || ''
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="font-serif"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input
                  label="Name"
                  type="text"
                  minLength={2}
                  maxLength={18}
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  disabled={true}
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 font-serif">Email cannot be changed for security reasons</p>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 font-serif"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>

            {/* Password Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 font-serif">Password</h3>
                {!isChangingPassword && !isCreatingPassword && (
                  <Button
                    onClick={() => {
                      if (hasPassword) {
                        setIsChangingPassword(true);
                      } else {
                        setIsCreatingPassword(true);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="font-serif"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {hasPassword ? 'Change Password' : 'Create Password'}
                  </Button>
                )}
              </div>

              {!isChangingPassword && !isCreatingPassword ? (
                <div>
                  {hasPassword ? (
                    <p className="text-slate-600 font-serif">
                      Keep your account secure by using a strong password and changing it regularly.
                    </p>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm font-serif">
                        <strong>Google Account:</strong> You signed up with Google. Create a password to enable 
                        direct login to your account.
                      </p>
                    </div>
                  )}
                </div>
              ) : isCreatingPassword ? (
                <form onSubmit={handleCreatePassword} className="space-y-4">
                  <div className="relative">
                    <Input
                      label="New Password"
                      maxLength={32}
                      type={showNewPassword ? 'text' : 'password'}
                      value={createPasswordData.newPassword}
                      onChange={(e) => setCreatePasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirm New Password"
                      maxLength={32}
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={createPasswordData.confirmPassword}
                      onChange={(e) => setCreatePasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsCreatingPassword(false);
                        setCreatePasswordData({
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      variant="outline"
                      className="font-serif"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 font-serif"
                    >
                      Create Password
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Current Password"
                      maxLength={32}
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="New Password"
                      maxLength={32}
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirm New Password"
                      maxLength={32}
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      variant="outline"
                      className="font-serif"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 font-serif"
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Account Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-4 font-serif">Account Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-600 font-serif">{orderCount}</div>
                  <div className="text-sm text-slate-600 font-serif">Orders Placed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600 font-serif">
                    {new Date(user?.createdAt || Date.now()).getFullYear()}
                  </div>
                  <div className="text-sm text-slate-600 font-serif">Member Since</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

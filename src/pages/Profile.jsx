import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaStore,
  FaPhone,
  FaEnvelope,
  FaMapMarker,
  FaCalendar,
  FaUpload,
  FaKey,
  FaBell,
  FaShieldAlt
} from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import "../styles/Profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  // --- User state
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    joined: "",
    avatarUrl: ""
  });

  // --- Seller details
  const [sellerDetails, setSellerDetails] = useState({
    shopName: "",
    category: "",
    contactEmail: "",
    phone: "",
    address: "",
    district: "",
    panchayath: "",
    licenseFileName: "",
    description: "",
  });
  
  const [sellerStatus, setSellerStatus] = useState("not_seller");
  const [editingSeller, setEditingSeller] = useState(false);

  // --- Activity
  const [activity, setActivity] = useState([]);
  const [showAllActivity, setShowAllActivity] = useState(false);

  // --- Quick feedback (left)
  const [quickFeedback, setQuickFeedback] = useState({ rating: 5, comment: "" });

  // --- Loading state
  const [loading, setLoading] = useState(true);
  const [savingSeller, setSavingSeller] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // --- Settings state
  const [settings, setSettings] = useState({
    showChangePassword: false,
    showNotifications: false,
    showPrivacy: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: "public"
  });

  // --- Kerala Districts
  const keralaDistricts = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
    "Kottayam", "Idukki", "Ernakulam", "Thrissur",
    "Palakkad", "Malappuram", "Kozhikode", "Wayanad",
    "Kannur", "Kasaragod"
  ];

  // Product categories
  const productCategories = [
    "Fresh Vegetables",
    "Fresh Fruits",
    "Dairy Products",
    "Poultry & Eggs",
    "Fish & Seafood",
    "Spices & Condiments",
    "Rice & Grains",
    "Honey & Bee Products",
    "Handicrafts",
    "Traditional Sweets",
    "Pickles & Preserves",
    "Medicinal Plants",
    "Coconut Products",
    "Banana Products",
    "Mango Products",
    "Jackfruit Products",
    "Coffee & Tea",
    "Homemade Snacks",
    "Bakery Items",
    "Other Products"
  ];

  useEffect(() => {
    fetchUserData();
    
    setActivity([
      { id: 1, text: "Ordered fresh vegetables from local farm", date: "2025-11-01" },
      { id: 2, text: "Posted a recipe for traditional snacks", date: "2025-10-12" },
      { id: 3, text: "Purchased organic coconut oil", date: "2025-09-30" },
      { id: 4, text: "Reviewed a local honey product", date: "2025-09-20" },
    ]);
    
    setLoading(false);
  }, [navigate]);

  // Fetch user data from backend
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      console.log("Fetching user data from backend...");
      
      // Fetch user data from backend API
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("API Response:", response.data);
      
      if (response.data && response.data.success && response.data.user) {
        const userData = response.data.user;
        console.log("User data received from API:", userData);
        
        // Update user state with data from database
        const updatedUser = {
          name: userData.name || "User",
          username: userData.email?.split('@')[0] || "username",
          email: userData.email || "Not provided",
          phone: userData.phone || "Not provided",
          bio: userData.bio || "—",
          address: userData.address || "No address provided",
          pincode: userData.pincode || "",
          joined: userData.createdAt 
            ? new Date(userData.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
          avatarUrl: userData.avatarUrl || "",
          _id: userData._id || userData.id
        };
        
        console.log("Setting user state with:", updatedUser);
        setUser(updatedUser);
        
        // Update localStorage with complete user data
        localStorage.setItem("user", JSON.stringify({
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          ...updatedUser
        }));
        
        // Load seller data for this user
        loadSellerDataForUser(updatedUser._id);
      } else {
        console.error("Invalid API response structure:", response.data);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Failed to fetch user from backend:", error);
      
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      
      // Fallback: Try to get data from localStorage
      console.log("Trying fallback to localStorage...");
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log("Using localStorage data:", parsedUser);
          setUser({
            name: parsedUser.name || "User",
            username: parsedUser.username || parsedUser.email?.split('@')[0] || "username",
            email: parsedUser.email || "Not provided",
            phone: parsedUser.phone || "Not provided",
            bio: parsedUser.bio || "—",
            address: parsedUser.address || "No address provided",
            pincode: parsedUser.pincode || "",
            joined: parsedUser.joined || new Date().toLocaleDateString(),
            avatarUrl: parsedUser.avatarUrl || "",
            _id: parsedUser._id
          });
        } catch (e) {
          console.error("Error parsing localStorage user data:", e);
        }
      }
    }
  };

  // Update user profile in database
  const updateUserProfile = async (field, value) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login again");
      return false;
    }
    
    setSavingProfile(true);
    
    try {
      console.log(`Updating ${field} to:`, value);
      
      // Prepare update data
      const updateData = { [field]: value };
      
      // Update in backend
      const response = await axios.put(
        `http://localhost:5000/api/user/profile`,
        updateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Backend update response:", response.data);
      
      if (response.data && response.data.success) {
        // Update local state
        setUser(prev => ({ ...prev, [field]: value }));
        
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({
          ...currentUser,
          [field]: value
        }));
        
        console.log(`${field} updated successfully in database`);
        return true;
      } else {
        alert(response.data?.message || "Failed to update profile");
        return false;
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        alert(error.response.data?.message || `Failed to update ${field}`);
      } else {
        alert(`Network error: ${error.message}`);
      }
      return false;
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle edit profile
  const handleEditProfile = async () => {
    // Create a form for editing multiple fields
    const editForm = document.createElement("div");
    editForm.innerHTML = `
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Name</label>
        <input type="text" id="editName" value="${user.name}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Phone</label>
        <input type="text" id="editPhone" value="${user.phone}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Address</label>
        <textarea id="editAddress" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">${user.address}</textarea>
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Bio</label>
        <textarea id="editBio" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">${user.bio}</textarea>
      </div>
    `;
    
    const { value: formValues } = await Swal.fire({
      title: 'Edit Profile',
      html: editForm,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          name: document.getElementById('editName').value,
          phone: document.getElementById('editPhone').value,
          address: document.getElementById('editAddress').value,
          bio: document.getElementById('editBio').value
        };
      }
    });
    
    if (formValues) {
      // Show loading
      Swal.fire({
        title: 'Saving...',
        text: 'Updating your profile',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      try {
        // Update each field in database
        const updates = [];
        
        if (formValues.name !== user.name) {
          updates.push(updateUserProfile("name", formValues.name));
        }
        
        if (formValues.phone !== user.phone) {
          updates.push(updateUserProfile("phone", formValues.phone));
        }
        
        if (formValues.address !== user.address) {
          updates.push(updateUserProfile("address", formValues.address));
        }
        
        if (formValues.bio !== user.bio) {
          updates.push(updateUserProfile("bio", formValues.bio));
        }
        
        // Wait for all updates to complete
        await Promise.all(updates);
        
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your changes have been saved to your account.',
          timer: 2000,
          showConfirmButton: false
        });
        
      } catch (error) {
        console.error("Error updating profile:", error);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Could not save changes. Please try again.',
        });
      }
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Change Password',
      html: `
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Current Password</label>
          <input type="password" id="currentPassword" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">New Password</label>
          <input type="password" id="newPassword" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Confirm New Password</label>
          <input type="password" id="confirmPassword" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Change Password',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Please fill all fields');
          return false;
        }
        
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('New passwords do not match');
          return false;
        }
        
        if (newPassword.length < 6) {
          Swal.showValidationMessage('Password must be at least 6 characters');
          return false;
        }
        
        return { currentPassword, newPassword };
      }
    });
    
    if (formValues) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:5000/api/user/change-password`,
          {
            currentPassword: formValues.currentPassword,
            newPassword: formValues.newPassword
          },
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Password Changed!',
            text: 'Your password has been updated successfully.',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: response.data.message || 'Could not change password',
          });
        }
      } catch (error) {
        console.error("Error changing password:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to change password',
        });
      }
    }
  };

  // Handle notification settings
  const handleNotificationSettings = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Notification Settings',
      html: `
        <div style="text-align: left; margin-bottom: 15px;">
          <label style="display: flex; align-items: center; margin-bottom: 10px;">
            <input type="checkbox" id="emailNotifications" ${settings.emailNotifications ? 'checked' : ''} style="margin-right: 10px;" />
            Email Notifications
          </label>
          <label style="display: flex; align-items: center;">
            <input type="checkbox" id="pushNotifications" ${settings.pushNotifications ? 'checked' : ''} style="margin-right: 10px;" />
            Push Notifications
          </label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          emailNotifications: document.getElementById('emailNotifications').checked,
          pushNotifications: document.getElementById('pushNotifications').checked
        };
      }
    });
    
    if (formValues) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:5000/api/user/notification-settings`,
          formValues,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          setSettings(prev => ({ ...prev, ...formValues }));
          Swal.fire({
            icon: 'success',
            title: 'Settings Saved!',
            text: 'Your notification preferences have been updated.',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error("Error saving notification settings:", error);
        // Still update local state
        setSettings(prev => ({ ...prev, ...formValues }));
        Swal.fire({
          icon: 'info',
          title: 'Settings Saved Locally',
          text: 'Your preferences have been saved locally.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    }
  };

  // Handle privacy settings
  const handlePrivacySettings = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Privacy Settings',
      html: `
        <div style="text-align: left; margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 10px; font-weight: 500;">Profile Visibility</label>
          <select id="profileVisibility" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <option value="public" ${settings.profileVisibility === 'public' ? 'selected' : ''}>Public - Anyone can see your profile</option>
            <option value="community" ${settings.profileVisibility === 'community' ? 'selected' : ''}>Community - Only Gramika members</option>
            <option value="private" ${settings.profileVisibility === 'private' ? 'selected' : ''}>Private - Only you</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          profileVisibility: document.getElementById('profileVisibility').value
        };
      }
    });
    
    if (formValues) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:5000/api/user/privacy-settings`,
          formValues,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          setSettings(prev => ({ ...prev, ...formValues }));
          Swal.fire({
            icon: 'success',
            title: 'Settings Saved!',
            text: 'Your privacy settings have been updated.',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error("Error saving privacy settings:", error);
        // Still update local state
        setSettings(prev => ({ ...prev, ...formValues }));
        Swal.fire({
          icon: 'info',
          title: 'Settings Saved Locally',
          text: 'Your preferences have been saved locally.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    }
  };

  // Load seller data for specific user
  const loadSellerDataForUser = (userId) => {
    try {
      // Get seller data from localStorage with user-specific key
      const sellerKey = `sellerData_${userId}`;
      const sellerData = localStorage.getItem(sellerKey);
      
      if (sellerData) {
        const data = JSON.parse(sellerData);
        console.log("Loaded seller data for user:", userId, data);
        
        setSellerDetails(data.details || {});
        setSellerStatus(data.status || "not_seller");
      } else {
        // Try legacy key for backward compatibility
        const legacySellerData = localStorage.getItem("sellerData");
        if (legacySellerData) {
          try {
            const data = JSON.parse(legacySellerData);
            // Only use if it belongs to this user
            if (data.userId === userId) {
              setSellerDetails(data.details || {});
              setSellerStatus(data.status || "not_seller");
              // Migrate to user-specific key
              localStorage.setItem(`sellerData_${userId}`, JSON.stringify(data));
              localStorage.removeItem("sellerData");
            }
          } catch (e) {
            console.error("Error parsing legacy seller data:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error loading seller data:", error);
      setSellerStatus("not_seller");
      setSellerDetails({
        shopName: "",
        category: "",
        contactEmail: "",
        phone: "",
        address: "",
        district: "",
        panchayath: "",
        licenseFileName: "",
        description: "",
      });
    }
  };

  // --- Handlers
  const handleSellerInput = (e) => {
    const { name, value } = e.target;
    
    if (name === "district") {
      setSellerDetails((prev) => ({ 
        ...prev, 
        [name]: value,
        panchayath: ""
      }));
    } else {
      setSellerDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLicenseUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSellerDetails((prev) => ({ ...prev, licenseFileName: file.name }));
    }
  };

  // --- Save seller info
  const saveSeller = async () => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData._id || userData.email;
    
    if (!userId) {
      alert("User not identified. Please login again.");
      return;
    }
    
    // Validation
    if (!sellerDetails.shopName || !sellerDetails.contactEmail) {
      alert("Please provide Shop Name and Contact Email.");
      return;
    }
    
    if (!sellerDetails.district) {
      alert("Please select your District.");
      return;
    }
    
    if (!sellerDetails.panchayath) {
      alert("Please enter your Panchayath.");
      return;
    }
    
    if (!sellerDetails.category) {
      alert("Please select a product category.");
      return;
    }
    
    setSavingSeller(true);
    
    const sellerData = {
      shopName: sellerDetails.shopName,
      category: sellerDetails.category,
      contactEmail: sellerDetails.contactEmail,
      phone: sellerDetails.phone || user.phone,
      address: sellerDetails.address || user.address,
      district: sellerDetails.district,
      panchayath: sellerDetails.panchayath,
      licenseFileName: sellerDetails.licenseFileName,
      description: sellerDetails.description,
      userId: userId, // Store user ID for uniqueness
      status: "pending"
    };
    
    try {
      // Try to save to backend first
      const res = await axios.post(
        "http://localhost:5000/api/seller/register",
        sellerData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.data.success) {
        // Save to localStorage with user-specific key
        const sellerKey = `sellerData_${userId}`;
        const fullSellerData = {
          details: sellerData,
          status: "pending",
          userId: userId,
          submittedAt: new Date().toISOString()
        };
        
        localStorage.setItem(sellerKey, JSON.stringify(fullSellerData));
        
        alert(`✅ Seller registration submitted!\n\n📍 Location: ${sellerData.panchayath}, ${sellerData.district}\n\nYour application is now pending admin approval.`);
        
        setSellerStatus("pending");
        setEditingSeller(false);
        
      } else {
        alert(res.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Backend error, saving locally:", err);
      
      // Save to localStorage with user-specific key
      const sellerKey = `sellerData_${userId}`;
      const fullSellerData = {
        details: sellerData,
        status: "pending",
        userId: userId,
        submittedAt: new Date().toISOString()
      };
      
      localStorage.setItem(sellerKey, JSON.stringify(fullSellerData));
      
      alert(`✅ Seller registration submitted!\n\n📍 Location: ${sellerData.panchayath}, ${sellerData.district}\n\nYour application is now pending admin approval.`);
      
      setSellerStatus("pending");
      setEditingSeller(false);
      
    } finally {
      setSavingSeller(false);
    }
  };

  // --- Check verification status
  const checkVerificationStatus = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData._id || userData.email;
    
    if (!userId) {
      alert("User not identified.");
      return;
    }
    
    const sellerKey = `sellerData_${userId}`;
    const sellerData = localStorage.getItem(sellerKey);
    
    if (sellerData) {
      try {
        const data = JSON.parse(sellerData);
        alert(`📋 Seller Application Status\n\n📍 Location: ${data.details?.panchayath || 'Not specified'}, ${data.details?.district || 'Not specified'}\n📅 Submitted: ${new Date(data.submittedAt).toLocaleString()}\n📊 Status: ${data.status.toUpperCase()}\n\nYour application is currently under review.`);
      } catch (e) {
        console.error("Error parsing seller data:", e);
        alert("Error loading seller application data.");
      }
    } else {
      alert("No seller application found for your account.");
    }
  };

  const quickFeedbackSubmit = (e) => {
    e.preventDefault();
    alert("Thanks for your feedback!");
    setQuickFeedback({ rating: 5, comment: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Note: We don't remove seller data as it's user-specific and should persist
    navigate("/login");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-wrapper">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  const displayedActivity = showAllActivity ? activity : activity.slice(0, 3);

  return (
    <div className="profile-page">
      <div className="profile-wrapper">
        {/* HEADER */}
        <div className="profile-cover">
          <div className="cover-img" />
          <div className="profile-header">
            <div className="avatar-container">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
              ) : (
                <FaUserCircle className="avatar-placeholder" size={80} />
              )}
            </div>

            <div className="profile-main-info">
              <h1 style={{margin: '0 0 5px 0', fontSize: '28px'}}>{user.name || "User"}</h1>
              <span style={{color: '#666', fontSize: '14px'}}>@{user.username || "username"}</span>
              <p style={{margin: '10px 0', color: '#555'}}>{user.bio || "—"}</p>
            </div>

            <div className="profile-actions">
              <button className="edit-btn" onClick={handleEditProfile}>
                <CiEdit /> Edit Profile
              </button>

              {sellerStatus !== "not_seller" ? (
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                  <button 
                    onClick={() => setEditingSeller(true)}
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Seller Info
                  </button>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: sellerStatus === 'pending' ? '#fff3cd' : 
                              sellerStatus === 'approved' ? '#d4edda' : 
                              sellerStatus === 'rejected' ? '#f8d7da' : '#e9ecef',
                    color: sellerStatus === 'pending' ? '#856404' : 
                          sellerStatus === 'approved' ? '#155724' : 
                          sellerStatus === 'rejected' ? '#721c24' : '#495057'
                  }}>
                    {sellerStatus === "pending" ? "⏳ Pending" : 
                     sellerStatus === "approved" ? "✅ Verified" : 
                     sellerStatus === "rejected" ? "❌ Rejected" : 
                     "Registered"}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setEditingSeller(true)}
                  style={{
                    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '600'
                  }}
                >
                  <FaStore /> Register as Seller
                </button>
              )}
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="profile-grid a2-layout">
          {/* LEFT COL */}
          <div className="left-col">
            {/* User Details */}
            <div className="card user-details" style={{borderRadius: '10px', border: '1px solid #e0e0e0'}}>
              <h2 style={{margin: '0 0 20px 0', color: '#333', fontSize: '20px'}}>User Details</h2>
              
              <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#e3f2fd',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: '0'
                }}>
                  <FaEnvelope style={{color: '#1976d2'}} />
                </div>
                <div>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Email Address</div>
                  <div style={{fontWeight: '500', color: '#333', fontSize: '15px'}}>
                    {user.email === "Not provided" ? (
                      <button 
                        onClick={async () => {
                          const newEmail = prompt("Enter your email:", user.email);
                          if (newEmail !== null && newEmail.trim() !== "") {
                            const success = await updateUserProfile("email", newEmail);
                            if (success) alert("Email updated!");
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #1976d2',
                          color: '#1976d2',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Add Email
                      </button>
                    ) : user.email}
                  </div>
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#e8f5e9',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: '0'
                }}>
                  <FaPhone style={{color: '#4caf50'}} />
                </div>
                <div>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Phone Number</div>
                  <div style={{fontWeight: '500', color: '#333', fontSize: '15px'}}>
                    {user.phone === "Not provided" ? (
                      <button 
                        onClick={async () => {
                          const newPhone = prompt("Enter your phone number:", user.phone);
                          if (newPhone !== null && newPhone.trim() !== "") {
                            const success = await updateUserProfile("phone", newPhone);
                            if (success) alert("Phone number updated!");
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #4caf50',
                          color: '#4caf50',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Add Phone
                      </button>
                    ) : user.phone}
                  </div>
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#fff3e0',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: '0'
                }}>
                  <FaMapMarker style={{color: '#ff9800'}} />
                </div>
                <div>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Address</div>
                  <div style={{fontWeight: '500', color: '#333', fontSize: '15px'}}>
                    {user.address === "No address provided" ? (
                      <button 
                        onClick={async () => {
                          const newAddress = prompt("Enter your address:", user.address);
                          if (newAddress !== null && newAddress.trim() !== "") {
                            const success = await updateUserProfile("address", newAddress);
                            if (success) alert("Address updated!");
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #ff9800',
                          color: '#ff9800',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Add Address
                      </button>
                    ) : user.address}
                  </div>
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'flex-start'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#f3e5f5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: '0'
                }}>
                  <FaCalendar style={{color: '#9c27b0'}} />
                </div>
                <div>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Member Since</div>
                  <div style={{fontWeight: '500', color: '#333', fontSize: '15px'}}>{user.joined}</div>
                </div>
              </div>
            </div>

            {/* Quick Feedback */}
            <div className="card compact-feedback">
              <h3>Quick Feedback</h3>
              <form onSubmit={quickFeedbackSubmit}>
                <div className="rating-stars small">
                  {[1,2,3,4,5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`star-btn ${quickFeedback.rating >= s ? "active" : ""}`}
                      onClick={() => setQuickFeedback(p => ({...p, rating: s}))}
                    >★</button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience with our platform..."
                  value={quickFeedback.comment}
                  onChange={(e) => setQuickFeedback(p => ({...p, comment: e.target.value}))}
                  rows={3}
                />
                <div className="compact-feedback-actions">
                  <button type="submit" className="submit-feedback-btn small">Send Feedback</button>
                </div>
              </form>
            </div>

            {/* Account Settings - WORKING VERSION */}
            <div className="card settings-card left-settings">
              <h3>Account Settings</h3>
              <div className="settings-options">
                <button onClick={handleChangePassword}>
                  <FaKey style={{marginRight: '8px'}} /> Change Password
                </button>
                <button onClick={handleNotificationSettings}>
                  <FaBell style={{marginRight: '8px'}} /> Notifications
                </button>
                <button onClick={handlePrivacySettings}>
                  <FaShieldAlt style={{marginRight: '8px'}} /> Privacy
                </button>
                <button className="danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>

          {/* RIGHT COL - Seller Registration */}
          <div className="right-col">
            <div className="card seller-info-card" style={{
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              {/* Seller Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                borderBottom: '1px solid #e0e0e0',
                background: '#f8f9fa'
              }}>
                <FaStore style={{color: '#4CAF50', fontSize: '24px', marginRight: '12px'}} />
                <h2 style={{margin: 0, fontSize: '22px', color: '#333'}}>Seller Registration</h2>
                {sellerStatus !== "not_seller" && (
                  <span style={{
                    marginLeft: 'auto',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: sellerStatus === 'pending' ? '#fff3cd' : 
                              sellerStatus === 'approved' ? '#d4edda' : 
                              '#f8d7da',
                    color: sellerStatus === 'pending' ? '#856404' : 
                          sellerStatus === 'approved' ? '#155724' : 
                          '#721c24'
                  }}>
                    {sellerStatus === "pending" ? "⏳ Pending Approval" : 
                     sellerStatus === "approved" ? "✅ Verified" : 
                     "❌ Rejected"}
                  </span>
                )}
              </div>

              {!editingSeller ? (
                <div style={{padding: '20px'}}>
                  {sellerStatus === "not_seller" ? (
                    <div style={{textAlign: 'center', padding: '30px 20px'}}>
                      <div style={{
                        color: '#4CAF50',
                        opacity: '0.8',
                        marginBottom: '20px'
                      }}>
                        <FaStore size={60} />
                      </div>
                      <h3 style={{margin: '0 0 15px 0', color: '#333'}}>Start Selling Today</h3>
                      <p style={{
                        color: '#666',
                        lineHeight: '1.6',
                        margin: '0 auto 25px auto',
                        maxWidth: '500px'
                      }}>
                        Register as a seller to list your products and reach customers directly. 
                        Connect with buyers in your local community.
                      </p>
                      
                      <button 
                        onClick={() => setEditingSeller(true)}
                        style={{
                          background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                          color: 'white',
                          border: 'none',
                          padding: '14px 32px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '16px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <FaStore /> Start Selling
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Seller Profile Header */}
                      <div style={{marginBottom: '25px'}}>
                        <h3 style={{margin: '0 0 8px 0', color: '#333', fontSize: '24px'}}>
                          {sellerDetails.shopName || "Your Shop"}
                        </h3>
                        <div style={{display: 'flex', alignItems: 'center', color: '#666', fontSize: '14px'}}>
                          <FaMapMarkerAlt style={{marginRight: '8px'}} /> 
                          {sellerDetails.panchayath || "Not specified"}, {sellerDetails.district || "Not specified"}
                        </div>
                      </div>
                      
                      {/* Seller Details Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '25px'
                      }}>
                        <div style={{
                          background: '#f8f9fa',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            fontSize: '20px',
                            width: '40px',
                            height: '40px',
                            background: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>📦</div>
                          <div>
                            <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Category</div>
                            <div style={{fontWeight: '600', color: '#333'}}>{sellerDetails.category || "—"}</div>
                          </div>
                        </div>
                        
                        <div style={{
                          background: '#f8f9fa',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            fontSize: '20px',
                            width: '40px',
                            height: '40px',
                            background: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>📧</div>
                          <div>
                            <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Contact Email</div>
                            <div style={{fontWeight: '600', color: '#333'}}>{sellerDetails.contactEmail || "—"}</div>
                          </div>
                        </div>
                        
                        <div style={{
                          background: '#f8f9fa',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            fontSize: '20px',
                            width: '40px',
                            height: '40px',
                            background: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>📱</div>
                          <div>
                            <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Contact Phone</div>
                            <div style={{fontWeight: '600', color: '#333'}}>{sellerDetails.phone || user.phone || "—"}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Description */}
                      {sellerDetails.description && (
                        <div style={{
                          background: '#f8f9fa',
                          borderRadius: '8px',
                          padding: '20px',
                          marginBottom: '25px'
                        }}>
                          <h4 style={{margin: '0 0 12px 0', color: '#333'}}>About Your Products</h4>
                          <p style={{color: '#555', lineHeight: '1.6', margin: 0}}>{sellerDetails.description}</p>
                        </div>
                      )}
                      
                      {/* Status Card */}
                      <div style={{
                        background: '#f0f7ff',
                        borderRadius: '8px',
                        padding: '20px',
                        marginTop: '25px'
                      }}>
                        <div style={{display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px'}}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            marginTop: '6px',
                            flexShrink: '0',
                            background: sellerStatus === 'pending' ? '#ffc107' : 
                                      sellerStatus === 'approved' ? '#28a745' : 
                                      '#dc3545'
                          }}></div>
                          <div style={{flex: 1}}>
                            <h4 style={{margin: '0 0 8px 0', color: '#333'}}>Verification Status</h4>
                            <p style={{color: '#555', lineHeight: '1.5', margin: 0, fontSize: '14px'}}>
                              {sellerStatus === "pending" 
                                ? "Your application is being reviewed by our team. This usually takes 1-3 business days." 
                                : sellerStatus === "approved" 
                                ? "Your seller account has been verified. You can now list your products."
                                : "Your application needs additional information. Please update your details."}
                            </p>
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: '12px'}}>
                          <button 
                            onClick={() => setEditingSeller(true)}
                            style={{
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '6px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            Edit Details
                          </button>
                          {sellerStatus === "pending" && (
                            <button
                              onClick={checkVerificationStatus}
                              style={{
                                background: 'transparent',
                                color: '#4CAF50',
                                border: '2px solid #4CAF50',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Check Status
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{padding: '20px'}}>
                  {/* Form Header */}
                  <div style={{marginBottom: '32px'}}>
                    <h3 style={{margin: '0 0 8px 0', color: '#333', fontSize: '24px'}}>
                      {sellerStatus === "not_seller" ? "Register as Seller" : "Update Seller Details"}
                    </h3>
                    <p style={{color: '#666', margin: 0, fontSize: '14px'}}>Share your products with the community</p>
                  </div>
                  
                  {/* Form Grid */}
                  <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
                    {/* Basic Information Section */}
                    <div style={{paddingBottom: '24px', borderBottom: '1px solid #e0e0e0'}}>
                      <h4 style={{margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: '600'}}>Basic Information</h4>
                      
                      <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>Shop Name *</label>
                        <input 
                          name="shopName" 
                          value={sellerDetails.shopName} 
                          onChange={handleSellerInput} 
                          placeholder="Enter your shop name" 
                          required 
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                        />
                        <small style={{display: 'block', marginTop: '6px', color: '#666', fontSize: '12px'}}>What would you like to call your shop?</small>
                      </div>
                      
                      <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>Product Category *</label>
                        <select
                          name="category"
                          value={sellerDetails.category}
                          onChange={handleSellerInput}
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="">What products do you sell?</option>
                          {productCategories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Location Details Section */}
                    <div style={{paddingBottom: '24px', borderBottom: '1px solid #e0e0e0'}}>
                      <h4 style={{margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: '600'}}>Location Details</h4>
                      
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                        <div>
                          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>District *</label>
                          <select
                            name="district"
                            value={sellerDetails.district}
                            onChange={handleSellerInput}
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '14px',
                              boxSizing: 'border-box'
                            }}
                          >
                            <option value="">Select your district</option>
                            {keralaDistricts.map((district, index) => (
                              <option key={index} value={district}>{district}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>Panchayath *</label>
                          <input
                            name="panchayath"
                            value={sellerDetails.panchayath}
                            onChange={handleSellerInput}
                            placeholder="Enter your panchayath"
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '14px',
                              boxSizing: 'border-box'
                            }}
                          />
                          <small style={{display: 'block', marginTop: '6px', color: '#666', fontSize: '12px'}}>Enter the name of your local panchayath</small>
                        </div>
                      </div>
                      
                      <div>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>Address</label>
                        <textarea 
                          name="address" 
                          value={sellerDetails.address} 
                          onChange={handleSellerInput} 
                          placeholder="Your complete address with landmarks" 
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Contact Information Section */}
                    <div style={{paddingBottom: '24px', borderBottom: '1px solid #e0e0e0'}}>
                      <h4 style={{margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: '600'}}>Contact Information</h4>
                      
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                        <div>
                          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>Contact Email *</label>
                          <input 
                            name="contactEmail" 
                            value={sellerDetails.contactEmail} 
                            onChange={handleSellerInput} 
                            placeholder="your-email@example.com" 
                            required 
                            type="email"
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '14px',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        
                        <div>
                          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>Contact Phone</label>
                          <input 
                            name="phone" 
                            value={sellerDetails.phone} 
                            onChange={handleSellerInput} 
                            placeholder="+91 XXXXX XXXXX" 
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '14px',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Details Section */}
                    <div>
                      <h4 style={{margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: '600'}}>Additional Details</h4>
                      
                      <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>About Your Products</label>
                        <textarea 
                          name="description" 
                          value={sellerDetails.description} 
                          onChange={handleSellerInput} 
                          placeholder="Tell customers about your products, how you make them, and what makes them special..." 
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            resize: 'vertical'
                          }}
                        />
                        <small style={{display: 'block', marginTop: '6px', color: '#666', fontSize: '12px'}}>This will be displayed on your seller profile</small>
                      </div>
                      
                      <div>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333'}}>Certificate/License (Optional)</label>
                        <div style={{
                          border: '2px dashed #ddd',
                          borderRadius: '6px',
                          padding: '20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          marginBottom: '8px'
                        }}
                        onClick={() => document.getElementById('license-upload').click()}
                        >
                          <input 
                            type="file" 
                            onChange={handleLicenseUpload} 
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{display: 'none'}}
                            id="license-upload"
                          />
                          <FaUpload style={{fontSize: '24px', color: '#666', marginBottom: '10px'}} />
                          <div style={{color: '#666', fontSize: '14px'}}>
                            {sellerDetails.licenseFileName || "Click to upload certificate or license"}
                          </div>
                        </div>
                        {sellerDetails.licenseFileName && (
                          <div style={{
                            background: '#e8f5e9',
                            padding: '10px',
                            borderRadius: '6px',
                            marginTop: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            📄 {sellerDetails.licenseFileName}
                          </div>
                        )}
                        <small style={{display: 'block', marginTop: '6px', color: '#666', fontSize: '12px'}}>Upload FSSAI license, organic certificate, or other relevant documents</small>
                      </div>
                    </div>
                  </div>
                  
                  {/* Form Notice */}
                  <div style={{
                    background: '#e3f2fd',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '30px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{fontSize: '20px'}}>ℹ️</div>
                    <div>
                      <div style={{fontWeight: '600', marginBottom: '4px', color: '#1976d2'}}>Important Information:</div>
                      <div style={{color: '#555', fontSize: '14px', lineHeight: '1.5'}}>
                        Your application will be reviewed by our team. You'll receive notification once approved. 
                        Please ensure all information provided is accurate.
                      </div>
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div style={{display: 'flex', gap: '12px', marginTop: '30px'}}>
                    <button 
                      onClick={saveSeller} 
                      disabled={savingSeller}
                      style={{
                        flex: 1,
                        background: savingSeller ? '#ccc' : 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                        color: 'white',
                        border: 'none',
                        padding: '14px 20px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '16px',
                        cursor: savingSeller ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                    >
                      {savingSeller ? (
                        <>
                          <span style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></span>
                          Submitting...
                        </>
                      ) : sellerStatus === "not_seller" ? (
                        "Submit Application"
                      ) : (
                        "Update Details"
                      )}
                    </button>
                    <button 
                      onClick={() => setEditingSeller(false)} 
                      style={{
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '14px 20px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Activity */}
            <div className="card activity-card" style={{marginTop: '20px'}}>
              <h3>Recent Activity</h3>
              <div>
                {displayedActivity.map(act => (
                  <div key={act.id} style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{color: '#333'}}>{act.text}</div>
                    <div style={{color: '#666', fontSize: '12px'}}>{act.date}</div>
                  </div>
                ))}
              </div>
              {activity.length > 3 && (
                <button 
                  onClick={() => setShowAllActivity(!showAllActivity)} 
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'transparent',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    marginTop: '15px',
                    cursor: 'pointer'
                  }}
                >
                  {showAllActivity ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Briefcase, Award, Save, CheckCircle } from 'lucide-react';

function Profile() {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || '',
    experienceLevel: user?.experienceLevel || 'fresher',
    skills: user?.skills?.join(', ') || ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const result = await updateUser({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const experienceLevels = [
    { id: 'fresher', label: 'Fresher (0-1 years)' },
    { id: 'junior', label: 'Junior (1-3 years)' },
    { id: 'mid', label: 'Mid-Level (3-5 years)' },
    { id: 'senior', label: 'Senior (5-8 years)' },
    { id: 'lead', label: 'Lead/Principal (8+ years)' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-700">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={user?.email}
                className="input pl-10 bg-gray-50"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="label">Target Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="input pl-10"
                placeholder="e.g., Software Engineer, Product Manager"
              />
            </div>
          </div>

          <div>
            <label className="label">Experience Level</label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="input pl-10"
              >
                {experienceLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Skills</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="input min-h-[100px]"
              placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate skills with commas. This helps personalize your interview questions.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Stats */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Member since</span>
            <span className="text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account ID</span>
            <span className="text-gray-900 font-mono text-xs">{user?.id || user?._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

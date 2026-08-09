import { useState } from 'react';
import { Container, Typography, Tabs, Tab, TextField, Button, Alert, Stack } from '@mui/material';
import { useAuth } from '../../assets/Auth/authContext';
import { updateUser, changePassword } from '../../assets/User/user';
import './ProfilePage.css';

function ProfilePage() {
  const { user, updateUserContext } = useAuth();
  const [tab, setTab] = useState('overview');

  if (!user) return null;

  return (
    <Container maxWidth="sm" className="profile-page page-enter py-8">
      <Typography variant="h5" sx={{ color: 'var(--text-h)' }}>
        Account settings
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--text)', mb: 3 }}>
        Manage your info and password.
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, value) => setTab(value)}
        className="profile-tabs"
        TabIndicatorProps={{ style: { backgroundColor: 'var(--accent)' } }}
      >
        <Tab value="overview" label="Overview" sx={{ color: 'var(--text)', textTransform: 'none' }} />
        <Tab value="security" label="Security" sx={{ color: 'var(--text)', textTransform: 'none' }} />
      </Tabs>

      <div className="profile-tab-panel">
        {tab === 'overview' ? (
          <OverviewTab user={user} onSave={updateUserContext} />
        ) : (
          <SecurityTab user={user} />
        )}
      </div>
    </Container>
  );
}

function OverviewTab({ user, onSave }) {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const isDirty =
    firstName !== (user.firstName || '') ||
    lastName !== (user.lastName || '') ||
    username !== (user.username || '') ||
    email !== (user.email || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!firstName || !lastName || !username || !email) {
      setError('Please fill in all fields.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateUser(user.id, { firstName, lastName, username, email });
      onSave(updated);
      setSuccess('Profile updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
        </Stack>

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField label="Role" value={user.role} fullWidth disabled />

        <Button type="submit" variant="contained" disabled={!isDirty || saving} sx={{ alignSelf: 'flex-start' }}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </Stack>
    </form>
  );
}

function SecurityTab({ user }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const resetFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      await changePassword(user.id, currentPassword, newPassword);
      setSuccess('Password updated.');
      resetFields();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Stack spacing={2}>
        <TextField
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
        />

        <Button type="submit" variant="contained" disabled={saving} sx={{ alignSelf: 'flex-start' }}>
          {saving ? 'Updating...' : 'Update password'}
        </Button>
      </Stack>
    </form>
  );
}

export default ProfilePage;

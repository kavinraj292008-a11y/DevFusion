import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    employmentType: 'Full-time' as const,
    experienceLevel: 'Mid' as const,
    status: 'published' as const,
    skills: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await jobService.createJob({
        title: form.title,
        description: form.description,
        department: form.department,
        location: form.location,
        employmentType: form.employmentType,
        experienceLevel: form.experienceLevel,
        status: form.status,
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      navigate('/recruiter/jobs');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg space-y-4 glass-panel p-6 rounded-xl"
    >
      <h1 className="text-xl font-bold text-white">Create New Job Listing</h1>

      {error && (
        <p className="text-sm text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Input
        label="Job Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <Input
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <Input
        label="Department"
        name="department"
        value={form.department}
        onChange={handleChange}
      />
      <Input
        label="Location"
        name="location"
        value={form.location}
        onChange={handleChange}
      />
      <Input
        label="Skills (comma-separated)"
        name="skills"
        value={form.skills}
        onChange={handleChange}
        placeholder="React, Node.js, MongoDB"
      />

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Publishing…' : 'Publish Job'}
      </Button>
    </form>
  );
};

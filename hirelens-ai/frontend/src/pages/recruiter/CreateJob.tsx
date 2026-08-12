import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { jobService } from '../../services/jobService';
import { useNavigate } from 'react-router-dom';

export const CreateJob: React.FC = () => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await jobService.createJob({ title, department, location: 'Remote', type: 'Full-time', status: 'Active', description: '', requirements: [] });
    navigate('/recruiter/jobs');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4 glass-panel p-6 rounded-xl">
      <h1 className="text-xl font-bold text-white">Create New Job Listing</h1>
      <Input label="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
      <Button type="submit">Publish Job</Button>
    </form>
  );
};
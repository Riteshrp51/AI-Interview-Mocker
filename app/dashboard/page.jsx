"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import StatsCard from './_components/StatsCard';
import QuickActions from './_components/QuickActions';
import AnalyticsSection from './_components/AnalyticsSection';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';
import WeakTopicsCard from './_components/WeakTopicsCard';
import StrongSkillsCard from './_components/StrongSkillsCard';
import RecommendationCard from './_components/RecommendationCard';
import RecentActivity from './_components/RecentActivity';
import { ClipboardList, Percent, FileSpreadsheet, Code2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [openNewInterview, setOpenNewInterview] = useState(false);

  // Fallback username
  const userName = user?.email ? user.email.split('@')[0] : 'Developer';

  return (
    <div className="space-y-8 pb-12">
      {/* Hidden Dialog Trigger Wrapper */}
      <AddNewInterview
        openDialog={openNewInterview}
        setOpenDialog={setOpenNewInterview}
        hideCard={true}
      />

      {/* Header and Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back, {userName}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Continue improving your interview skills with AI-powered mock interviews.
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Interviews"
          value="12 Rounds"
          trend="15%"
          isPositive={true}
          icon={ClipboardList}
        />
        <StatsCard
          title="Average Interview Score"
          value="82%"
          trend="8%"
          isPositive={true}
          icon={Percent}
        />
        <StatsCard
          title="Resume ATS Score"
          value="85/100"
          trend="2%"
          isPositive={true}
          icon={FileSpreadsheet}
        />
        <StatsCard
          title="Coding Score"
          value="78/100"
          trend="5%"
          isPositive={true}
          icon={Code2}
        />
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-bold text-zinc-905 dark:text-zinc-100 mb-4">Quick Actions</h2>
        <QuickActions
          onStartInterview={() => setOpenNewInterview(true)}
          onUploadResume={() => window.location.href = '/dashboard/resume-analyzer'}
          onStartCoding={() => window.location.href = '/dashboard/coding-interviews'}
          onViewRoadmap={() => window.location.href = '/dashboard/learning-roadmap'}
        />
      </div>

      {/* Two Column Layout: Charts & History / Recommendations & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Main Content Area (Left 2 Columns) */}
        <div className="xl:col-span-2 space-y-8">

          {/* Performance Analytics Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-905 dark:text-zinc-100">Performance Analytics</h2>
            <AnalyticsSection />
          </div>

          {/* Recent Mock Interviews List */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <InterviewList />
          </div>

        </div>

        {/* Sidebar Widgets Area (Right Column) */}
        <div className="space-y-6">

          {/* AI Recommendations */}
          <RecommendationCard />

          {/* recent activities */}
          <RecentActivity />

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
            <WeakTopicsCard />
            <StrongSkillsCard />
          </div>

        </div>

      </div>
    </div>
  );
}

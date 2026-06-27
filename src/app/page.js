'use client';
import React, { useState, useEffect } from 'react';
import { GitCommit, Star, FolderGit2, Flame, User } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [profile, setProfile] = useState({
    name: 'Loading...',
    public_repos: 0,
    followers: 0,
    bio: '',
    avatar_url: ''
  });
  const [totalStars, setTotalStars] = useState(0);
  const [weeklyCommits, setWeeklyCommits] = useState(0);
  const [chartData, setChartData] = useState([
    { day: 'Mon', commits: 0 },
    { day: 'Tue', commits: 0 },
    { day: 'Wed', commits: 0 },
    { day: 'Thu', commits: 0 },
    { day: 'Fri', commits: 0 },
    { day: 'Sat', commits: 0 },
    { day: 'Sun', commits: 0 },
  ]);

  useEffect(() => {
    const username = 'parashkhadka21';

    // 1. Fetch High-Level Profile Info
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setProfile({
            name: data.name || 'Parash Khadka',
            public_repos: data.public_repos || 0,
            followers: data.followers || 0,
            bio: data.bio || 'Computer Engineering Student',
            avatar_url: data.avatar_url || ''
          });
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));

    // 2. Fetch Repos to Sum Real Star Metrics
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      .then((res) => res.json())
      .then((repos) => {
        if (Array.isArray(repos)) {
          const starsSum = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
          setTotalStars(starsSum);
        }
      })
      .catch((err) => console.error("Error fetching repos:", err));

    // 3. Fetch Public Events to Extract Live Commit Frequencies
    fetch(`https://api.github.com/users/${username}/events`)
      .then((res) => res.json())
      .then((events) => {
        if (Array.isArray(events)) {
          // Initialize empty counter map for days of week
          const dayMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          let totalCommitCounter = 0;

          // Filter out push events from your log feed
          events.forEach(event => {
            if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
              const commitCount = event.payload.commits.length;
              totalCommitCounter += commitCount;

              // Parse out the weekday name of the commit
              const eventDate = new Date(event.created_at);
              const dayName = dayNames[eventDate.getDay()];
              if (dayMap[dayName] !== undefined) {
                dayMap[dayName] += commitCount;
              }
            }
          });

          // Convert processed counters map back to chart array matrix
          const updatedChart = [
            { day: 'Mon', commits: dayMap.Mon },
            { day: 'Tue', commits: dayMap.Tue },
            { day: 'Wed', commits: dayMap.Wed },
            { day: 'Thu', commits: dayMap.Thu },
            { day: 'Fri', commits: dayMap.Fri },
            { day: 'Sat', commits: dayMap.Sat },
            { day: 'Sun', commits: dayMap.Sun },
          ];

          setChartData(updatedChart);
          setWeeklyCommits(totalCommitCounter);
        }
      })
      .catch((err) => console.error("Error fetching commit events:", err));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Profile Section */}
      <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60">
        {profile.avatar_url && (
          <img 
            src={profile.avatar_url} 
            alt="Profile Avatar" 
            className="w-16 h-16 rounded-full border-2 border-blue-500"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{profile.name}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{profile.bio}</p>
        </div>
      </div>

      {/* Grid Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Repositories</p>
            <h3 className="text-2xl font-bold text-white mt-2">{profile.public_repos}</h3>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400"><FolderGit2 size={24} /></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Commits</p>
            <h3 className="text-2xl font-bold text-white mt-2">{weeklyCommits}</h3>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400"><GitCommit size={24} /></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Stars</p>
            <h3 className="text-2xl font-bold text-white mt-2">{totalStars}</h3>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400"><Star size={24} /></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Followers</p>
            <h3 className="text-2xl font-bold text-white mt-2">{profile.followers}</h3>
          </div>
          <div className="bg-rose-500/10 p-3 rounded-xl text-rose-400"><User size={24} /></div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Commit Frequency Activity</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="commits" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorCommits)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
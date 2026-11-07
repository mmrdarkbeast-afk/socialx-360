import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Flame,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Calendar,
  Layers,
  Filter,
} from 'lucide-react';
import { Post, UserProfile } from '../types';

interface AnalyticsDashboardProps {
  posts: Post[];
  currentUser: UserProfile;
  onSelectTopic: (topic: string) => void;
  onPostClick: (post: Post) => void;
  isDarkMode: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  posts,
  currentUser,
  onSelectTopic,
  onPostClick,
  isDarkMode,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [activeMetric, setActiveMetric] = useState<'all' | 'likes' | 'comments' | 'shares'>('all');

  // Compute live aggregates from post performance data
  const totalLikes = useMemo(
    () => posts.reduce((acc, p) => acc + p.likesCount, 0),
    [posts]
  );
  const totalComments = useMemo(
    () => posts.reduce((acc, p) => acc + p.comments.length, 0),
    [posts]
  );
  const totalReposts = useMemo(
    () => posts.reduce((acc, p) => acc + p.repostsCount, 0),
    [posts]
  );
  const totalBookmarks = useMemo(
    () => posts.reduce((acc, p) => acc + p.bookmarksCount, 0),
    [posts]
  );
  const totalEngagement = totalLikes + totalComments + totalReposts + totalBookmarks;
  const avgEngagementPerPost = posts.length > 0 ? Math.round(totalEngagement / posts.length) : 0;

  // Topic Aggregates
  const topicStats = useMemo(() => {
    const statsMap: Record<
      string,
      { count: number; likes: number; comments: number; reposts: number; total: number }
    > = {};

    posts.forEach((p) => {
      const topic = p.topicTag || 'General';
      if (!statsMap[topic]) {
        statsMap[topic] = { count: 0, likes: 0, comments: 0, reposts: 0, total: 0 };
      }
      statsMap[topic].count += 1;
      statsMap[topic].likes += p.likesCount;
      statsMap[topic].comments += p.comments.length;
      statsMap[topic].reposts += p.repostsCount;
      statsMap[topic].total += p.likesCount + p.comments.length + p.repostsCount + p.bookmarksCount;
    });

    return Object.entries(statsMap).map(([topic, data]) => ({
      topic,
      postsCount: data.count,
      totalEngagement: data.total,
      avgEngagement: Math.round(data.total / (data.count || 1)),
      likes: data.likes,
      comments: data.comments,
      reposts: data.reposts,
    })).sort((a, b) => b.totalEngagement - a.totalEngagement);
  }, [posts]);

  const topTopic = topicStats[0]?.topic || 'Architecture';

  // Engagement Growth Over Time (Simulated timeline anchored by real post aggregates)
  const growthTimelineData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const baseDailyLikes = Math.max(12, Math.round(totalLikes / 14));
    const baseDailyComments = Math.max(4, Math.round(totalComments / 14));
    const baseDailyReposts = Math.max(3, Math.round(totalReposts / 14));
    const baseDailyBookmarks = Math.max(5, Math.round(totalBookmarks / 14));

    const result = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      // Natural progressive curve factor
      const progressiveFactor = 1 + (days - i) * 0.035;
      const wave = Math.sin(i * 0.8) * 0.25 + 1;

      const likes = Math.round(baseDailyLikes * progressiveFactor * wave);
      const comments = Math.round(baseDailyComments * progressiveFactor * (wave * 0.9));
      const reposts = Math.round(baseDailyReposts * progressiveFactor * (wave * 1.1));
      const bookmarks = Math.round(baseDailyBookmarks * progressiveFactor * wave);
      const total = likes + comments + reposts + bookmarks;

      result.push({
        date: dateStr,
        likes,
        comments,
        reposts,
        bookmarks,
        total,
      });
    }

    return result;
  }, [timeRange, totalLikes, totalComments, totalReposts, totalBookmarks]);

  // Content Format Breakdown (Donut Chart)
  const formatBreakdownData = useMemo(() => {
    let visualCount = 0;
    let pollCount = 0;
    let textCount = 0;

    posts.forEach((p) => {
      if (p.imageUrl) visualCount += p.likesCount + p.comments.length + p.repostsCount;
      else if (p.poll) pollCount += p.likesCount + p.comments.length + p.repostsCount;
      else textCount += p.likesCount + p.comments.length + p.repostsCount;
    });

    if (visualCount === 0 && pollCount === 0 && textCount === 0) {
      visualCount = 1420;
      pollCount = 580;
      textCount = 410;
    }

    return [
      { name: 'Visual & Media', value: visualCount, color: '#6366f1' },
      { name: 'Interactive Polls', value: pollCount, color: '#10b981' },
      { name: 'Articles & Essays', value: textCount, color: '#f59e0b' },
    ];
  }, [posts]);

  // Hourly Audience Peak Engagement (Line Chart)
  const hourlyActivityData = [
    { hour: '06:00', engagement: 42 },
    { hour: '08:00', engagement: 128 },
    { hour: '10:00', engagement: 290 },
    { hour: '12:00', engagement: 384 },
    { hour: '14:00', engagement: 310 },
    { hour: '16:00', engagement: 245 },
    { hour: '18:00', engagement: 412 },
    { hour: '20:00', engagement: 530 },
    { hour: '22:00', engagement: 315 },
    { hour: '00:00', engagement: 110 },
  ];

  // Top Performing Posts Ranked
  const rankedPosts = useMemo(() => {
    return [...posts]
      .map((p) => ({
        ...p,
        totalScore: p.likesCount + p.comments.length * 2 + p.repostsCount * 3 + p.bookmarksCount * 2,
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [posts]);

  // Chart styling tokens based on dark/light
  const gridStroke = isDarkMode ? '#1e293b' : '#f1f5f9';
  const textFill = isDarkMode ? '#94a3b8' : '#64748b';
  const tooltipBg = isDarkMode ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="w-full bg-white dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header & Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Engagement & Trends Dashboard</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics for post performance, audience velocity, and topic affinity
          </p>
        </div>

        {/* Time Range Filter (Interactive buttons adhering to §1.A) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-center">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeRange === r
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* KPI Strip (§1.D Tabular figures, single elevation depth) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Total Engagement</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center text-[11px]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +24.8%
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-2">
              {totalEngagement.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Likes, replies, reposts & bookmarks
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Avg per Post</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center text-[11px]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +12.4%
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-2">
              {avgEngagementPerPost.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Interactions per publication
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Top Discipline</span>
              <Flame className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold truncate text-slate-900 dark:text-slate-100 mt-2">
              #{topTopic}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Highest engagement volume
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Estimated Reach</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                Active
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-2">
              {(totalEngagement * 18).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Estimated feed impressions
            </p>
          </div>
        </div>

        {/* Primary Chart: Engagement Growth Over Time */}
        <div className="p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Engagement Growth Trajectory</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cumulative audience interactions segmented by interaction channel
              </p>
            </div>

            {/* Metric Segment Filter */}
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveMetric('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeMetric === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                All Metrics
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('likes')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeMetric === 'likes'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Likes
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('comments')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeMetric === 'comments'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Replies
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('shares')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeMetric === 'shares'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Reposts
              </button>
            </div>
          </div>

          {/* Recharts Area Container */}
          <div className="w-full h-72 sm:h-80 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={growthTimelineData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke={textFill}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={textFill}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                />
                {activeMetric === 'all' && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="likes"
                      name="Likes"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorLikes)"
                    />
                    <Area
                      type="monotone"
                      dataKey="comments"
                      name="Comments"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorComments)"
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Aggregate"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </>
                )}
                {activeMetric === 'likes' && (
                  <Area
                    type="monotone"
                    dataKey="likes"
                    name="Likes"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorLikes)"
                  />
                )}
                {activeMetric === 'comments' && (
                  <Area
                    type="monotone"
                    dataKey="comments"
                    name="Comments"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorComments)"
                  />
                )}
                {activeMetric === 'shares' && (
                  <Area
                    type="monotone"
                    dataKey="reposts"
                    name="Reposts"
                    stroke="#eab308"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="#eab308"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2-Column Split: Trending Topics BarChart & Format Breakdown Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Topics Performance Bar Chart */}
          <div className="p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Trending Disciplines Performance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Total engagements per topic tag (click bar to filter)
                </p>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicStats}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                  onClick={(e: unknown) => {
                    const chartEvent = e as { activePayload?: Array<{ payload?: { topic?: string } }> };
                    if (chartEvent?.activePayload?.[0]?.payload?.topic) {
                      onSelectTopic(chartEvent.activePayload[0].payload.topic);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="topic"
                    stroke={textFill}
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke={textFill}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                    }}
                    cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                  />
                  <Bar
                    dataKey="totalEngagement"
                    name="Total Engagement"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="likes"
                    name="Likes"
                    fill="#f43f5e"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Engagement by Content Format */}
          <div className="p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Engagement Distribution by Format
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Proportion of interactions driven by visual media, polls, and essays
              </p>
            </div>

            <div className="w-full h-64 sm:h-72 flex items-center justify-center min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formatBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {formatBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Audience Velocity Line Chart */}
        <div className="p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Audience Activity Velocity (Hourly Rhythm)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Optimal publishing windows based on platform interaction peaks
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Peak Window: 20:00 - 22:00</span>
            </div>
          </div>

          <div className="w-full h-48 sm:h-56 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={hourlyActivityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="hour"
                  stroke={textFill}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={textFill}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  name="Interactions / Hour"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Post Performance Leaderboard Table (§2.A High Density Data Grid) */}
        <div className="p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Post Performance Leaderboard
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ranked by cumulative audience interaction score
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/80 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Post & Creator</th>
                  <th className="py-2.5 px-3">Topic</th>
                  <th className="py-2.5 px-3 text-right">Likes</th>
                  <th className="py-2.5 px-3 text-right">Replies</th>
                  <th className="py-2.5 px-3 text-right">Reposts</th>
                  <th className="py-2.5 px-3 text-right">Saved</th>
                  <th className="py-2.5 px-3 text-right">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {rankedPosts.map((post, idx) => (
                  <tr
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    className="hover:bg-white dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 max-w-[260px]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-slate-400 font-semibold w-4 text-center">
                          {idx + 1}
                        </span>
                        <img
                          src={post.author.avatarUrl}
                          alt={post.author.displayName}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {post.author.displayName}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 truncate text-[11px]">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {post.topicTag || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {post.likesCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {post.comments.length}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {post.repostsCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {post.bookmarksCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {post.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

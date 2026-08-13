import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Cell,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

// STATIC DEMO DATA
const lineData = [
    { name: 'Jan', score: 62 },
    { name: 'Feb', score: 65 },
    { name: 'Mar', score: 70 },
    { name: 'Apr', score: 68 },
    { name: 'May', score: 75 },
    { name: 'Jun', score: 82 },
];

const barData = [
    { subject: 'React/JS', technical: 88, communication: 75 },
    { subject: 'Node/DB', technical: 82, communication: 70 },
    { subject: 'System Design', technical: 65, communication: 80 },
    { subject: 'Data Structures', technical: 70, communication: 65 },
];

const pieData = [
    { name: 'Frontend', value: 40, color: '#3b82f6' }, // Blue
    { name: 'Backend', value: 30, color: '#10b981' }, // Emerald
    { name: 'System Design', value: 20, color: '#f59e0b' }, // Amber
    { name: 'Behavioral', value: 10, color: '#8b5cf6' }, // Violet
];

export default function AnalyticsSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md transition-shadow lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base">Monthly Interview Scores</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs">Your progress over the past 6 months</p>
                    </div>
                </div>

                <div className="h-[250px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#a1a1aa" fontSize={11} domain={[40, 100]} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    color: 'var(--foreground)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#2563eb"
                                strokeWidth={3}
                                activeDot={{ r: 6 }}
                                dot={{ strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base">Interview Distribution</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs">Breakdown by domain types</p>
                </div>

                <div className="h-[200px] w-full flex items-center justify-center relative mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    color: 'var(--foreground)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                        <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">12</span>
                        <span className="block text-[10px] uppercase tracking-wider text-zinc-455 font-semibold text-zinc-400">Total Rounds</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {pieData.map((item, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-xs text-zinc-650 dark:text-zinc-350">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="truncate">{item.name} ({item.value}%)</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bar Chart Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md transition-shadow lg:col-span-3">
                <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base">Technical vs Communication Score</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs">Ratio across core domains</p>
                </div>

                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                            <XAxis dataKey="subject" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#a1a1aa" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    color: 'var(--foreground)'
                                }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="technical" fill="#2563eb" name="Technical Skill" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="communication" fill="#a855f7" name="Communication Skill" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

"use client"

import React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from "@/types/user"
import {
    BarChart3,
    BookOpen,
    ChevronRight,
    MessageSquare,
    PlusCircle,
    Target,
    TrendingUp,
    Upload,
    UserPlus,
    Users
} from "lucide-react"
import {
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"

import { ForumPost } from "@/lib/data"

interface TeacherDashboardProps {
  user: User
  stats: any
  performance: any[]
  distribution: any[]
  courses: any[]
  forumPosts: ForumPost[]
  topStudents: any[]
}

function TeacherStatCard({
  icon: Icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  change?: string
  color: string
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ backgroundColor: color + "18", color }}
          >
            <Icon className="w-5 h-5" />
          </div>
          {change && (
            <Badge
              variant="secondary"
              className="text-xs text-success font-medium"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              {change}
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold font-display text-foreground mt-3">
          {value}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}



export function TeacherDashboard({
  user,
  stats,
  performance,
  distribution,
  courses,
  forumPosts,
  topStudents,
}: TeacherDashboardProps) {
  // Use mock for forum since it's not in props yet (keeping it simple for now)
  const pendingForumPosts = forumPosts.filter((p) => !p.author.isTeacher)
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground text-balance">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor student progress and manage your courses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Lesson
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <TeacherStatCard
          icon={Users}
          label="Active Students"
          value={stats.activeStudents}
          change="+12%"
          color="#1a9a9a"
        />
        <TeacherStatCard
          icon={Target}
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          change="+5%"
          color="#27ae60"
        />
        <TeacherStatCard
          icon={BarChart3}
          label="Average Score"
          value={`${stats.avgScore}%`}
          change="+3%"
          color="#3498db"
        />
        <TeacherStatCard
          icon={MessageSquare}
          label="Forum Posts"
          value={stats.forumPosts}
          color="#e67e22"
        />
        <TeacherStatCard
          icon={UserPlus}
          label="New Enrollments"
          value={stats.newEnrollments}
          change="+8"
          color="#9b59b6"
        />
        <TeacherStatCard
          icon={BookOpen}
          label="Lessons Created"
          value={stats.lessonsCreated}
          color="#e74c3c"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold font-display flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              Student Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={performance}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  domain={[50, 100]}
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  name="Avg Score"
                />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                  name="Completion %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold font-display text-foreground">
              Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="students"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "13px",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} students`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
              {distribution.map((item) => (
                <span
                  key={item.level}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.level}: {item.students}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Top Students</TabsTrigger>
          <TabsTrigger value="lessons">Lesson Management</TabsTrigger>
          <TabsTrigger value="forum">Forum Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold font-display text-foreground">
                Top Performing Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {topStudents.map((student, i) => (
                  <div
                    key={student.name}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-muted-foreground w-5 text-center">
                      {i + 1}
                    </span>
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {student.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {student.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Level {student.level} &middot; {student.lessons} lessons
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {student.score}%
                      </p>
                      <p className="text-xs text-muted-foreground">avg score</p>
                    </div>
                    <div className="hidden sm:block w-24">
                      <Progress value={student.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold font-display text-foreground">
                  Recent Lessons
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {course.level}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.totalLessons} lessons &middot; {course.enrolled} students
                      </p>
                    </div>
                    {/* ... actions ... */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forum">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold font-display text-foreground">
                Recent Student Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {pendingForumPosts.slice(0, 5).map((post: ForumPost) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                      {post.author.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {post.author.name} &middot; {post.category} &middot;{" "}
                        {post.createdAt}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {post.replies} replies
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

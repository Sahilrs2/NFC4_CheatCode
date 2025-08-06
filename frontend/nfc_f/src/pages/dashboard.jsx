import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext'; // Temporarily commented out
import { courseAPI, userAPI, mentorAPI, jobAPI } from '../services/api';

import { 
  User, 
  BookOpen, 
  Users, 
  Briefcase, 
  AlertCircle, 
  Heart, 
  Globe, 
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Target,
  MessageCircle,
  Bell,
  Settings,
  ChevronRight,
  Award,
  Calendar,
  Phone,
  Home,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  // const { logout } = useAuth(); // Temporarily commented out
  const logout = () => console.log('Logout clicked'); // Temporary logout function
  
  // Fixed: Removed duplicate activeTab declaration and hardcoded user data
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({
    name: 'Loading...',
    location: 'Loading...',
    skillLevel: 'Beginner',
    completedCourses: 0,
    mentorSessions: 0,
    jobApplications: 0,
    profileCompletion: 0
  });
  
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [mentorSessions, setMentorSessions] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fixed: Moved these state declarations before useEffect
  const [notifications, setNotifications] = useState([]);
  const [recommendedPaths, setRecommendedPaths] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);

  const [barriers] = useState({
    transport: { identified: true, supported: true, details: 'Bus pass assistance provided' },
    childcare: { identified: true, supported: false, details: 'Need daycare support during training' },
    digital: { identified: false, supported: true, details: 'Smartphone training completed' },
    language: { identified: true, supported: true, details: 'Hindi interface activated' }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data from API
        const [
          coursesData, 
          jobsData, 
          enrollmentsData, 
          mentorSessionsData,
          userProfileData
        ] = await Promise.all([
          courseAPI.getCourses(),
          jobAPI.getJobs(),
          courseAPI.getEnrollments(),
          mentorAPI.getSessions(),
          userAPI.getProfile()
        ]);
        
        setCourses(coursesData.data || []);
        setJobs(jobsData.data || []);
        setEnrollments(enrollmentsData.data || []);
        setMentorSessions(mentorSessionsData.data || []);
        
        // Update user data based on API response - Fixed name construction
        if (userProfileData.data && userProfileData.data.length > 0) {
          const profile = userProfileData.data[0];
          setUserProfile(profile);
          
          // Fixed: Better name handling with fallbacks
          let userName = 'User';
          if (profile.user?.first_name && profile.user?.last_name) {
            userName = `${profile.user.first_name} ${profile.user.last_name}`;
          } else if (profile.user?.first_name) {
            userName = profile.user.first_name;
          } else if (profile.user?.last_name) {
            userName = profile.user.last_name;
          } else if (profile.user?.username) {
            userName = profile.user.username;
          }
          
          setUser({
            name: userName,
            location: profile.location || 'Location not set',
            skillLevel: profile.skill_set ? 'Intermediate' : 'Beginner',
            completedCourses: enrollmentsData.data?.filter(e => e.completed).length || 0,
            mentorSessions: mentorSessionsData.data?.length || 0,
            jobApplications: 0, // This would need a separate API endpoint
            profileCompletion: calculateProfileCompletion(profile)
          });
        }

        // Generate notifications from real data
        const notificationsList = [];
        if (mentorSessionsData.data?.length > 0) {
          const recentSession = mentorSessionsData.data[0];
          notificationsList.push({
            id: 1,
            type: 'mentor',
            message: `Upcoming session with ${recentSession.mentor?.first_name || 'your mentor'} on ${new Date(recentSession.scheduled_on).toLocaleDateString()}`,
            time: '2 hours ago'
          });
        }
        if (jobsData.data?.length > 0) {
          notificationsList.push({
            id: 2,
            type: 'job',
            message: `New job match: ${jobsData.data[0].title} in ${jobsData.data[0].location || 'your area'}`,
            time: '5 hours ago'
          });
        }
        if (enrollmentsData.data?.length > 0) {
          const activeEnrollment = enrollmentsData.data.find(e => !e.completed);
          if (activeEnrollment) {
            notificationsList.push({
              id: 3,
              type: 'course',
              message: `Continue your course: ${activeEnrollment.course?.title || 'Digital Literacy'}`,
              time: '1 day ago'
            });
          }
        }
        setNotifications(notificationsList);

        // Generate recommended paths from available courses
        const paths = coursesData.data?.slice(0, 3).map((course, index) => ({
          title: course.title,
          match: 85 - (index * 5),
          duration: `${course.duration || 3} months`,
          skills: course.skill_tag ? course.skill_tag.split(',').map(s => s.trim()) : ['Basic Skills'],
          jobs: Math.floor(Math.random() * 30) + 10
        })) || [];
        setRecommendedPaths(paths);

        // Generate active courses from enrollments
        const activeCoursesList = enrollmentsData.data?.filter(e => !e.completed).map(enrollment => ({
          title: enrollment.course?.title || 'Course',
          progress: enrollment.progress || 0,
          nextLesson: 'Continue Learning'
        })) || [];
        setActiveCourses(activeCoursesList);

        // Generate job matches from available jobs
        const jobMatchesList = jobsData.data?.slice(0, 2).map(job => {
          let companyName = 'Company';
          if (job.employer?.first_name && job.employer?.last_name) {
            companyName = `${job.employer.first_name} ${job.employer.last_name}`;
          } else if (job.employer?.first_name) {
            companyName = job.employer.first_name;
          } else if (job.employer?.last_name) {
            companyName = job.employer.last_name;
          } else if (job.employer?.username) {
            companyName = job.employer.username;
          }
          
          return {
            title: job.title,
            company: companyName,
            location: job.location || 'Location not specified',
            salary: job.salary_range || 'Salary not specified',
            match: Math.floor(Math.random() * 20) + 80,
            remote: job.job_type === 'FREELANCE',
            transport: true,
            childcare: false
          };
        }) || [];
        setJobMatches(jobMatchesList);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set user to a default state if API fails
        setUser(prevUser => ({
          ...prevUser,
          name: 'User',
          location: 'Location not available'
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;
    const fields = ['age', 'gender', 'education', 'location', 'phone', 'skill_set', 'goals'];
    const completedFields = fields.filter(field => profile[field] && profile[field] !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const CareerAdvisorChat = () => (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Career Advisor AI</h3>
          <p className="text-sm text-gray-600">Your personal guidance assistant</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg mb-3 border-l-4 border-blue-500">
        <p className="text-sm text-gray-700 mb-2">
          "Based on your skills assessment, I recommend focusing on digital marketing. You have strong communication skills and showed interest in social media during your profile setup."
        </p>
        <p className="text-xs text-gray-500">AI Advisor • Just now</p>
      </div>
      <button 
        onClick={() => navigate('/chatbot')} 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Chat with Advisor
      </button>
    </div>
  );

  const ProgressCard = ({ title, value, max, color, icon: Icon }) => (
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-800">{value}</span>
      </div>
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color.replace('bg-', 'bg-')}`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const BarrierStatus = ({ type, data }) => {
    const icons = {
      transport: MapPin,
      childcare: Heart,
      digital: Globe,
      language: MessageCircle
    };
    const Icon = icons[type];
    
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="capitalize font-medium text-gray-700">{type}</span>
            {data.identified && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                data.supported ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {data.supported ? 'Supported' : 'Needs Support'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{data.details}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SkillBridge Platform</h1>
                <p className="text-sm text-gray-600">Employment & Skill Development</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-600">{user.location}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 👋</h2>
          <p className="text-gray-600">Continue your journey towards better employment opportunities</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ProgressCard 
            title="Profile Completion" 
            value={user.profileCompletion} 
            max={100} 
            color="bg-blue-500" 
            icon={User} 
          />
          <ProgressCard 
            title="Courses Completed" 
            value={user.completedCourses} 
            max={10} 
            color="bg-green-500" 
            icon={BookOpen} 
          />
          <ProgressCard 
            title="Mentor Sessions" 
            value={user.mentorSessions} 
            max={20} 
            color="bg-purple-500" 
            icon={Users} 
          />
          <ProgressCard 
            title="Job Applications" 
            value={user.jobApplications} 
            max={50} 
            color="bg-orange-500" 
            icon={Briefcase} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Advisor */}
            <CareerAdvisorChat />

            {/* Recommended Career Paths */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Recommended Career Paths
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recommendedPaths.length > 0 ? (
                  recommendedPaths.map((path, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{path.title}</h4>
                          <p className="text-sm text-gray-600">{path.duration} • {path.jobs} jobs available</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">{path.match}% match</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {path.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                        Start Learning Path <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No recommended paths available yet.</p>
                    <p className="text-sm">Complete your profile to get personalized recommendations.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Recommended Courses
              </h3>
              <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Recommendation not found</p>
                    <button onClick={()=>{navigate('/modular')}} className='bg-blue-500 mt-2 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'>View more Courses</button>
                  </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Recent Updates
              </h3>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No notifications yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Matches */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                Job Matches
              </h3>
              <div className="space-y-4">
                {jobMatches.length > 0 ? (
                  jobMatches.map((job, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <span className="text-sm font-medium text-green-600">{job.match}% match</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{job.company}</p>
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </p>
                      <p className="text-sm font-medium text-gray-800 mb-3">{job.salary}/month</p>
                      <div className="flex gap-2 mb-3">
                        {job.remote && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Remote</span>}
                        {job.transport && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Transport Aid</span>}
                        {job.childcare && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Childcare Support</span>}
                      </div>
                      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No job matches yet.</p>
                    <p className="text-sm">Complete your profile to get job recommendations.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Barrier Support Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Support Status
              </h3>
              <div className="space-y-3">
                {Object.entries(barriers).map(([type, data]) => (
                  <BarrierStatus key={type} type={type} data={data} />
                ))}
              </div>
              <button className="w-full mt-4 bg-red-50 text-red-700 py-2 px-4 rounded-lg text-sm hover:bg-red-100 transition-colors border border-red-200">
                Request Additional Support
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/skilltest')}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <Award className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Take Skills Test</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-green-200 hover:bg-green-50 transition-colors">
              <Users className="w-6 h-6 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Find Mentor</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50 transition-colors">
              <Calendar className="w-6 h-6 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Schedule Session</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-orange-200 hover:bg-orange-50 transition-colors" onClick={() => navigate('/contactus')}>
              <Phone className="w-6 h-6 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Get Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { userProfileApi } from '@/helpers/api';
import { LikedPostsSection } from '@/components/user/LikedPostsSection';
import { UserCommentsSection } from '@/components/user/UserCommentsSection';
import { RepliesSection } from '@/components/user/RepliesSection';
import { SettingsForm } from '@/components/user/SettingsForm';
import UserSidebar from '../components/layout/UserSidebar';


const UserDashboard: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoadingLiked, setIsLoadingLiked] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLoadingReplies, setIsLoadingReplies] = useState(true);
  const [activeTab, setActiveTab] = useState('liked');

  const fetchUserProfile = async () => {
    try {
      const response: any = await fetch('https://newzify-backend-kappa.vercel.app/api/v1/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setUserProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchLikedPosts = async () => {
    setIsLoadingLiked(true);
    try {
      const response: any = await userProfileApi.getLikedPosts({ page: 1, limit: 20 });
      setLikedPosts(response.data?.docs || []);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      setLikedPosts([]);
    } finally {
      setIsLoadingLiked(false);
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response: any = await userProfileApi.getUserComments({ page: 1, limit: 20 });
      setComments(response.data?.docs || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const fetchReplies = async () => {
    setIsLoadingReplies(true);
    try {
      const response: any = await userProfileApi.getUserReplies({ page: 1, limit: 20 });
      setReplies(response.data?.docs || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
      setReplies([]);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchLikedPosts();
    fetchComments();
    fetchReplies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <UserSidebar 
              user={userProfile} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your profile and activity</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="liked" className="mt-0 outline-none">
                <LikedPostsSection posts={likedPosts} isLoading={isLoadingLiked} />
              </TabsContent>

              <TabsContent value="comments" className="mt-0 outline-none">
                <UserCommentsSection comments={comments} isLoading={isLoadingComments} />
              </TabsContent>

              <TabsContent value="replies" className="mt-0 outline-none">
                <RepliesSection replies={replies} isLoading={isLoadingReplies} />
              </TabsContent>

              <TabsContent value="settings" className="mt-0 outline-none">
                <SettingsForm user={userProfile} onUpdate={fetchUserProfile} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

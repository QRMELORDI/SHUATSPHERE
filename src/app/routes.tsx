import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { SpheresPage } from './pages/SpheresPage';
import { SphereDetailPage } from './pages/SphereDetailPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { ProfilePage } from './pages/ProfilePage';
import { InboxPage } from './pages/InboxPage';
import { SearchPage } from './pages/SearchPage';
import { StashPage } from './pages/StashPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ComposeWhisperPage } from './pages/ComposeWhisperPage';
import { SphereLogo } from './components/SphereLogo';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <SphereLogo size={64} className="mb-4 opacity-40" />
      <h2 className="font-black text-2xl text-foreground mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Page not found</h2>
      <p className="text-zinc-500 font-semibold text-sm mb-4">This page doesn't exist in SHUATSPHERE</p>
      <a href="/" className="px-5 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        Back to Home
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/compose-whisper',
    Component: ComposeWhisperPage,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'spheres', Component: SpheresPage },
      { path: 'sphere/:slug', Component: SphereDetailPage },
      { path: 'post/:id', Component: PostDetailPage },
      { path: 'create', Component: CreatePostPage },
      { path: 'profile', Component: ProfilePage },
      { path: 'profile/:id', Component: ProfilePage },
      { path: 'inbox', Component: InboxPage },
      { path: 'search', Component: SearchPage },
      { path: 'stash', Component: StashPage },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'leaderboard', Component: LeaderboardPage },
      { path: '*', Component: NotFound },
    ],
  },
]);
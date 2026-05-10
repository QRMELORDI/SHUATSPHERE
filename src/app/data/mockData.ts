export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  batch: string;
  branch: string;
  bio: string;
  avatar: string;
  bannerColor?: string;
  auraScore: number;
  /** @deprecated use auraScore */
  influenceScore?: number;
  joinDate: string;
  badges: string[];
  joinedSpheres: string[];
  isVerified: boolean;
  tag?: string;
}

export interface Sphere {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  coverColor: string;
  coverImage?: string;
  memberCount: number;
  postCount: number;
  createdBy: string;
  createdAt: string;
  isPrivate: boolean;
  category: string;
  tags: string[];
  keeper: string;
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  type: 'text' | 'image' | 'link';
  authorId: string;
  sphereId: string;
  sphereSlug: string;
  boosts: number;
  buries: number;
  replyCount: number;
  stashCount: number;
  createdAt: string;
  flair?: string;
  isPinned?: boolean;
  isEvent?: boolean;
  eventDate?: string;
  eventVenue?: string;
}

export interface Reply {
  id: string;
  postId: string;
  parentId?: string;
  content: string;
  authorId: string;
  boosts: number;
  buries: number;
  createdAt: string;
  replies?: Reply[];
}

export interface Whisper {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: string;
  type: 'boost' | 'reply' | 'whisper' | 'badge' | 'mention';
  message: string;
  time: string;
  read: boolean;
  userId: string | null;
  postId?: string;
}

export const CURRENT_USER_ID = 'user1';

export const USERS: User[] = [
  {
    id: 'user1',
    email: '25msrsgis001@shiats.edu.in',
    name: 'Aryan Sharma',
    username: 'aryan_shuats',
    batch: '2025',
    branch: 'CSE',
    bio: 'CS undergrad | Building things | SHUATS \'25 🎓',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=aryan&backgroundColor=b6e3f4',
    bannerColor: 'from-violet-600 to-teal-600',
    auraScore: 1247,
    joinDate: '2024-08-10',
    badges: ['verified_student', 'first_post', 'boost_master', 'sphere_keeper'],
    joinedSpheres: ['cse-2025', 'dsa', 'sports', 'hostel-a', 'notices', 'events'],
    isVerified: true,
    tag: 'CSE 3rd yr',
  },
  {
    id: 'user2',
    email: '24mscmath002@shiats.edu.in',
    name: 'Priya Verma',
    username: 'priya_v',
    batch: '2024',
    branch: 'Mathematics',
    bio: 'Math nerd | Tea lover ☕ | @SHUATS',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=priya&backgroundColor=ffd5dc',
    bannerColor: 'from-pink-500 to-violet-600',
    auraScore: 834,
    joinDate: '2023-07-22',
    badges: ['verified_student', 'first_post'],
    joinedSpheres: ['cse-2025', 'library', 'notices', 'events'],
    isVerified: true,
    tag: 'Maths 2nd yr',
  },
  {
    id: 'user3',
    email: '26btech_cse003@shiats.edu.in',
    name: 'Rahul Singh',
    username: 'rahul_dev',
    batch: '2026',
    branch: 'CSE',
    bio: 'Freshman | trying to figure things out 😅',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=rahul&backgroundColor=c0aede',
    bannerColor: 'from-blue-500 to-indigo-700',
    auraScore: 312,
    joinDate: '2024-08-01',
    badges: ['verified_student', 'first_post'],
    joinedSpheres: ['cse-2026', 'dsa', 'sports', 'mess'],
    isVerified: true,
    tag: 'CSE 1st yr',
  },
  {
    id: 'user4',
    email: '23mca_004@shiats.edu.in',
    name: 'Sneha Gupta',
    username: 'sneha_g',
    batch: '2023',
    branch: 'MCA',
    bio: 'Senior MCA | Placement cell member | Cricket fanatic 🏏',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=sneha&backgroundColor=ffdfbf',
    bannerColor: 'from-amber-500 to-rose-600',
    auraScore: 2391,
    joinDate: '2022-08-05',
    badges: ['verified_student', 'first_post', 'boost_master', 'sphere_keeper'],
    joinedSpheres: ['sports', 'hostel-a', 'cse-2025', 'events', 'notices'],
    isVerified: true,
    tag: 'MCA Senior',
  },
  {
    id: 'user5',
    email: '25bsc_ag005@shiats.edu.in',
    name: 'Vikram Patel',
    username: 'vikram_agri',
    batch: '2025',
    branch: 'Agriculture',
    bio: 'Agriculture science | Future farmer 🌾',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=vikram&backgroundColor=d1f4e0',
    bannerColor: 'from-green-500 to-teal-600',
    auraScore: 678,
    joinDate: '2024-08-15',
    badges: ['verified_student', 'first_post'],
    joinedSpheres: ['sports', 'library', 'notices'],
    isVerified: true,
    tag: 'Agri 1st yr',
  },
  {
    id: 'user6',
    email: '24btech_it006@shiats.edu.in',
    name: 'Divya Nair',
    username: 'divya_it',
    batch: '2024',
    branch: 'IT',
    bio: 'IT student | UI/UX enthusiast | Hostel A 303',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=divya&backgroundColor=ffd5dc',
    bannerColor: 'from-sky-500 to-violet-600',
    auraScore: 945,
    joinDate: '2023-08-20',
    badges: ['verified_student', 'first_post', 'boost_master'],
    joinedSpheres: ['cse-2025', 'hostel-a', 'events', 'library'],
    isVerified: true,
    tag: 'IT 2nd yr',
  },
];

export const SPHERES: Sphere[] = [
  {
    id: 'sphere1',
    name: 'CSE 2025',
    slug: 'cse-2025',
    description: 'Community for CSE batch of 2025. Share notes, doubts, and updates.',
    icon: '💻',
    coverColor: 'from-violet-600 to-purple-800',
    memberCount: 342,
    postCount: 1204,
    createdBy: 'user1',
    createdAt: '2022-08-01',
    isPrivate: false,
    category: 'Academics',
    tags: ['CSE', '2025', 'Academics'],
    keeper: 'user1',
  },
  {
    id: 'sphere2',
    name: 'CSE 2026',
    slug: 'cse-2026',
    description: 'First years CSE! Welcome to SHUATS. Drop your intros!',
    icon: '🎓',
    coverColor: 'from-blue-600 to-cyan-700',
    memberCount: 278,
    postCount: 432,
    createdBy: 'user3',
    createdAt: '2023-08-01',
    isPrivate: false,
    category: 'Academics',
    tags: ['CSE', '2026', 'Freshers'],
    keeper: 'user3',
  },
  {
    id: 'sphere3',
    name: 'DSA Practice',
    slug: 'dsa',
    description: 'Data Structures & Algorithms - problems, solutions, and interview prep.',
    icon: '🧩',
    coverColor: 'from-green-600 to-emerald-800',
    memberCount: 521,
    postCount: 2341,
    createdBy: 'user1',
    createdAt: '2022-09-10',
    isPrivate: false,
    category: 'Academics',
    tags: ['DSA', 'Coding', 'Placements'],
    keeper: 'user1',
  },
  {
    id: 'sphere4',
    name: 'Sports Zone',
    slug: 'sports',
    description: 'Cricket, football, badminton - all sports discussions for SHUATS athletes!',
    icon: '🏏',
    coverColor: 'from-orange-500 to-red-600',
    coverImage: 'https://images.unsplash.com/photo-1702957317929-cd95c4fefbb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    memberCount: 687,
    postCount: 1876,
    createdBy: 'user4',
    createdAt: '2022-08-15',
    isPrivate: false,
    category: 'Sports',
    tags: ['Cricket', 'Football', 'Sports'],
    keeper: 'user4',
  },
  {
    id: 'sphere5',
    name: 'Hostel A',
    slug: 'hostel-a',
    description: 'Hostel A residents only. Gossip, mess menu, laundry complaints 😂',
    icon: '🏠',
    coverColor: 'from-yellow-500 to-amber-700',
    memberCount: 156,
    postCount: 763,
    createdBy: 'user4',
    createdAt: '2022-09-01',
    isPrivate: false,
    category: 'Campus Life',
    tags: ['Hostel', 'CampusLife', 'HostelA'],
    keeper: 'user4',
  },
  {
    id: 'sphere6',
    name: 'Library Corner',
    slug: 'library',
    description: 'Book recommendations, study spots, and resource sharing.',
    icon: '📚',
    coverColor: 'from-teal-600 to-cyan-800',
    coverImage: 'https://images.unsplash.com/photo-1776397409772-6202fe558465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    memberCount: 234,
    postCount: 445,
    createdBy: 'user2',
    createdAt: '2022-10-01',
    isPrivate: false,
    category: 'Academics',
    tags: ['Library', 'Books', 'Study'],
    keeper: 'user2',
  },
  {
    id: 'sphere7',
    name: 'Official Notices',
    slug: 'notices',
    description: '📢 Official announcements, exam schedules, and university notices.',
    icon: '📢',
    coverColor: 'from-red-500 to-rose-700',
    memberCount: 1200,
    postCount: 234,
    createdBy: 'user4',
    createdAt: '2022-08-01',
    isPrivate: false,
    category: 'Official',
    tags: ['Notices', 'Official', 'Exams'],
    keeper: 'user4',
  },
  {
    id: 'sphere8',
    name: 'Events Hub',
    slug: 'events',
    description: 'Fests, seminars, workshops, hackathons - never miss an event!',
    icon: '🎉',
    coverColor: 'from-pink-500 to-purple-600',
    memberCount: 890,
    postCount: 312,
    createdBy: 'user4',
    createdAt: '2022-08-20',
    isPrivate: false,
    category: 'Events',
    tags: ['Fest', 'Hackathon', 'Workshop'],
    keeper: 'user4',
  },
  {
    id: 'sphere9',
    name: 'Mess & Food',
    slug: 'mess',
    description: 'Rate today\'s menu. Mess feedback, food hacks, canteen updates 🍱',
    icon: '🍱',
    coverColor: 'from-lime-500 to-green-700',
    memberCount: 445,
    postCount: 876,
    createdBy: 'user5',
    createdAt: '2022-09-15',
    isPrivate: false,
    category: 'Campus Life',
    tags: ['Mess', 'Food', 'Canteen'],
    keeper: 'user5',
  },
  {
    id: 'sphere10',
    name: 'Placements 2025',
    slug: 'placements-2025',
    description: 'Interview experiences, company updates, prep resources. Get placed! 💼',
    icon: '💼',
    coverColor: 'from-slate-600 to-gray-800',
    memberCount: 312,
    postCount: 543,
    createdBy: 'user4',
    createdAt: '2023-01-01',
    isPrivate: false,
    category: 'Career',
    tags: ['Placements', 'Career', 'Internship'],
    keeper: 'user4',
  },
  {
    id: 'sphere11',
    name: 'MCA Community',
    slug: 'mca',
    description: 'Masters in Computer Applications - doubts, projects, viva prep.',
    icon: '🖥️',
    coverColor: 'from-indigo-600 to-blue-800',
    memberCount: 187,
    postCount: 654,
    createdBy: 'user4',
    createdAt: '2022-08-10',
    isPrivate: false,
    category: 'Academics',
    tags: ['MCA', 'Masters', 'CS'],
    keeper: 'user4',
  },
  {
    id: 'sphere12',
    name: 'Agriculture Science',
    slug: 'agriculture',
    description: 'Agri students unite! Crop science, soil study, field lab updates.',
    icon: '🌾',
    coverColor: 'from-yellow-600 to-lime-700',
    memberCount: 234,
    postCount: 432,
    createdBy: 'user5',
    createdAt: '2022-08-12',
    isPrivate: false,
    category: 'Academics',
    tags: ['Agriculture', 'Agri', 'Science'],
    keeper: 'user5',
  },
];

export const POSTS: Post[] = [
  {
    id: 'post1',
    title: '🏏 SHUATS wins inter-college cricket tournament! Final score: 187-142',
    content: 'What an incredible match today! Our team absolutely dominated St. Johns in the final. Special mention to Rohit who hit a blazing 78 off 52 balls. SHUATS CRICKET LIVES! 🔥🔥🔥',
    imageUrl: 'https://images.unsplash.com/photo-1702957317929-cd95c4fefbb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    type: 'image',
    authorId: 'user4',
    sphereId: 'sphere4',
    sphereSlug: 'sports',
    boosts: 342,
    buries: 12,
    replyCount: 47,
    stashCount: 23,
    createdAt: '2024-05-09T14:30:00Z',
    flair: 'Cricket',
    isPinned: true,
  },
  {
    id: 'post2',
    title: 'Resource dump: Complete DSA cheatsheet for placements season 📄',
    content: 'Hey everyone! Compiled everything I used during my prep for TCS/Infosys/Wipro interviews. Arrays, LinkedLists, Trees, Graphs, DP - all in one doc. Link in comments!\n\nKey topics covered:\n- Arrays & Strings manipulation\n- Two Pointer / Sliding Window\n- Binary Search variations\n- Tree traversals (BFS/DFS)\n- Dynamic Programming patterns\n- Graph algorithms (Dijkstra, BFS)\n\nGood luck to batch 2025! 💪',
    type: 'text',
    authorId: 'user4',
    sphereId: 'sphere3',
    sphereSlug: 'dsa',
    boosts: 567,
    buries: 8,
    replyCount: 89,
    stashCount: 234,
    createdAt: '2024-05-08T10:00:00Z',
    flair: 'Resource',
  },
  {
    id: 'post3',
    title: 'TECHNOVANZA 2025 registrations are OPEN! 🎉',
    content: 'The biggest tech fest of SHUATS is back! TECHNOVANZA 2025 will be held on May 24-26, 2025 at the Main Auditorium.\n\nEvents:\n- Hackathon (48hrs)\n- Paper Presentation\n- Code-O-Debug\n- UI/UX Design Challenge\n- Robotics Workshop\n\nLast date: May 18, 2025\nRegister at: technovanza.shuats.edu.in',
    type: 'text',
    authorId: 'user1',
    sphereId: 'sphere8',
    sphereSlug: 'events',
    boosts: 423,
    buries: 5,
    replyCount: 67,
    stashCount: 156,
    createdAt: '2024-05-07T09:00:00Z',
    flair: 'Event',
    isEvent: true,
    eventDate: 'May 24-26, 2025',
    eventVenue: 'Main Auditorium, SHUATS',
  },
  {
    id: 'post4',
    title: 'Mess food quality has dropped drastically this week - anyone else notice?',
    content: 'The rotis were literally uncooked yesterday, and the dal had zero salt. 3 days in a row now. Someone needs to file a proper complaint. Tagging sphere keeper @sneha_g - can you take this up with warden?',
    type: 'text',
    authorId: 'user3',
    sphereId: 'sphere9',
    sphereSlug: 'mess',
    boosts: 234,
    buries: 15,
    replyCount: 52,
    stashCount: 8,
    createdAt: '2024-05-09T08:00:00Z',
    flair: 'Complaint',
  },
  {
    id: 'post5',
    title: 'End Semester Exam Schedule - May 2025 📋',
    content: 'Official exam timetable released by Controller of Examinations.\n\nCSE 3rd Year:\n- Data Structures: May 15, 9AM\n- DBMS: May 17, 9AM\n- Computer Networks: May 20, 9AM\n- Software Engineering: May 22, 9AM\n- Elective I: May 24, 2PM\n\nAll exams in Main Block. Hall tickets available from May 12.',
    type: 'text',
    authorId: 'user4',
    sphereId: 'sphere7',
    sphereSlug: 'notices',
    boosts: 312,
    buries: 2,
    replyCount: 43,
    stashCount: 189,
    createdAt: '2024-05-08T12:00:00Z',
    flair: 'Official',
    isPinned: true,
  },
  {
    id: 'post6',
    title: 'Anyone have Operating Systems notes by Prof. Sinha? His slides are gold ⭐',
    content: 'Looking for Prof. Sinha\'s OS lecture slides, specifically for Unit 3 & 4 (Memory Management, File Systems). He gave handouts in class last week but I missed it. Please DM or drop in comments!',
    type: 'text',
    authorId: 'user3',
    sphereId: 'sphere1',
    sphereSlug: 'cse-2025',
    boosts: 89,
    buries: 3,
    replyCount: 12,
    stashCount: 34,
    createdAt: '2024-05-09T11:00:00Z',
    flair: 'Notes',
  },
  {
    id: 'post7',
    title: 'Library is adding 200 new CS books! Here\'s the list 📚',
    content: 'The library has acquired 200 new books in Computer Science and Engineering. Notable additions include:\n- Clean Code by Robert Martin\n- Introduction to Algorithms (4th Ed) - CLRS\n- System Design Interview - Alex Xu\n- Designing Data-Intensive Applications\n- The Pragmatic Programmer\n\nAvailable from May 15. Issue your library cards now!',
    type: 'text',
    authorId: 'user2',
    sphereId: 'sphere6',
    sphereSlug: 'library',
    boosts: 201,
    buries: 4,
    replyCount: 28,
    stashCount: 112,
    createdAt: '2024-05-08T16:00:00Z',
    flair: 'Books',
  },
  {
    id: 'post8',
    title: 'My experience at TCS NextStep drive - Tips for CSE 2025 batch',
    content: 'Just got my TCS offer letter! 3.5 LPA package. Here\'s what helped me:\n\n1. Practice aptitude daily (IndiaBix)\n2. TCS NQT pattern has changed - more coding focus\n3. Coding round: 2 medium-easy problems, 60 min\n4. Interview was mostly HR + basic OOP\n5. Communication matters more than you think\n\nAll the best to those preparing! Drop your doubts below.',
    type: 'text',
    authorId: 'user6',
    sphereId: 'sphere10',
    sphereSlug: 'placements-2025',
    boosts: 445,
    buries: 6,
    replyCount: 78,
    stashCount: 167,
    createdAt: '2024-05-07T15:00:00Z',
    flair: 'Interview Experience',
  },
  {
    id: 'post9',
    title: 'Hostel A water supply will be disrupted tomorrow 6AM-2PM',
    content: 'Warden announced that there will be pipeline maintenance tomorrow. Water supply to Hostel A will be off from 6AM to 2PM. Please fill your buckets tonight!',
    type: 'text',
    authorId: 'user4',
    sphereId: 'sphere5',
    sphereSlug: 'hostel-a',
    boosts: 123,
    buries: 8,
    replyCount: 31,
    stashCount: 12,
    createdAt: '2024-05-09T20:00:00Z',
    flair: 'Announcement',
    isPinned: true,
  },
  {
    id: 'post10',
    title: 'LeetCode streak challenge - 100 days starting June 1st! Join us 🔥',
    content: 'Starting a batch-wide LeetCode challenge. 100 days, 1 problem daily minimum. We\'ll have a WhatsApp group for accountability and weekly leaderboards on ShuatSphere!\n\nRules:\n- Solve at least 1 LC problem daily\n- Post your solution link in the sphere\n- Streak breaks = buy tea for group 😂\n\nInterested? Comment below with your LC username!',
    type: 'text',
    authorId: 'user1',
    sphereId: 'sphere3',
    sphereSlug: 'dsa',
    boosts: 178,
    buries: 7,
    replyCount: 56,
    stashCount: 89,
    createdAt: '2024-05-09T13:00:00Z',
    flair: 'Challenge',
  },
  {
    id: 'post11',
    title: 'Morning walk at campus - the new garden looks amazing! 🌸',
    content: 'Woke up at 5:30 today and went for a walk near the botanical garden. The university has done an incredible job! New benches, walking path, and flowering plants everywhere. Best stress buster before exams!',
    imageUrl: 'https://images.unsplash.com/photo-1687709348710-05314eea5476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    type: 'image',
    authorId: 'user5',
    sphereId: 'sphere1',
    sphereSlug: 'cse-2025',
    boosts: 156,
    buries: 3,
    replyCount: 22,
    stashCount: 45,
    createdAt: '2024-05-09T06:00:00Z',
    flair: 'Campus Life',
  },
  {
    id: 'post12',
    title: 'FREE online certification by NPTEL - Introduction to Machine Learning (deadline May 20)',
    content: 'NPTEL is offering a free certification course on ML. If you score >60% in the exam, you get a certificate. Perfect for resumes!\n\nLink: swayam.gov.in\nCourse: Introduction to Machine Learning\nExam: May 20, 2025\nFee: FREE (certificate is free too for SHUATS students via SWAYAM portal)\n\nDo it now. No excuses.',
    type: 'text',
    authorId: 'user6',
    sphereId: 'sphere1',
    sphereSlug: 'cse-2025',
    boosts: 389,
    buries: 4,
    replyCount: 63,
    stashCount: 201,
    createdAt: '2024-05-08T09:00:00Z',
    flair: 'Opportunity',
    linkUrl: 'https://swayam.gov.in',
  },
];

export const REPLIES: Reply[] = [
  {
    id: 'reply1',
    postId: 'post1',
    content: 'Absolutely insane match! I was there in the ground. Rohit\'s cover drive on the last over was cinema! 🏏',
    authorId: 'user1',
    boosts: 45,
    buries: 1,
    createdAt: '2024-05-09T15:00:00Z',
  },
  {
    id: 'reply2',
    postId: 'post1',
    content: 'I missed it 😭 was in lab session. Someone please upload the highlights!',
    authorId: 'user3',
    boosts: 23,
    buries: 0,
    createdAt: '2024-05-09T15:30:00Z',
  },
  {
    id: 'reply3',
    postId: 'post1',
    content: 'Rohit is genuinely next level. That 78 off 52 in a college match is crazy good.',
    authorId: 'user2',
    boosts: 34,
    buries: 0,
    createdAt: '2024-05-09T16:00:00Z',
  },
  {
    id: 'reply4',
    postId: 'post2',
    content: 'Bro this is gold. Stashing this immediately! Thank you so much 🙏',
    authorId: 'user3',
    boosts: 78,
    buries: 0,
    createdAt: '2024-05-08T11:00:00Z',
  },
  {
    id: 'reply5',
    postId: 'post2',
    content: 'Can you share the Google Drive link? The doc link in comments doesn\'t open',
    authorId: 'user6',
    boosts: 12,
    buries: 0,
    createdAt: '2024-05-08T12:00:00Z',
  },
  {
    id: 'reply6',
    postId: 'post3',
    content: 'Already registered for the hackathon! Who else wants to team up? Looking for 2 more members (ML + backend)',
    authorId: 'user1',
    boosts: 56,
    buries: 0,
    createdAt: '2024-05-07T10:00:00Z',
  },
  {
    id: 'reply7',
    postId: 'post4',
    content: 'Yes! I complained at the mess counter but they just shrugged. We need a proper written complaint.',
    authorId: 'user6',
    boosts: 89,
    buries: 0,
    createdAt: '2024-05-09T09:00:00Z',
  },
  {
    id: 'reply8',
    postId: 'post8',
    content: 'Congrats!! Can you share what aptitude topics were asked? 🙏',
    authorId: 'user3',
    boosts: 34,
    buries: 0,
    createdAt: '2024-05-07T16:00:00Z',
  },
  {
    id: 'reply9',
    postId: 'post10',
    content: 'I\'m in! Username: aryan_sharma_07. Let\'s gooo!',
    authorId: 'user1',
    boosts: 23,
    buries: 0,
    createdAt: '2024-05-09T14:00:00Z',
  },
  {
    id: 'reply10',
    postId: 'post10',
    content: 'Count me in! rahul_singh_dev. Starting with easy arrays then moving to medium.',
    authorId: 'user3',
    boosts: 15,
    buries: 0,
    createdAt: '2024-05-09T14:30:00Z',
  },
];

export const WHISPERS: Whisper[] = [
  {
    id: 'w1',
    fromId: 'user4',
    toId: 'user1',
    content: 'Hey! Saw your hackathon post. I\'m in as backend dev. Want to form a team?',
    createdAt: '2024-05-09T10:00:00Z',
    read: false,
  },
  {
    id: 'w2',
    fromId: 'user1',
    toId: 'user4',
    content: 'Yes! That would be awesome. Do you know anyone for ML?',
    createdAt: '2024-05-09T10:05:00Z',
    read: true,
  },
  {
    id: 'w3',
    fromId: 'user4',
    toId: 'user1',
    content: 'Priya from MCA is good at ML. Should I ask her?',
    createdAt: '2024-05-09T10:10:00Z',
    read: false,
  },
  {
    id: 'w4',
    fromId: 'user2',
    toId: 'user1',
    content: 'Hi! Can you share your DSA notes? I saw your post in dsa sphere.',
    createdAt: '2024-05-08T14:00:00Z',
    read: true,
  },
  {
    id: 'w5',
    fromId: 'user1',
    toId: 'user2',
    content: 'Sure! Check the Google Drive link in my latest post 😊',
    createdAt: '2024-05-08T14:30:00Z',
    read: true,
  },
  {
    id: 'w6',
    fromId: 'user6',
    toId: 'user1',
    content: 'Your LeetCode challenge is a great idea! I\'m organizing it for our batch WhatsApp too.',
    createdAt: '2024-05-09T15:00:00Z',
    read: false,
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'boost',
    message: 'sneha_g boosted your post "LeetCode streak challenge"',
    time: '2m ago',
    read: false,
    userId: 'user4',
    postId: 'post10',
  },
  {
    id: 'n2',
    type: 'reply',
    message: 'rahul_dev replied to your post: "I\'m in! rahul_singh_dev. Starting..."',
    time: '14m ago',
    read: false,
    userId: 'user3',
    postId: 'post10',
  },
  {
    id: 'n3',
    type: 'whisper',
    message: 'divya_it sent you a Whisper',
    time: '1h ago',
    read: false,
    userId: 'user6',
  },
  {
    id: 'n4',
    type: 'badge',
    message: 'You earned the "Boost Master" badge! 🏆',
    time: '2h ago',
    read: false,
    userId: null,
  },
  {
    id: 'n5',
    type: 'boost',
    message: 'priya_v boosted your post "Resource dump: Complete DSA cheatsheet"',
    time: '3h ago',
    read: true,
    userId: 'user2',
    postId: 'post2',
  },
  {
    id: 'n6',
    type: 'mention',
    message: 'vikram_agri mentioned you in s/sports',
    time: '5h ago',
    read: true,
    userId: 'user5',
    postId: 'post1',
  },
  {
    id: 'n7',
    type: 'reply',
    message: 'priya_v replied: "This DSA guide is absolutely gold 🙏"',
    time: '6h ago',
    read: true,
    userId: 'user2',
    postId: 'post2',
  },
  {
    id: 'n8',
    type: 'boost',
    message: 'rahul_dev boosted your post "TECHNOVANZA 2025 registrations are OPEN!"',
    time: '8h ago',
    read: true,
    userId: 'user3',
    postId: 'post3',
  },
  {
    id: 'n9',
    type: 'badge',
    message: 'You earned the "Sphere Keeper" badge! 👑',
    time: '1d ago',
    read: true,
    userId: null,
  },
  {
    id: 'n10',
    type: 'whisper',
    message: 'sneha_g sent you a new Whisper',
    time: '1d ago',
    read: true,
    userId: 'user4',
  },
];
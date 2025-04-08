export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  status: string;
  projectIds: string[];
  createAt: string; 
  lastLoginAt: string;
  friendsIds: string[];
  friendRequestsIds: string[];
  friendRequestsSentIds: string[];
  avatarUrl: string;
  birthday: string;
  bio: string;
};

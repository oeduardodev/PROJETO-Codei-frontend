export interface NotificationUser {
  created_at: string;
  id: number;
  message: string;
  date: Date;
  read: boolean;
  title: string;
  user_id: number;
  type: string;
  data: any;
}

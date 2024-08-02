export interface NotificationDto {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

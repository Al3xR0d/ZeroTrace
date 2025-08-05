export interface ServerNotification {
  id: number;
  title: string;
  content: string;
  date: string;
}

export interface ClientNotification extends ServerNotification {
  isRead: boolean;
}

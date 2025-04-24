// Interfaces
export interface IGetAdminsByAlertMQPayload {
  alert: string;
}

// main object
export const AdminMQContract = {
  Routes: {
    Query: {
      GetAdminsByAlert: 'admin.query.get-admins-by-alert',
    },
  },
} as const;

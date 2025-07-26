import adminData from './admins.json';

export interface Admin {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
  updatedAt: string;
}

export const getAdmins = (): Admin[] => {
  return adminData as Admin[];
};

export const getAdminById = (id: string): Admin | undefined => {
  return (adminData.find((admin) => admin._id === id) as Admin | undefined);
};

export const getAdminByEmail = (email: string): Admin | undefined => {
  return (adminData.find((admin) => admin.email === email) as Admin | undefined);
};

export const validateAdminCredentials = (email: string, password: string): Admin | null => {
  const admin = getAdminByEmail(email);
  if (admin && admin.password === password) {
    return admin;
  }
  return null;
};

export const isAdmin = (email: string): boolean => {
  const admin = getAdminByEmail(email);
  return admin?.role === 'admin' || admin?.role === 'super_admin';
};

export const isSuperAdmin = (email: string): boolean => {
  const admin = getAdminByEmail(email);
  return admin?.role === 'super_admin';
}; 
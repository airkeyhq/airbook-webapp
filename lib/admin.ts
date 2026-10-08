/**
 * AirBook Core Admin & Executive Access Control Matrix
 * 
 * Provides centralized configuration and role verification for executive
 * and internal platform administrators accessing /in and internal tooling.
 */

export interface AdminUser {
  email: string;
  name: string;
  role: 'ceo' | 'admin' | 'superadmin';
  title: string;
  department: string;
  avatarColor: string;
  canAccessInternalConsole: boolean;
  canManageFoundingApplications: boolean;
  canManageCrm: boolean;
  canManageRoadmap: boolean;
  canManageDeployments: boolean;
}

export const ADMIN_USERS: Record<string, AdminUser> = {
  'eduardo@getairbook.com': {
    email: 'eduardo@getairbook.com',
    name: 'Eduardo Gonzalez',
    role: 'ceo',
    title: 'CEO & Founder',
    department: 'Executive / Product Engineering',
    avatarColor: '#2BB5FF',
    canAccessInternalConsole: true,
    canManageFoundingApplications: true,
    canManageCrm: true,
    canManageRoadmap: true,
    canManageDeployments: true,
  },
  'raul@getairbook.com': {
    email: 'raul@getairbook.com',
    name: 'Raul',
    role: 'admin',
    title: 'Co-Founder & Platform Admin',
    department: 'Executive / Platform Architecture',
    avatarColor: '#8338EC',
    canAccessInternalConsole: true,
    canManageFoundingApplications: true,
    canManageCrm: true,
    canManageRoadmap: true,
    canManageDeployments: true,
  },
  // Backward compatibility alias for local dev environment
  'eduardo@airbook.app': {
    email: 'eduardo@airbook.app',
    name: 'Eduardo Gonzalez',
    role: 'ceo',
    title: 'CEO & Founder',
    department: 'Executive / Product Engineering',
    avatarColor: '#2BB5FF',
    canAccessInternalConsole: true,
    canManageFoundingApplications: true,
    canManageCrm: true,
    canManageRoadmap: true,
    canManageDeployments: true,
  },
  'ededuardomoreno@gmail.com': {
    email: 'ededuardomoreno@gmail.com',
    name: 'Eduardo Moreno',
    role: 'ceo',
    title: 'CEO & Founder',
    department: 'Executive / Product Engineering',
    avatarColor: '#2BB5FF',
    canAccessInternalConsole: true,
    canManageFoundingApplications: true,
    canManageCrm: true,
    canManageRoadmap: true,
    canManageDeployments: true,
  },
};

export const ADMIN_EMAILS: string[] = Object.keys(ADMIN_USERS);

/**
 * Checks whether the given email belongs to an authorized AirBook administrator.
 * Matches exact admin emails or any verified @getairbook.com team address.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  
  if (ADMIN_USERS[normalized]) {
    return true;
  }
  
  // Also authorize all official @getairbook.com domain members
  if (normalized.endsWith('@getairbook.com')) {
    return true;
  }
  
  return false;
}

/**
 * Retrieves the admin user profile for a given email address.
 */
export function getAdminUser(email: string | null | undefined): AdminUser | null {
  if (!email || typeof email !== 'string') return null;
  const normalized = email.trim().toLowerCase();
  
  if (ADMIN_USERS[normalized]) {
    return ADMIN_USERS[normalized];
  }
  
  if (normalized.endsWith('@getairbook.com')) {
    const rawUsername = normalized.split('@')[0];
    const formattedName = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);
    return {
      email: normalized,
      name: formattedName,
      role: 'admin',
      title: 'Platform Admin & Team',
      department: 'Core Team',
      avatarColor: '#2BB5FF',
      canAccessInternalConsole: true,
      canManageFoundingApplications: true,
      canManageCrm: true,
      canManageRoadmap: true,
      canManageDeployments: true,
    };
  }
  
  return null;
}

/**
 * Checks if the specified email is the AirBook CEO (Eduardo).
 */
export function isCeo(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  return (
    normalized === 'eduardo@getairbook.com' ||
    normalized === 'eduardo@airbook.app' ||
    normalized === 'ededuardomoreno@gmail.com'
  );
}

/**
 * AirBook sales & CRM executive reps list for deal assignment.
 */
export const ADMIN_REPS = [
  {
    name: 'Eduardo G. (CEO)',
    email: 'eduardo@getairbook.com',
    role: 'CEO & Founder',
  },
  {
    name: 'Raul (Admin)',
    email: 'raul@getairbook.com',
    role: 'Co-Founder & Platform Admin',
  },
];

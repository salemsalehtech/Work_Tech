/**
 * Predefined demo accounts for WorkTech.
 * Note: These accounts exist locally in the browser for demo purposes.
 * Passwords stored here are demo values, not real production-grade security.
 */

export const DEMO_USER = {
  id: 'demo-user-1',
  name: 'Marwan Tarek',
  fullName: 'Marwan Tarek',
  email: 'marwan@worktech.com',
  password: 'Password123',
  phone: '01022334455',
  city: 'Cairo',
  address: '16 El Tayaran St',
  addresses: [
    {
      id: 'addr-1',
      fullName: 'Marwan Tarek',
      phone: '01022334455',
      city: 'Cairo',
      address: '16 El Tayaran St',
      isDefault: true,
    },
  ],
};

export const DEMO_ACCOUNT = DEMO_USER;
export const DEMO_ACCOUNTS = [DEMO_USER];
export const demoAccount = DEMO_USER;
export const demoAccounts = DEMO_ACCOUNTS;

export const DEMO_CREDENTIALS = {
  email: 'marwan@worktech.com',
  password: 'Password123',
};

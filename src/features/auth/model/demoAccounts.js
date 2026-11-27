// Accounts every visitor can sign in with. Demo passwords, not real security.
export const DEMO_ACCOUNT = {
  id: 'demo-user-1',
  fullName: 'Marwan Tarek',
  email: 'marwan@worktech.com',
  password: 'Password123',
  phone: '01022334455',
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

export const DEMO_ACCOUNTS = [DEMO_ACCOUNT];

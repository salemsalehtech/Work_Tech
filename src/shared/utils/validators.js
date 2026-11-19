export const isEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim());
};

export const isEgyptianMobile = (phone) => {
  const phoneRegex = /^01[0125][0-9]{8}$/;
  return phoneRegex.test(String(phone).trim());
};

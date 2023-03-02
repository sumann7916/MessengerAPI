require('dotenv').config();


export const JWT_SECRET = process.env.JWT_SECRET!;

// export const BASE_URL = {
//   frontend: process.env.FRONTEND_URL,
//   backend: process.env.BACKEND_URL,
// };

export const DATABASE = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
};

// export const SMTP_INFO = {
//   user: process.env.SMTP_USER!,
//   from: process.env.SMTP_USER!,
//   host: process.env.SMTP_HOST!,
//   port: parseInt(process.env.SMTP_PORT!),
//   password: process.env.SMTP_PASSWORD!,
// };

export const GOOGLE_AUTHENTICATION = {
   clientId: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 };

// export const GOOGLE_CALLBACK_URL = {
//    googleCustomerCallBackUrl: process.env.GOOGLE_CUSTOMER_CALLBACK_URL,
//    googleSellerCallBackUrl: process.env.GOOGLE_SELLER_CALLBACK_URL,
//    googleRiderCallBackUrl: process.env.GOOGLE_RIDER_CALLBACK_URL,
//  };

export const GOOGLE_CALLBACK_URL = {
  googleCallBackUrl: process.env.GOOGLE_CALLBACK_URL
}
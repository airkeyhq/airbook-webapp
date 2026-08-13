import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization, magicLink } from 'better-auth/plugins';
import { db } from '@/db';
import * as schema from '@/db/schema';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: ['http://localhost:3000', 'https://airbook-webapp.vercel.app'],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
      organization: schema.organizations,
      member: schema.members,
      invitation: schema.invitations,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'apple'],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET
      ? {
          apple: {
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Send email via Novu / Resend
        console.log(`Sending magic link to ${email}: ${url}`);
      },
    }),
  ],
});

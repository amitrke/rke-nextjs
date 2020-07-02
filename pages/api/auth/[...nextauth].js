import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: process.env.SITE || 'http://localhost:3000',

  // configure one or more authentication providers
  providers: [
    Providers.Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
    }),
  ],

  // database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,

  // control who can sign in - allows access control even without a database
  allowSignin: async (user, account) => { return true }
}

export default (req, res) => NextAuth(req, res, options)
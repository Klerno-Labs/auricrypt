export { auth as middleware } from "@/auth"

// Note: NextAuth v5 simplifies middleware significantly. 
// Standard config usually looks like this:
/*
import NextAuth from "next-auth"
 
export default NextAuth({
  callbacks: {
    authorized: ({ request, auth }) => {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
  },
})
*/
// For this skeleton, we will define a simple check in the auth.ts file.
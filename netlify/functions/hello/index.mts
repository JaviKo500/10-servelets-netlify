import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
   // return{
   //    statusCode: 200,
   //    body: JSON.stringify({
   //       message: 'Hello from server'
   //    }),
   //    headers: {
   //       'Content-Type': 'application/json'
   //    }
   // }

  return new Response( 'Hello world' , { status: 200 });
}

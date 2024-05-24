import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const myImportantVariable = process?.env?.MY_IMPORTANT_VARIABLE;
  console.log('<--------------- JK Index --------------->');
  console.log('hello world from logs');
  if ( !myImportantVariable ) {
    throw new Error("not implemented myImportantVariable");
  }
  return new Response( myImportantVariable , { status: 200 });
}

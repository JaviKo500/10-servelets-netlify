import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {

   const githubEvent = req.headers.get('x-github-event') ?? 'unknown';

   const payload = await req.json();
   let message = '';
   switch (githubEvent) {
      case 'star':
         message = onStart( payload );
         break;
      case 'issues':
         message = onIssues( payload );
         break;
      default:
         console.log(`unknown: ${githubEvent}`);
         break;
   }

   const success = await notify( message );
   if ( success ) {
      return new Response( 'Success' , { status: 200 });
   }
   return new Response( 'Error not action' , { status: 500 });
}


const notify = async ( message: string,  ) => {
   const DISCORD_WEBHOOK_URL = process?.env?.DISCORD_WEBHOOK_URL;
   const body = {
      content: message,
      // embeds: [
      //    {
      //       image: {
      //          url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmt1MG1jc3RlbHpsbWM0aTB0eW5sancyNWt0dmhwY243ZTY2dDd1YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/du3J3cXyzhj75IOgvA/giphy.gif',
      //       },
      //    }
      // ]
   };

   const response = await fetch(
      DISCORD_WEBHOOK_URL ?? '',
      {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(body),
      }
   );

   if ( !response.ok ) {
      console.log('<--------------- JK Discord.service Error --------------->');
      console.log('Error sending message in discord');
      return false;
   }
   return true;
}

const onStart = ( payload: any ): string =>  {
   let message: string = '';
   const { sender, repository, action } = payload;
   message = `User ${ sender?.login } ${ action } star on ${ repository?.full_name}.`;
   return message;
}

const onIssues = ( payload: any ) => {
   const { sender, repository, issue, action } = payload;

   if ( action === 'opened' ) {
      return  `An issue has been opened with this title ${ issue?.title} by user ${sender?.login} on ${ repository?.full_name }`;
   }

   if ( action === 'closed' ) {
      return  `An issue was closed by user ${sender?.login} on ${ repository?.full_name }`;
   }

   if ( action === 'reopened' ) {
      return  `An issue was reopened by user ${sender?.login} on ${ repository?.full_name }`;
   }

   return  `Unhandled action ${action} by user ${sender?.login} on ${ repository?.full_name }`;
}
## Steps to execute attack: 
1. On a cmd nevigate to 'hw4-frontEnd/hw4-V1-NotSafe'
2. Run 'npm install'
3. Run 'npm run dev'
4. On your browser go to 'http://localhost:3000/'
5. Register to the app and post a draft
6. Go to the devtools and from Cookies copy the token under 'FrontEndToken'
7. Open powershell and run this: curl -X POST \ -H "cookie: FrontEndToken=<The_Token_You_Coppied>" http://localhost:3000/drafts
8. Expected result- a page with the informtaion of your drafts page is returned- Hacked!

## Running the safe version 
1. On a cmd nevigate to 'hw4-frontEnd/hw4-V2-Safe'
2. Run 'npm install'
3. Run 'npm run dev'
4. Open powershell and run this: curl -X POST \ -H "cookie: FrontEndToken=<The_Token_You_Coppied>" http://localhost:3000/drafts
5. Expected result- the page with the drafts will not be returned- Hack prevented
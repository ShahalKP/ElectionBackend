# ElectionBackend

Commands :

`npm install`

`truffle migrate --reset`

Copy the transaction hash from 2_deploy_contracts.js to address of contract in src/js/app.js, named as var myContractAddress

`npm run dev`


Tests : 

`truffle test`

  - initializes with two candidates
  - it initializes the candidates with the correct values 
  - allows a voter to cast a vote 
  - throws an exception for invalid candidates 
  - throws an exception for double voting
  
  

const Web3 = require("web3");

const web3 = new Web3(window.ethereum);

App = {
  web3Provider: web3.currentProvider,
  contracts: {},
  account: "0x0",
  hasVoted: false,

  init: function () {
    try {
      // Request account access if needed
      web3.eth.defaultAccount = ethereum._state.accounts[0];
      ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.log("Catched");
    }
    return App.initContract();
  },

  // initWeb3: function() {
  // 	// TODO: refactor conditional
  // 	if (typeof web3 !== "undefined") {
  // 		console.log('hlo');
  // 		// If a web3 instance is already provided by Meta Mask.
  // 		App.web3Provider = web3.currentProvider;
  // 		web3 = new Web3(web3.currentProvider);
  // 	} else {
  // 		console.log('hoo');
  // 		// Specify default instance if no web3 instance provided
  // 		App.web3Provider = new Web3.providers.HttpProvider(
  // 			"http://localhost:7545"
  // 		);
  // 		web3 = new Web3(App.web3Provider);
  // 	}
  // 	return App.initContract();
  // },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance
        .votedEvent(
          {},
          {
            fromBlock: 0,
            toBlock: "latest",
          }
        )
        .watch(function (error, event) {
          console.log("event triggered", event);
          // Reload when a new vote is recorded
          App.render();
        });
    });
  },

  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      } else {
        console.log("Error Code 342: " + err);
      }
    });

    // Load contract data
    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.electionsCount();
      })
      .then(function (electionsCount) {
        var candidatesResults = $("#listElections");
        candidatesResults.empty();

        var candidatesSelect = $("#candidatesSelect");

        for (var i = 0; i <= electionsCount-1; i++) {
          electionInstance
            .elections(i)
            .then(function (election) {
              var id = election[0];
              var name = election[1];
              var candidatesCount = election[2];
			  console.log(election);

              // Render candidate Result
              var candidateTemplate =
                "<tr><td>" +
                id +
                "</td><td>" +
                name +
                "</td><td>" +
                candidatesCount +
                "</td></tr>";
              candidatesResults.append(candidateTemplate);

              // Render candidate ballot option
              var candidateOption =
                "<option value='" + id + "' >" + name + "</ option>";
              candidatesSelect.append(candidateOption);
            })
            .catch((err) => {
              console.log("errr");
              console.log(err);
            });
        }
        //list candidates
        var candidateList = $("#candidateList");
        candidateList.empty();

        var candidatesSelect = $("#candidatesSelect");
        candidatesSelect.empty();

        // electionInstance
        //   .elections(1)
        //   .then(function (election) {
        // 	  var candidates = election[2]
        // 	  console.log('hola');
        // 	  console.log(election);
        //   })
        //   .catch(function (error) {
        //     console.warn(error);
        //   });

        // for (var i = 1; i <= electionsCount; i++) {
        //   electionInstance.candidates(i).then(function (candidate) {
        //     var id = candidate[0];
        //     var name = candidate[1];

        //     // Render candidate Result
        //     var candidateTemplate =
        //       "<tr><th>" + id + "</th><td>" + name + "</td></tr>";
        //     candidateList.append(candidateTemplate);

        //     // Render candidate ballot option
        //   });
        // }
        return electionInstance.voters(App.account);
      })
      .then(function (hasVoted) {
        // Do not allow a user to vote
        if (hasVoted) {
          $("#castVoteForm").hide();
          $("#hasVoted").show();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
  },

  castVote: function () {
    var candidateId = $("#candidatesSelect").val();
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.vote(candidateId, { from: App.account });
      })
      .then(function (result) {
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      })
      .catch(function (err) {
        console.error(err);
      });
  },

  addCandidate: function () {
    var name = $("#addNewCandidate").val();
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.addCandidate(name, { from: web3.eth.defaultAccount });
      })
      .then(function (result) {
        // Wait for votes to update
        console.log("voter added");
      })
      .catch(function (err) {
        console.error(err);
      });
  },
};

// Initialize contract on an address
var myAbi = [
  {
    constant: true,
    inputs: [],
    name: "candidatesCount",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x2d35a8a2",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "candidates",
    outputs: [
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "voteCount",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x3477ee2e",
  },
  {
    constant: true,
    inputs: [],
    name: "candidate",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x6c8381f8",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address",
      },
    ],
    name: "voters",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xa3ec138d",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
    signature: "constructor",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_name",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x462e91ec",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x0121b93f",
  },
];

// // Specify address of contract
var myContractAddress = "0xf24471dad96275b2584b674641ae3c06618ffa9a1bc5214db48dbadb17f8cd73";

// Instantiate myContract
var myContract = web3.eth.contract(myAbi);

var Coursetro = myContract.at(myContractAddress);

console.log(Coursetro);
// var version = web3.version.api;
// console.log(version); // "0.20.3"

// myContract.methods.addCandidate("New").send();

// console.log(electionAddress);
// electionAddress.addCandidate("Candidate 3");

$(function () {
  $(window).load(function () {
    App.init();
    // $("#addNewCandidateBtn").click(function() {
    // 	let candidateName = $("#addNewCandidate").val();
    // 	if (candidateName) {
    // 		Coursetro.addCandidate(candidateName, function(err, result) {
    // 			if (err) {
    // 				console.log("Error occured");
    // 			}
    // 		});
    // 	}
    // });
  });
});

pragma experimental ABIEncoderV2;
pragma solidity 0.5.16;

contract Election {
    // // Constructor
    // constructor () public {
    //     addCandidate("Candidate 1");
    //     addCandidate("Candidate 2");
    // }

    // Model a Candidate
    // struct Candidate {
    //     uint id;
    //     string name;
    //     uint voteCount;
    // }

    // // Read/write Candidates
    // mapping(uint => Candidate) public candidates;

    // // Store Candidates Count
    // uint public candidatesCount;
    
    // // Store accounts that have voted
    // mapping(address => bool) public voters;

    // function addCandidate (string memory _name) public {
    //     candidatesCount ++;
    //     candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    // }

    // function vote (uint _candidateId) public {
    //     // require that they haven't voted before
    //     require(!voters[msg.sender]);

    //     // require a valid candidate
    //     require(_candidateId > 0 && _candidateId <= candidatesCount);

    //     // record that voter has voted
    //     voters[msg.sender] = true;

    //     // update candidate vote Count
    //     candidates[_candidateId].voteCount ++;
    // }

    // New
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct ElectionModel {
        uint id;
        string name;
        uint candidatesCount;
        // Candidate[] candidates;
        mapping(uint => Candidate) candidates;
        mapping(address => bool) voters;
    }

    uint public electionsCount = 0;
    // mapping(uint => ElectionModel) public elections;
    ElectionModel[] public elections;

    function addElection (string memory _name) public {
        // ElectionModel storage temp = elections[electionsCount];
        // temp.id = electionsCount;
        // temp.name = _name;
        // temp.candidatesCount = 0;
        // temp.candidates[0] = Candidate(1, 'Candidate 1', 0);
        // temp.candidatesCount++;
        // //elections.push(temp);
        // electionsCount ++;

        elections.push(ElectionModel({id: electionsCount, name: _name, candidatesCount: 0}));
        electionsCount ++;
    }

    function addCandidate (uint _election, string memory _name) public {
        elections[_election].candidatesCount ++;
        uint newid = elections[_election].candidatesCount;
        elections[_election].candidates[newid] = Candidate(newid, _name, 0);
        // candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    constructor () public {
        addElection("Election 1");
        addCandidate(0, 'Candidate 1');
        addCandidate(0, 'Candidate 2');
        addElection("Election 2");
        addCandidate(1, 'Candidate 3');
        addCandidate(1, 'Candidate 4');
        addCandidate(1, 'Candidate 5');
    }
}
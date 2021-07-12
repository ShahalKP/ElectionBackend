window.onload = function () {
  console.log("loaded");

  render();
};
function render() {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container"
  );

  recaptchaVerifier.render();
}
$.ajax({
  url: "http://localhost:8080/voters",
  success: function (result, error) {
    console.log(result);
    console.log(":sdfsdfk");
  },
});

function phoneAuth() {
  let mobile = ["sdsf34", "+919633813458"];
  $.ajax({
    url: "http://localhost:8080/voters",
    success: function (result, error) {
      for (var i = 0; i < result.length; i++) {
        console.log("for function");
        var number = document.getElementById("number").value;
        console.log(result[i].mobile, number);
        if (number == "+" + result[i].mobile) {
          console.log("if function");
          firebase
            .auth()
            .signInWithPhoneNumber(number, window.recaptchaVerifier)
            .then(function (confirmationResult) {
              //s is in lowercase
              window.confirmationResult = confirmationResult;
              coderesult = confirmationResult;
              console.log(coderesult);
              alert("Message sent");
            })
            .catch(function (error) {
              alert(error.message);
            });
        }
      }
    },
  });
  //get the number
  //phone number authentication function of firebase
  //it takes two parameter first one is number,,,second one is recaptcha
}
function codeverify() {
  var code = document.getElementById("verificationCode").value;
  coderesult
    .confirm(code)
    .then(function (result) {
      //   alert("Successfully registered");
      window.location.href = "http://localhost:3000/home.html";
      var user = result.user;
      console.log(user);
    })
    .catch(function (error) {
      alert(error.message);
    });
}

console.log("Clinet side JS");

document.addEventListener("DOMContentLoaded", () => {
  const wform = document.querySelector(".wform");
  const p1 = document.querySelector(".p1");
  const p2 = document.querySelector(".p2");
  wform.addEventListener("submit", (event) => {
    p1.textContent = "Loading...";
    p2.textContent="";
    event.preventDefault();
    const address = document.querySelector(".address").value;
    fetch(`/weather?address=${address}`).then(
      (response) => {
        response.json().then((data) => {
          if (data.error) {
            p1.textContent = data.error;
            p2.textContent="";
          } else {
            p1.textContent = data.location;
            p2.textContent = data.foreCast;
          }
        });
      }
    );
  });
});

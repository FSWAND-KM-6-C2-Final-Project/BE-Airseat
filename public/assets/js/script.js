function isLoading() {
  const loading = document.getElementById("loading");
  const inputName = document.getElementById("name");
  const inputRentPerDay = document.getElementById("rentPerDay");

  if (
    inputName &&
    inputName.value &&
    inputRentPerDay &&
    inputRentPerDay.value
  ) {
    loading.style.display = "block";
  }
}

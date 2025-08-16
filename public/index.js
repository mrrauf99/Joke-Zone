const category_box = $(".input-content").first();
const categories = category_box.find("input[type='checkbox']");
const jokeTypeInputs = $("#single, #twopart");
const idRangeInputs = $("#from, #to");
const jokeAmountInput = $("#joke-amount");

// Helper function to set border color
function setBorder(selector, condition) {
  $(selector).css("border-color", condition ? "red" : "white");
}

// ----------- Category Checkbox Enable/Disable -----------
function updateCategoryState() {
  const isCustomChecked = $("#custom").prop("checked");
  categories.prop("disabled", !isCustomChecked);
  setBorder(category_box, isCustomChecked && !categories.is(":checked"));
}

// Radio buttons change
category_box.find("input[type='radio']").on("change", updateCategoryState);
categories.on("change", updateCategoryState);
$("#custom, #any").on("change", updateCategoryState);

// ----------- ID Range Validation -----------
idRangeInputs.on("input", function () {
  const fromVal = Number($("#from").val());
  const toVal = Number($("#to").val());
  const currentVal = Number($(this).val());
  const maxVal = Number($(this).attr("max"));

  const isInvalid =
    $(this).val() === "" || // empty
    isNaN(currentVal) || // not a number
    currentVal < 0 || // negative
    currentVal > maxVal || // exceeds max
    fromVal > toVal; // from > to

  setBorder(".id-range", isInvalid);
});

// ----------- Joke Amount Validation -----------
jokeAmountInput.on("input", function () {
  const val = Number($(this).val());
  const maxVal = Number($(this).attr("max"));
  const isInvalid =
    $(this).val() === "" || isNaN(val) || val < 0 || val > maxVal;

  setBorder(".input-content:last", isInvalid);
});

// ----------- Joke Type Validation -----------
jokeTypeInputs.on("change", function () {
  const isChecked = jokeTypeInputs.is(":checked");
  setBorder(".joke-type", !isChecked);
});

// Initialize category state
updateCategoryState();

// Validation on page load
idRangeInputs.trigger("input");
jokeTypeInputs.trigger("change");

// Reset form
$(".reset").on("click", function (e) {
  e.preventDefault();

  // Uncheck all category checkboxes
  categories.prop("checked", false);

  // Reset input borders
  setBorder(".input-content", false);

  // Set "Any" category checked
  $("#any").prop("checked", true);

  // Reset language dropdown to English
  $("#language").val("en");

  // Uncheck all blacklist flags
  $(".blacklist-flags input[type='checkbox']").prop("checked", false);

  // Check JSON response format
  $("#json").prop("checked", true);

  // Check all joke-type checkboxes
  $(".joke-type input[type='checkbox']").prop("checked", true);

  // Clear search string input
  $("#search-string").val("");

  // Reset number range inputs
  $("#from").val("0");
  $("#to").val("318");

  // Reset joke amount input
  jokeAmountInput.val("1");

  // Reset result to default text
  $("pre").text('Set parameters and click "Send Request" above');
});

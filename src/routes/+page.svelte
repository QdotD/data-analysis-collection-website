<script>
  import { onMount } from "svelte";
  import { isEmail, isMobilePhone } from "validator";
  import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

  const phoneUtil = PhoneNumberUtil.getInstance();

  let firstName = "";
  let lastName = "";
  let email = "";
  let phoneNumber = "";
  let job = "";
  let country = "";
  let statusMessage = "";
  let formValid = false;
  let isSuccess = false;
  let SalaryUSD = "";
  let isSubmitting = false;
  let submitButtonText = "Submit";
  let age = "";

  let errors = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    job: "",
    country: "",
    SalaryUSD: "",
    age: "",
  };

  const checkValidity = () => {
    errors.firstName = firstName ? "" : "First name is required.";
    errors.lastName = lastName ? "" : "Last name is required.";
    errors.email = isEmail(email) ? "" : "Email is not valid.";
    errors.age = age ? "" : "Age is required.";

    let phoneResult = cleanAndValidatePhone(phoneNumber);
    errors.phoneNumber = phoneResult.error || "";
    if (!phoneResult.error) {
      phoneNumber = phoneResult.cleanedPhone;
    }

    errors.job = job ? "" : "Job is required.";
    errors.country = country ? "" : "Country is required.";

    errors.SalaryUSD =
      SalaryUSD === undefined ||
      SalaryUSD === null ||
      (!isNaN(SalaryUSD) && Number(SalaryUSD) >= 0)
        ? ""
        : "SalaryUSD is not valid.";

    formValid = Object.values(errors).every((error) => error === "");
  };

  function cleanAndValidatePhone(phoneNumber, defaultCountry = "US") {
    let parsedNumber;
    let cleanedPhone;

    try {
      // Remove extension if it exists
      phoneNumber = phoneNumber.split("x")[0];
      parsedNumber = phoneUtil.parseAndKeepRawInput(
        phoneNumber,
        defaultCountry
      );
    } catch (err) {
      console.error("Invalid phone number format: ", err);
      return { error: "Invalid phone number format." };
    }

    // Convert to E.164 format without checking if it's valid
    cleanedPhone = phoneUtil.format(parsedNumber, PhoneNumberFormat.E164);
    return { cleanedPhone };
  }

  onMount(() => {
    checkValidity();
  });

  async function handleSubmit() {
    if (!formValid || isSubmitting) {
      statusMessage = "Form is not valid. Please check your entries.";
      checkValidity();
      isSuccess = false;
      return;
    }

    isSubmitting = true; // set isSubmitting to true when a submission starts
    submitButtonText = "Submitting..."; // change the text displayed on the button when a submission starts

    // Clear all previous errors
    errors = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      job: "",
      country: "",
      SalaryUSD: "",
      age: "",
    };

    checkValidity();
    if (!formValid) {
      statusMessage = "Form is not valid. Please check your entries.";
      isSuccess = false;
      return;
    }

    try {
      const emailResponse = await fetch(
        `/api/validateEmail?email=${encodeURIComponent(email)}`
      );

      if (!emailResponse.ok) {
        throw new Error(
          `Server responded with status code ${emailResponse.status}`
        );
      }

      const emailData = await emailResponse.json();

      if (emailData.exists) {
        errors.email = "Email already exists.";
        isSuccess = false;
        return;
      }

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          job,
          country,
          SalaryUSD,
          age,
        }),
      });

      if (response.ok) {
        statusMessage = "User added successfully";
        isSuccess = true; // Set isSuccess to true when form submission is successful

        // Clear all fields after successful submission
        firstName = "";
        lastName = "";
        email = "";
        phoneNumber = "";
        job = "";
        country = "";
        SalaryUSD = "";
        age = "";

        // Reset touchedFields object
        touchedFields = {
          firstName: false,
          lastName: false,
          email: false,
          phoneNumber: false,
          job: false,
          country: false,
          SalaryUSD: false,
          age: false,
        };
      } else {
        statusMessage = "An error occurred";
        isSuccess = false; // Set isSuccess to false when an error occurred
      }
    } catch (error) {
      console.error("Error occurred:", error);
      statusMessage = "An error occurred. Please try again later.";
      isSuccess = false;
    } finally {
      isSubmitting = false; // set isSubmitting to false when a submission ends, whether it succeeded or failed
      submitButtonText = "Submit"; // change the text displayed on the button back to "Submit" when a submission ends
    }
  }

  let touchedFields = {
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    job: false,
    country: false,
    SalaryUSD: false,
    age: false,
  };

  const handleBlur = (fieldName) => {
    touchedFields[fieldName] = true;
    if (fieldName === "phoneNumber") {
      let phoneResult = cleanAndValidatePhone(phoneNumber);
      if (!phoneResult.error) {
        phoneNumber = phoneResult.cleanedPhone;
      }
    }
    checkValidity();
  };

  // Function to remove unwanted characters
  const sanitizeInput = (value) => {
    return value.replace(/\./g, "");
  };

  const handleInput = (fieldName, event) => {
    if (fieldName === "phoneNumber") {
      phoneNumber = event.target.value;
    } else {
      // Handle other fields if needed
    }
    checkValidity(); // validate the form fields each time the input changes
  };
</script>

<form id="form_id" on:submit|preventDefault={handleSubmit}>
  <input
    id="first_name_input_id"
    type="text"
    bind:value={firstName}
    on:blur={() => handleBlur("firstName")}
    placeholder="First Name"
    required
  />
  {#if errors.firstName && touchedFields.firstName}<p class="error">
      {errors.firstName}
    </p>{/if}

  <input
    id="last_name_input_id"
    type="text"
    bind:value={lastName}
    on:blur={() => handleBlur("lastName")}
    placeholder="Last Name"
    required
  />
  {#if errors.lastName && touchedFields.lastName}<p class="error">
      {errors.lastName}
    </p>{/if}

  <input
    id="age_input_id"
    type="number"
    bind:value={age}
    on:blur={() => handleBlur("age")}
    placeholder="Age"
    required
  />
  {#if errors.age && touchedFields.age}<p class="error">
      {errors.age}
    </p>{/if}

  <input
    id="email_input_id"
    type="email"
    bind:value={email}
    on:blur={() => handleBlur("email")}
    placeholder="Email"
    required
  />
  {#if errors.email && touchedFields.email}<p class="error">
      {errors.email}
    </p>{/if}

  <input
    id="phone_number_input_id"
    type="tel"
    bind:value={phoneNumber}
    on:blur={() => handleBlur("phoneNumber")}
    on:input={(event) => handleInput("phoneNumber", event)}
    placeholder="Phone Number"
    required
  />

  {#if errors.phoneNumber && touchedFields.phoneNumber}<p class="error">
      {errors.phoneNumber}
    </p>{/if}

  <input
    id="job_input_id"
    type="text"
    bind:value={job}
    on:blur={() => handleBlur("job")}
    placeholder="Job"
    required
  />
  {#if errors.job && touchedFields.job}<p class="error">{errors.job}</p>{/if}

  <input
    id="country_input_id"
    type="text"
    bind:value={country}
    on:blur={() => handleBlur("country")}
    placeholder="Country"
    required
  />
  {#if errors.country && touchedFields.country}<p class="error">
      {errors.country}
    </p>{/if}

  <input
    id="SalaryUSD_input_id"
    type="number"
    bind:value={SalaryUSD}
    on:blur={() => handleBlur("SalaryUSD")}
    placeholder="SalaryUSD"
    required
  />
  {#if errors.SalaryUSD && touchedFields.SalaryUSD}<p class="error">
      {errors.SalaryUSD}
    </p>{/if}

  {#if statusMessage}
    <p class={isSuccess ? "success" : "error"}>{statusMessage}</p>
  {/if}

  <button
    id="submit_button_id"
    type="submit"
    disabled={!formValid || isSubmitting}
    class:submitting={isSubmitting}>{submitButtonText}</button
  >
</form>

<style>
  :global(body) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  label {
    margin-bottom: 10px;
    font-size: 0.9em;
  }

  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border 0.3s ease;
    font-size: 0.9em;
  }

  input:focus {
    border-color: #888;
  }

  button {
    margin-top: 20px;
    padding: 10px;
    border: none;
    background-color: #888;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1em;
  }

  button:hover {
    background-color: #666;
  }

  button.submitting {
    background-color: #999;
  }

  button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }

  p {
    color: red;
    text-align: center;
  }

  p.error {
    color: #900;
    font-size: 0.8em;
  }

  p.success {
    color: green;
    text-align: center;
  }

  /* For Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* For Chrome, Safari, Edge, Opera */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>

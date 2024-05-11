<script>
  // imports
  import { createClient } from "@supabase/supabase-js";

  // form vars
  let first_name = "";
  let last_name = "";
  let email = "";
  let phone_number = "";
  let age = "";
  let job = "";
  let salary_usd = "";
  let country = "";

  // status vars
  let statusMessage = "";
  let isSuccess = false;
  let isSubmitting = false;
  let submitButtonText = "Submit";

  // supabase setup
  let supabase;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
  supabase = createClient(supabaseUrl, supabaseKey, {
    persistSession: false,
  });

  // Function to verify if email exists
  async function emailExists() {
    let { data: users, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    return error || users.length > 0 ? true : false;
  }

  // Function to submit the form data to Supabase
  async function submitToSupabase() {
    const { error: insertError } = await supabase.from("users").insert({
      first_name,
      last_name,
      email,
      phone_number,
      job,
      country,
      salary_usd,
      age,
    });

    if (insertError) {
      console.error("Error inserting into users:", insertError);
      return true;
    } else {
      return false;
    }
  }

  // reset form
  const resetForm = () => {
    first_name = "";
    last_name = "";
    email = "";
    phone_number = "";
    age = "";
    job = "";
    salary_usd = "";
    country = "";
  };

  // helper function to get client_id
  function getClientIdFromGaCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; _ga=`);
    if (parts.length === 2) {
      const gaValue = parts.pop().split(";").shift();
      const clientId = gaValue.split(".").slice(2).join(".");
      return clientId;
    }
    return null;
  }

  // Main function to handle the form submission
  async function handleSubmit() {
    isSubmitting = true;
    submitButtonText = "Submitting...";

    // Verify if email already exists
    if (await emailExists()) {
      statusMessage = "Email already exists.";
      isSuccess = false;
      isSubmitting = false;
      submitButtonText = "Submit";
      return;
    }

    // Post the form data to Supabase
    if (await submitToSupabase()) {
      statusMessage = "An error occurred";
      isSuccess = false;
    } else {
      statusMessage = "User added successfully";
      isSuccess = true;

      // Grab the client_id from _ga cookie
      const clientId = getClientIdFromGaCookie();

      // Push form_submit to dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "form_submit",
        client_id: clientId,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
        age: age,
        job: job,
        country: country,
        salary_usd: salary_usd,
      });

      isSubmitting = false;
      submitButtonText = "Submit";
      resetForm();
    }

    // Google Analytics 4 (GA4)
    gtag("event", "submit", {
      event_category: "Form",
      event_label: "Form Submission",
    });

    isSubmitting = false;
    submitButtonText = "Submit";
    resetForm();
  }
</script>

<svelte:head>
  <title>Form</title>
  <meta name="description" content="Form to collect fake data" />
</svelte:head>

<form id="form_id" on:submit|preventDefault={handleSubmit}>
  <input
    id="first_name_input_id"
    type="text"
    bind:value={first_name}
    placeholder="First Name"
    required
  />

  <input
    id="last_name_input_id"
    type="text"
    bind:value={last_name}
    placeholder="Last Name"
    required
  />

  <input
    id="age_input_id"
    type="number"
    bind:value={age}
    placeholder="Age"
    required
  />

  <input
    id="email_input_id"
    type="email"
    bind:value={email}
    placeholder="Email"
    required
  />

  <input
    id="phone_number_input_id"
    type="tel"
    bind:value={phone_number}
    placeholder="Phone Number"
    required
  />

  <input
    id="job_input_id"
    type="text"
    bind:value={job}
    placeholder="Job"
    required
  />

  <input
    id="country_input_id"
    type="text"
    bind:value={country}
    placeholder="Country"
    required
  />

  <input
    id="salary_usd_input_id"
    type="number"
    bind:value={salary_usd}
    placeholder="salary_usd"
    required
  />

  {#if statusMessage}
    <p class={isSuccess ? "success" : "error"}>{statusMessage}</p>
  {/if}

  <button id="submit_button_id" type="submit" class:submitting={isSubmitting}
    >{submitButtonText}</button
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
    background-color: #c1c767;
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

<svelte:head>
  <title>Jarrah Sandbox</title>
  <meta name="description" content="Tracking testing environment for Jarrah Growth Marketing" />
</svelte:head>

<a href="/" id="home_page_button" class="button">Home Page</a>


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

  button, .button {
    margin-top: 20px;
    padding: 10px;
    border: none;
    background-color: #888;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1em;
    text-decoration: none;
  }

  button, .button:hover {
    background-color: #666;
  }

  button.submitting {
    background-color: #c1c767;
  }

  button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
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

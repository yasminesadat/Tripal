import { axios } from "./axios";

export async function login(email, password) {
  try {
    await axios.post("/login", { email, password });
    return { status: "success", message: "Logged in successfully!" };
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
}

export function handleError(error) {
  let userFriendlyMessage = {
    status: "error",
    message: "An error occurred. Please try again.",
  };

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    switch (error.response.status) {
      case 400:
        userFriendlyMessage.message =
          error.response.data.message ||
          "Invalid request. Please check your input.";
        break;
      case 401:
        userFriendlyMessage.message =
          "Your request has been rejected. Contact support if you think this is a mistake";
        break;
      case 403:
        userFriendlyMessage.status = "warning";
        userFriendlyMessage.message =
          "Your request is still pending. Check your email for updates.";
        break;
      case 500:
        userFriendlyMessage.message =
          "Internal server error. Please try again later.";
        break;
      default:
        userFriendlyMessage.message =
          error.response.data.message || "An error occurred. Please try again.";
        break;
    }
  } else if (error.request) {
    // The request was made but no response was received
    userFriendlyMessage.message = "Please check your network connection.";
    userFriendlyMessage.status = "warning";
  }
  return userFriendlyMessage;
}

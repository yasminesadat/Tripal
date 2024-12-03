import { axios } from "./axios";

export async function requestOtp(body) {
    try {
      const response = await axios.post('/request-otp', body);
      return response;
    } catch (error) {
      console.error("Can't request OTP", error);
      throw error;
    }
  }
  
export async function validateOtp(body) {
    try {
        const response = await axios.post('/validate-otp', body);
        return response;
    } catch (error) {
        console.error("Can't validate OTP", error);
        throw error;
    }
}

export async function resetPassword(body) {
    try {
        const response = await axios.post('/reset-password', body);
        return response;
    } catch (error) {
        console.error("Can't reset password", error);
        throw error;
    }
}
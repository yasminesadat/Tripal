import { axios } from "./axios";

export async function createTourist(newUser) {
  try {
    const response = await axios.post("/createTourist", newUser);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
    throw new Error(errorMessage);
  }
}

export async function changeTouristPassword(oldPassword, newPassword) {
  try {
    const body = {
      "oldPassword": oldPassword,
      "newPassword": newPassword
    }
    const response = await axios.put(`/tourist-change-pass`, body);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function checkTouristPromoCode(promocode) {
  try {
    const response = await axios.post(`/tourist/checkPromoCode`, promocode);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTouristInformation() {
  try {
    const response = await axios.get(`/getTouristInfo`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function updateTouristInformation(body) {
  try {
    const response = await axios.put(`/updateTourist`, body);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function redeemPoints() {
  try {
    const response = await axios.post(`/redeem`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTouristItineraries() {
  try {
    const response = await axios.get(`/itineraries/booked-itineraries`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function getTouristActivities() {
  try {
    const response = await axios.get(`/booked-activities`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourist activities:", error);
    throw error;
  }
}

export async function getTouristUserName() {
  try {
    const response = await axios.get(`/tourist-name-email`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourist name and email:", error);
    throw error;
  }
}

export async function getTouristFlights() {
  try {
    const response = await axios.get(`/tourist/flights`);
    return response.data;
  } catch (error) {
    console.error("Error getting tourists' flights':", error);
    throw error;
  }
}

export async function getTouristAge() {
  try {
    const response = await axios.get(`/tourist/age`);
    return response.data;
  } catch (error) {
    console.error("Error getting age", error);
    throw error;
  }
}

export async function getTouristTags() {
  try {
    const response = await axios.get(`/tourist/preferences`);
    return response.data;
  } catch (error) {
    console.error("Error getting tags", error);
    throw error;
  }
}

export async function getTouristCategories() {
  try {
    const response = await axios.get(`/tourist/categories`);
    return response.data;
  } catch (error) {
    console.error("Error getting categories", error);
    throw error;
  }
}

export async function checkTouristExists() {
  try {
    const response = await axios.get(`/tourist/exists`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

export async function bookmarkEvent(eventId, eventType) {
  try {
    const response = await axios.post('/tourist/bookmark', { eventId, eventType });
    return response.data;
  } catch (error) {
    console.error("Error bookmarking event:", error);
    throw error;
  }
}

export async function getBookmarkedEvents() {
  try {
    const response = await axios.get('/tourist/bookmarks');
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function saveProduct(productId) {
  try {
    const response = await axios.post('/tourist/save-product', { productId });
    return response.data;
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    throw error;
  }
}

export async function removeWishList(productId) {
  try {
    await axios.post('/tourist/remove-wishlist', { productId });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    throw error;
  }
}

export async function getWishList() {
  try {
    const response = await axios.get('/tourist/wishlist');
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
}

export async function saveFlightBooking(flightDetails) {
  try {
    const response = await axios.post('/tourist/book-flight', flightDetails);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while saving the flight booking.";
    throw new Error(errorMessage);
  }
}

export async function completeFlightBooking(flightDetails) {
  try {
    const response = await axios.post('/tourist/flight-payment', flightDetails);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "An error occurred while saving the flight booking.";
    throw new Error(errorMessage);
  }
}

export async function getTouristNotifications() {
  try {
    const response = await axios.get('/tourist/notifications');
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

export async function addToCart(touristId, productId, quantity) {
  try {
    const response = await axios.post('/tourist/cart', {
      touristId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw error;
  }
}

export async function getCart() {
  try {
    const response = await axios.get(`/tourist/cart`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}

export async function removeFromCart(touristId, productId) {
  try {
    const response = await axios.delete('/tourist/cart', {
      data: {
        touristId,
        productId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
  }
}

export async function getAddresses() {
  try {
    const response = await axios.get(`/tourist/address`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}

export async function addAddress(street, city, country, zipCode) {
  try {
    const response = await axios.post('/tourist/address', {
      street, city, country, zipCode
    });
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error);
  }
}

export async function getWalletAndTotalPoints() {
  try {
    const response = await axios.get(`/tourist/wallet`);
    console.log("Incoming", response.data);
    return response.data;

  } catch (error) {
    console.error("Error fetching wallet:", error);
    throw error;
  }
}

export async function markNotifications() {
  try {
    const response = await axios.patch('/tourist/markNotifications');
    return response.data;
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
  }
}

export async function updateQuantity(productId, quantity) {
  try {
    const response = await axios.put('/tourist/product-quantity', {
      productId, quantity
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function checkStock(cart) {
  try {
    const response = await axios.post('/tourist/check-stock', {
      cart,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
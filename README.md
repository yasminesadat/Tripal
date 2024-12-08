 ![logo](https://github.com/user-attachments/assets/2d83d299-a3b9-4a42-a6f0-091d3e7add52)
--------
## Motivation  
Traveling is about creating unforgettable memories, exploring new destinations, and experiencing diverse cultures. However, planning a trip can often be overwhelming and time-consuming.  
**Tripal** was created to simplify the travel experience by providing tourists with a comprehensive platform to:  
- **Book activities and itineraries** tailored to their preferences.  
- **Explore historical places** with detailed insights and recommendations.  
- **Shop for unique products and souvenirs** directly from the app.
  
Our mission is to empower travelers with a seamless, enjoyable, and enriched journey, transforming how they explore the world.  

## Frameworks/Libraries used
[![MongoDB][MongoDB]][MongoDB-url]
[![Express.js][Express.js]][Express-url]
[![React][React.js]][React-url]
[![Node.js][Node.js]][Node-url]
[![npm][npm]][npm-url]

## Build Status
- This project is actively under development and is built and tested locally.
- No automated CI/CD tests are currently configured.
- Additional documentation and automation workflows should be added in the future.
## Setup the project locally:
### 1. Clone the repository
```
git clone https://github.com/dianarehan/Tripal.git
```
### 2. Install dependencies
```
npm install
cd backend
npm install
cd ..
cd frontend
npm install
cd ..
```

## How to use 
After installing all dependencies:
1. Add .env to the backend directory with the following format and replace the variables values with your own
```
NODE_ENV = development
PORT = 5050
MONGO_URI =
JWT_SECRET =
CLOUD_NAME = 
CLOUD_KEY =
CLOUD_KEY_SECRET =
AMADEUS_CLIENT_ID =
AMADEUS_CLIENT_SECRET =
clientId=
clientSecret=
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
FRONTEND_URL=
EMAIL_USER=
EMAIL_PASS=
```
2. To start the application
    ```npm start```

## Key features
* **User Management:** secure sign up and login for tourist, tour guide, seller and advertiser
* **Activities and Bookings:** Create, manage, and book activities, events, and itineraries with search and filter options for tourists.
* **Hotels and flights:** tourist can book hotels, flights and transportation.
* **Product Management:** Sellers can add, edit, and manage products. Tourists can browse, filter, and purchase products.
* **Payments & Cancellations:** Tourists can book and pay for events and activities, with options for cancellations and loyalty points.
* **Reviews & Ratings:** Users can rate and review activities, products, and tour guides.
* **Admin Controls:** Admins can manage users, approve profiles, handle complaints, and access reports.
* **Notifications:** Users receive notifications for bookings, promotions, and important updates.
<img width="960" alt="login" src="https://github.com/user-attachments/assets/51ff20c1-2a87-4044-9356-60ce62155b93">


<img width="960" alt="touristHome" src="https://github.com/user-attachments/assets/e933a77e-fd44-4349-8a52-5ecf584bcd5c">

##  API References
<details>
 <summary>Advertiser</summary>

#### 1. View Advertiser  
**Get** `/advertiser`  Views advertiser profile.  

#### 2. Update Advertiser  
**Put** `/advertiser`  Updates advertiser profile.  

#### 3. Update Advertiser Password
**Put** `/advertiser-change-pass`  Updates advertiser password.  

#### 4. View Advertiser Notifications
**Get** `/advertiser/notificationList`  Views advertiser notifications. 

#### 5. Update Advertiser Notifications 
**Patch** `/advertiser/markNotifications`  Marks notifications as read. 

</details>

<details>
 <summary>Activities</summary>

#### 1. Get Tourist Activities
**Get** `/booked-activities`  Views booked tourist activities.  

#### 2. Get Advertiser Activities
**Get** `/activities/advertiser` Views activities made by a certain advertiser.  

#### 3. Get Activity By Id
**Get** `/activity/:id` Views a certain activity.  

#### 4. Create Activity
**Post** `/activities` Creates a new activity. 

#### 5. Update Activity  
**Put** `/activities/:id`  Updates an activity. 

#### 6. Delete Activity  
**Delete** `/activities/:id`  Deletes an activity. 

#### 7. View Upcoming Activities  
**Get** `/activities/upcoming`  Views all upcoming activities. 

#### 8. Add Rating
**Post** `/activities/:id/ratings`  Post activity rating. 

#### 9. Get Ratings
**Get** `/activities/:id/ratings`  Get activity ratings. 

#### 10. Get Revenue
**Get** `/activities/revenue`  Gets total Revenue made by advertiser.

</details>

<details>
 <summary>Activity Category</summary>

#### 1.Create Activity Category
**Post** `/activityCategory`  

#### 2. Get Activity Categories
**Get** `/activityCategories`  

#### 3.Delete Activity Category
**Delete** `/activityCategory/:id`  

#### 4. Update Activity Category
**Put** `/activityCategory/:id` 

</details>

<details>
 <summary>Admin</summary>

#### 1.Delete User
**Delete** `/admin/user/:role/:userId`  

#### 2. Add Admin
**Post** `/admin/addAdmin`  

#### 3.Get All Users
**Get** `/admin/users`  

#### 4. Change Password
**Patch** `/admin-change-pass` Updates admin password

#### 5. Admin Flag Itinerary
**Put** `/admin/flag-itinerary/:itineraryId` Admin flags itinerary as inappropriate.

#### 6. Admin Flag Activity
**Patch** `/admin/flag-activity/:activityId` Admin flags activity as inappropriate.

#### 7. Get All Itineraries 
**Get** `/admin/itineraries` Get all itineraries for admin.

#### 8. Get All Activities 
**Get** `/admin/activities` Get all activities for admin.

#### 9. Create PromoCode
**Post** `/admin/promocode` 

#### 10. Get PromoCodes
**Get** `/admin/promocode` 

#### 11. Get Data For Event Owner
**Get** `/admin/getDataForEventOwner/:userId` Get username and email for event owner to send an email on flagging event.

#### 12. Get Total Users Count
**Get** `/admin/getTotalUsers` 

</details>

<details>
 <summary>Bookings</summary>

#### 1. Book Resource
**Post** `/:resourceType/:resourceId/book`  Book activity or itineray using tourist's wallet.

#### 2. Cancel Resource
**Post** `/:resourceType/:resourceId/cancel`  Cancel booking.

#### 3. Complete Booking
**Post** `/:resourceType/:resourceId/complete-booking`  Book activity or itineray using credit card (stripe)

</details>

<details>
 <summary>Complaints</summary>

#### 1. Create Complaint
**Post** `/complaint`  Tourist posts a complaint to the admin.

#### 2. Get Complaints By Tourist
**Get** `/complaints/tourist`  View all complaints for a certain tourist.

#### 3. Get All Complaints
**Get** `/complaints`  View all complaints for admin.

#### 4. Get Complaint By Id
**Get** `/complaints/:id`  View a certain complaint.

#### 5. Update Complaint Status
**Put** `/complaint/status/:id`  Admin update complaint status as pending out resolved.

#### 6. Reply To Complaint
**Put** `/complaint/reply/:id`  Admin or tourist reply to complaint.

</details>

<details>
 <summary>Flights</summary>

#### 1. Get Flights
**Get** `/flightSearch`  Search for flights.

#### 2. Get City Code
**Get** `/flightCity`  Seach for city code.

</details>

<details>
 <summary>Historical Places</summary>

#### 1. Get Tourism Governer Historical Places
**Get** `/historicalPlaces/tourismGoverner`  Get historical places of a certain governer.

#### 2. Get All Historical Places
**Get** `/historicalPlaces/`  

#### 3. Create Historical Place
**Post** `/historicalPlaces/`  

#### 4. Update Historical Place
**Put** `/historicalPlaces/:id` 

#### 5. Get Historical Place
**Get** `/historicalPlaces/:id` Get a certain historical place.

#### 6. Delete Historical Place
**Delete** `/historicalPlaces/:id` Delete a certain historical place.

</details>

<details>
 <summary>Historical Tags</summary>

#### 1. Create Type Tags
**Post** `/typetags`  Create tag for the type historical place.

#### 2. Create Period Tags
**Post** `/periodtags`  Create tag for historical period of the historical place.

#### 3. Get Historical Type Tags
**Get** `/typetags`  Get tags for the type.

#### 4. Get Historical Period Tags
**Get** `/periodtags` Get tags for the period.

#### 5. Get Historical Type Tag By Id
**Get** `/typetags/:id` 

#### 6. Get Historical Period Tag By Id
**Get** `/periodtags/id` 

</details>

<details>
 <summary>Hotel Booking</summary>

#### 1. Search Hotels
**Get** `/searchHotels`  Search for hotels.

#### 2. Get Hotel Prices
**Get** `/getHotelPrices`  View prices of a certain hotel.

#### 3. Search City Code
**Get** `/searchCity`  Gets city code.

#### 4. Save Booking
**Post** `/saveBooking`  

</details>

<details>
 <summary>Itineraries</summary>

#### 1. Get Itinerary By Id
**Get** `/itinerary/:id`  

#### 2. Get Tourguide Bookings
**Get** `/my-itineraries-bookings`  To get revenue for each tourguide.

#### 3. Create Itinerary
**Post** `/create-itinerary`  

#### 4. Get Itineraries For Tourguide
**Get** `/my-itineraries`   Get itineraries for a certain tourguide.

#### 5. Update Itinerary
**Put** `/itinerary/:id`

#### 6. Delete Itinerary
**Delete** `/itinerary/:id`

#### 7. view Upcoming Itineraries
**Get** `/itinerary/upcoming/view`  

#### 8. Get Tourist Itineraries
**Get** `/itineraries/booked-itineraries`  

#### 9. Add Rating
**Post** `/itinerary/:id/ratings`  

#### 10. Get Rating
**Get** `/itinerary/:id/ratings` 

#### 11. Get All Itineraries For Admin
**Get** `/itinerary`

#### 12. Toggle Itinerary Status
**Patch** `/itinerary/:id/status`

#### 12. Revenue
**Get** `/itineraries/revenue`  Gets revenue for each tour guide.
</details>

<details>
 <summary>Orders</summary>

#### 1. Create Order
**Post** `/tourist/order` 

#### 2. Cancel Order
**Delete** `/tourist/order/:id`  

</details>

<details>
 <summary>OTP</summary>

#### 1. Request Otp
**Post** `/request-otp` 

#### 2. Validate Otp
**Post** `/validate-otp`  

#### 2. Reset Password
**Post** `/reset-password` 

</details>

<details>
 <summary>Preference Tags</summary>

#### 1. Get Preference Tags
**Get** `/pref-tags` 

#### 2. Create Preference Tags
**Post** `/pref-tags`  

#### 3. Update Preference Tags
**Put** `/pref-tags/:id` 

#### 4. Delete Preference Tags
**Delete** `/pref-tags/:id` 

</details>

<details>
 <summary>Products</summary>

#### 1. Create Product
**Post** `/products` 

#### 2. Get Products
**Get** `/products`  

#### 3. Search Products By Name
**Get** `/products/search` 

#### 4. Filter Products By Price
**Get** `/products/filter` 

#### 5. Sort Products By Ratings
**Get** `/products/sort` 

#### 6. Edit Product
**Patch** `/products/:id` 

#### 7. Add Rating
**Post** `/products/:id/ratings`

#### 8. Get Ratings
**Get** `/products/:id/ratings`

#### 9. Archive Product
**Patch** `/products/:id/archive`

#### 10. Unarchive Product
**Patch** `/products/:id/unarchive`

#### 11. Unarchive Product
**Patch** `/products/:id/unarchive`

#### 11. Revenue
**Get** `/products/revenue`

#### 11. Get Product Images
**Get** `/products/images`

</details>

<details>
 <summary>Request to Make Account</summary>

#### 1. Create Request
**Post** `/request`  Request to create an account (adveriser, seller, tour guide, etc..)

#### 2. Get Requests
**Get** `/request`  Admin view all requests

#### 3. Get Request By Id
**Get** `/request/:id` 

#### 4. Delete Request
**Delete** `/request/:id` 

#### 4. Set Request State
**Delete** `/request/:id` 

#### 5. Update Request
**Put** `/requestDocument/:id` 

#### 6. Request Account Deletion
**Delete** `/request-deletion`   Request to delete my account

</details>

<details>
 <summary>Seller</summary>
 
#### 1. Create Seller
**Post** `/seller` 

#### 2. Update Seller Data
**Put** `/seller` 

#### 3. Read Seller Data
**Get** `/seller` 

#### 4. Change Password
**Put** `/seller-change-pass` 

#### 5. Mark Notification Seller
**Patch** `/seller/markNotifications` 

#### 6. Get Notification Seller
**Get** `/seller/notificationList` 

</details>

<details>
 <summary>TourGuide</summary>
 
#### 1. Create TourGuide
**Post** `/tourGuide` 

#### 2. update Tourguide Data
**Patch** `/tourGuide` 

#### 3. Mark Notification Read
**Patch** `/tourGuide/markNotifications` 

#### 4. Update Tourguide Data
**Patch** `/tourGuide` 

#### 5. get Tourguide Notifications
**Get** `/tourGuide/notificationList` 

#### 6. delete Tourguide Notification
**Delete** `/tourGuide/deleteNotificationList/:id` 

#### 7. get Tourguide Info
**Get** `/tourGuide` 

#### 8. Add Rating
**Post** `/tourGuide/:id/ratings` 

#### 9. Get Rating
**Get** `/tourGuide/:id/ratings` 

#### 10. Change Password
**Get** `/tourGuide-change-pass` 

</details>

<details>
 <summary>Tourism Governer</summary>
 
#### 1. addTourismGovernor
**Post** `/governor` 

#### 2. getTourismGovernors
**Get** `/governor` 

#### 3. Read Seller Data
**Put** `/seller` 

</details>

<details>
 <summary>Tourist</summary>
 
#### 1. Create Tourist
**Post** `/createTourist`

#### 2. Update Tourist Profile
**Put** `/updateTourist`

#### 3. Get Tourist Info
**Get** `/getTouristInfo`

#### 4. Redeem Points
**Post** `/redeem`

#### 5. Change Password
**Put** `/tourist-change-pass`

#### 6. Get Tourist Name and Email
**Get** `/tourist-name-email`

#### 7. Get Booked Flights
**Get** `/tourist/flights`

#### 8. Get Tourist Age
**Get** `/tourist/age`

#### 9. Get Booked Hotels
**Get** `/tourist/bookedHotels`

#### 10. Get Tourist Preferences
**Get** `/tourist/preferences`

#### 11. Get Tourist Categories
**Get** `/tourist/categories`

#### 12. Check if User Exists
**Get** `/tourist/exists`

#### 13. Bookmark Event
**Post** `/tourist/bookmark`

#### 14. Get Bookmarked Events
**Get** `/tourist/bookmarks`

#### 15. Save Product
**Post** `/tourist/save-product`

#### 16. Get Wishlist
**Get** `/tourist/wishlist`

#### 17. Remove from Wishlist
**Post** `/tourist/remove-wishlist`

#### 18. Add to Cart
**Post** `/tourist/cart`

#### 19. Remove from Cart
**Delete** `/tourist/cart`

#### 20. Get Cart
**Get** `/tourist/cart`

#### 21. Book Flight
**Post** `/tourist/book-flight`

#### 22. Complete Flight Booking Payment
**Post** `/tourist/flight-payment`

#### 23. Get Random Promo Code
**Get** `/promoCode`

#### 24. Get Notifications
**Get** `/tourist/notifications`

#### 25. Check Promo Code
**Post** `/tourist/checkPromoCode`

#### 26. Get Address
**Get** `/tourist/address`

#### 27. Add Address
**Post** `/tourist/address`

#### 28. Get Wallet and Total Points
**Get** `/tourist/wallet`

#### 29. Mark Notifications as Read
**Patch** `/tourist/markNotifications`

#### 30. Update Product Quantity
**Put** `/tourist/product-quantity`

</details>


<details>
 <summary>User</summary>
 
#### 1. Login
**Post** `/login` 

#### 2. get User Data
**Get** `/user-data` 

#### 3. Logout
**Post** `/logout` 

</details>

## Code style
This project uses  [Prettier](https://prettier.io/)  to ensure consistent code formatting.

## Contribute
To contribute:
1. Fork the repo
2. Create a new branch ```git checkout -b feature```
3. Add your changes
4. Commit your changes ```git commit -m 'add feature'```
5. Push to the branch ```git push origin feature```
6. Create a new Pull Request
7. The PR is to be reviewed and merged

## Credits
**Documentations**
- [MongoDB](https://www.mongodb.com/docs/) 
- [Mongoose](https://mongoosejs.com/docs/)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Node.js](https://nodejs.org/)
- [Nodemailer](https://nodemailer.com/about/)
- [Postman](https://www.postman.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Stripe](https://stripe.com/docs)
  
## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).  
See the LICENSE file for detailed terms and conditions.


[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/

[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Express-url]: https://expressjs.com/

[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/

[npm]: https://img.shields.io/badge/npm-8C150D?style=for-the-badge&logo=npm&logoColor=white
[npm-url]: https://www.npmjs.com/
